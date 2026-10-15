#!/usr/bin/env python3
"""SIRAJ Brand Library audit (v1.0.1) — physical inventory and integrity check.

Opens every file in the identity library by its real format instead of trusting names or documentation:
  SVG/XML parse · raster decode (PIL verify + full load) · PDF/AI page count + first-page render · font load (fontTools)
  · video/audio probe (ffprobe) · ZIP CRC test · JSON parse · ASE header · GPL/CSV/CUBE read.
Also: SHA-256 for duplicate detection, and a check that every repository path quoted in the library's Markdown/HTML/
JSON/CSS/JS sources exists.

Usage:  python3 -I tools/audit-library.py [--out docs/library/audit] [--quick]
        --quick skips PDF page rendering and video probing (structure checks only).
Exit 1 if any file fails to open or any quoted path is missing.
"""
import glob, hashlib, json, os, re, subprocess, sys, zipfile
from collections import defaultdict
from xml.etree import ElementTree as ET

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
QUICK = '--quick' in sys.argv
OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else 'docs/library/audit'

# The identity library (what this phase is about). Applications (11-Social, 12-Print, 13-Presentations,
# 14-Property-Marketing posts, 19-Templates) are inventoried too, so references can be checked, but marked APPLICATION.
FAMILIES = [
    ('00-Brand-Foundation', 'foundation'), ('01-Logos', 'logos'), ('02-Colours', 'colours'), ('03-Typography', 'typography'),
    ('04-Grids', 'grids'), ('05-Graphic-System', 'graphic-system'), ('06-SIRAJ-Silk', 'silk'), ('07-Icon-System', 'icons'),
    ('08-Photography', 'photography'), ('09-Design-System', 'design-tokens'), ('design-system', 'design-system'),
    ('motion-system', 'motion-tokens'), ('15-Motion-System', 'motion-library'), ('16-Intro', 'intro'), ('17-Outro', 'outro'),
    ('18-3D', '3d'), ('20-Brand-Guidelines', 'guidelines'), ('14-Property-Marketing', 'silk-and-light'),
    ('21-Brand-Kit', 'brand-kit'), ('11-Social', 'application'), ('12-Print', 'application'), ('13-Presentations', 'application'),
    ('19-Templates', 'application'), ('99-Archive', 'archive'), ('tools', 'tooling'), ('docs', 'docs'),
    ('.claude/skills/siraj-brand-system', 'skill'),
]
SKIP_DIRS = {'node_modules', '.git', '_build', 'split', '__pycache__', '.cache'}
ROOT_FILES = ['AGENTS.md', 'README.md', 'ASSET-INDEX.md', 'BRAND_STATUS.md', 'DESIGN_SYSTEM_STATUS.md', 'MOTION_SYSTEM_STATUS.md',
              'CHANGELOG.md', 'RELEASE_NOTES_v1.0.md', 'SIRAJ_v1.0_SHA256SUMS.txt', 'package.json']


def sha256(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def run(cmd, timeout=120):
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    return r.returncode, r.stdout, r.stderr


def check_svg(p):
    tree = ET.parse(p)
    root = tree.getroot()
    if not root.tag.endswith('svg'):
        raise ValueError('root element is not <svg>')
    info = {'viewBox': root.get('viewBox')}
    is_sprite = any(c.tag.endswith('symbol') for c in root.iter())
    if not info['viewBox'] and not (root.get('width') and root.get('height')) and not is_sprite:
        raise ValueError('no viewBox and no width/height')
    info['sprite'] = is_sprite
    txt = open(p, encoding='utf-8', errors='replace').read()
    fills = sorted(set(m.upper() for m in re.findall(r'#[0-9A-Fa-f]{6}\b', txt)))
    info['colours'] = fills[:12]
    info['raster_inside'] = 'data:image' in txt or '<image' in txt
    info['text_nodes'] = bool(re.search(r'<text[\s>]', txt))
    return info


def check_raster(p):
    from PIL import Image
    with Image.open(p) as im:
        im.verify()
    with Image.open(p) as im:
        im.load()
        return {'w': im.width, 'h': im.height, 'mode': im.mode, 'alpha': im.mode in ('RGBA', 'LA', 'PA') or 'transparency' in im.info}


def check_pdf(p):
    code, out, err = run(['pdfinfo', p])
    if code:
        raise ValueError('pdfinfo: ' + err.strip()[:200])
    pages = int(re.search(r'Pages:\s+(\d+)', out).group(1))
    size = re.search(r'Page size:\s+([\d.]+) x ([\d.]+) pts', out)
    info = {'pages': pages, 'page_pts': [float(size.group(1)), float(size.group(2))] if size else None}
    if not QUICK:
        code, _, err = run(['pdftoppm', '-f', '1', '-l', '1', '-r', '12', '-png', '-singlefile', p, os.path.join(TMP, 'pdfcheck')], timeout=180)
        if code:
            raise ValueError('first page does not render: ' + err.strip()[:200])
    return info


def check_font(p):
    from fontTools.ttLib import TTFont
    f = TTFont(p, lazy=True)
    name = f['name']
    fam = name.getDebugName(16) or name.getDebugName(1)
    sub = name.getDebugName(17) or name.getDebugName(2)
    wt = f['OS/2'].usWeightClass if 'OS/2' in f else None
    lic = name.getDebugName(13) or ''
    return {'font_family': fam, 'style': sub, 'weight': wt, 'glyphs': f['maxp'].numGlyphs, 'licence_in_font': lic[:80]}


def check_av(p):
    if QUICK:
        return {}
    code, out, err = run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,pix_fmt,sample_rate',
                          '-of', 'json', p])
    if code:
        raise ValueError('ffprobe: ' + err.strip()[:200])
    d = json.loads(out)
    streams = d.get('streams', [])
    if not streams:
        raise ValueError('no streams')
    v = next((s for s in streams if s.get('codec_type') == 'video'), None)
    a = next((s for s in streams if s.get('codec_type') == 'audio'), None)
    return {'duration': round(float(d.get('format', {}).get('duration', 0) or 0), 2),
            'video': f"{v['codec_name']} {v.get('width')}x{v.get('height')} {v.get('pix_fmt', '')}".strip() if v else None,
            'audio': f"{a['codec_name']} {a.get('sample_rate', '')}".strip() if a else None}


def check_zip(p):
    with zipfile.ZipFile(p) as z:
        bad = z.testzip()
        if bad:
            raise ValueError('CRC error in ' + bad)
        return {'entries': len(z.namelist())}


def check_ase(p):
    b = open(p, 'rb').read()
    if b[:4] != b'ASEF':
        raise ValueError('not an ASE file')
    n = int.from_bytes(b[8:12], 'big')
    return {'blocks': n}


def check_json(p):
    json.load(open(p, encoding='utf-8'))
    return {}


def check_text(p):
    open(p, encoding='utf-8').read()
    return {}


CHECKERS = {
    'svg': check_svg, 'png': check_raster, 'jpg': check_raster, 'jpeg': check_raster, 'webp': check_raster, 'gif': check_raster,
    'pdf': check_pdf, 'ai': check_pdf, 'ttf': check_font, 'otf': check_font, 'woff2': check_font, 'woff': check_font,
    'mp4': check_av, 'mov': check_av, 'webm': check_av, 'wav': check_av, 'mp3': check_av, 'm4a': check_av,
    'zip': check_zip, 'ase': check_ase, 'json': check_json,
    'gpl': check_text, 'csv': check_text, 'cube': check_text, 'md': check_text, 'txt': check_text,
}

# Repository paths quoted inside library sources: backticked/quoted/linked strings that start with a known top folder.
TOPS = '|'.join(re.escape(d) for d, _ in FAMILIES if not d.startswith('.')) + r'|design-system|motion-system'
REF_RE = re.compile(r'(?<![\w/.-])((?:\.\./)*(?:' + TOPS + r')/[^\s`"\'()<>|,;*{}\[\]]+)')
REF_SRC_EXT = {'md', 'html', 'json', 'css', 'js', 'mjs', 'ts', 'py', 'sh'}


def family_of(rel):
    for d, fam in FAMILIES:
        if rel == d or rel.startswith(d + '/'):
            return d, fam
    return '', 'root'


def main():
    global TMP
    TMP = os.path.join(ROOT, 'tools', '.cache', 'audit')
    os.makedirs(TMP, exist_ok=True)
    files = []
    for d, _ in FAMILIES:
        base = os.path.join(ROOT, d)
        if not os.path.isdir(base):
            continue
        for cur, dirs, names in os.walk(base):
            dirs[:] = sorted(x for x in dirs if x not in SKIP_DIRS)
            for n in sorted(names):
                if n in ('.DS_Store',) or n.endswith(('.tmp', '.part')) or re.search(r'\.zip\.part\d+$', n):
                    continue
                files.append(os.path.relpath(os.path.join(cur, n), ROOT))
    files += [f for f in ROOT_FILES if os.path.exists(os.path.join(ROOT, f))]

    inv, failures, by_hash = [], [], defaultdict(list)
    for i, rel in enumerate(files):
        p = os.path.join(ROOT, rel)
        ext = rel.rsplit('.', 1)[-1].lower() if '.' in os.path.basename(rel) else ''
        top, fam = family_of(rel)
        rec = {'path': rel, 'family': fam, 'ext': ext, 'bytes': os.path.getsize(p)}
        if rec['bytes'] == 0:
            rec['error'] = 'empty file'
        else:
            fn = CHECKERS.get(ext)
            try:
                if fn:
                    rec.update(fn(p) or {})
                    rec['opened'] = True
                else:
                    rec['opened'] = None  # format not checked (code/config) — exists and is non-empty
            except Exception as e:  # noqa: BLE001 — every failure is reported, never hidden
                rec['error'] = f'{type(e).__name__}: {e}'[:300]
        if 'error' in rec:
            failures.append(rec)
        if rec['bytes'] and not rel.startswith(('tools/', 'docs/')):
            rec['sha256'] = sha256(p)
            by_hash[rec['sha256']].append(rel)
        inv.append(rec)
        if (i + 1) % 200 == 0:
            print(f'… {i + 1}/{len(files)}', file=sys.stderr)

    # Quoted repository paths that do not exist (library + guidelines sources; archive excluded on purpose).
    missing = []
    for rec in inv:
        rel = rec['path']
        if rec['ext'] not in REF_SRC_EXT or rel.startswith(('99-Archive/', 'docs/library/')) or rel.endswith(('ASSET-INDEX.md', 'audit-library.py', 'qa-brand.js', 'qa-library.py')):
            continue
        txt = open(os.path.join(ROOT, rel), encoding='utf-8', errors='replace').read()
        for m in REF_RE.finditer(txt):
            ref = m.group(1).rstrip('.:')
            if re.search(r'[$*<>{}\\]|\.\.\.|…|[_-]$', ref) or '\n' in ref:
                continue  # templated, concatenated (prefix) or elided path
            cand = [os.path.normpath(os.path.join(ROOT, os.path.dirname(rel), ref)), os.path.normpath(os.path.join(ROOT, ref.lstrip('./')))]
            cand.append(os.path.normpath(os.path.join(ROOT, re.sub(r'^(\.\./)+', '', ref))))
            top = family_of(rel)[0]
            if top:
                cand.append(os.path.normpath(os.path.join(ROOT, top, ref)))
            # a path quoted without its extension (the build adds .mp4/.webm/…) counts when a file starts with it
            if not any(os.path.exists(c) or os.path.exists(c.rstrip('/')) or glob.glob(glob.escape(c) + '.*') for c in cand):
                missing.append({'in': rel, 'ref': ref})

    dups = {h: ps for h, ps in by_hash.items() if len(ps) > 1}
    os.makedirs(os.path.join(ROOT, OUT), exist_ok=True)
    json.dump({'files': inv, 'failures': failures, 'missing_refs': missing, 'duplicates': list(dups.values())},
              open(os.path.join(ROOT, OUT, 'library-inventory.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    fams = defaultdict(lambda: [0, 0])
    for r in inv:
        fams[r['family']][0] += 1
        fams[r['family']][1] += r['bytes']
    print(f'files: {len(inv)} · opened by format: {sum(1 for r in inv if r.get("opened"))} · failures: {len(failures)} · '
          f'missing quoted paths: {len(missing)} · duplicate groups: {len(dups)}')
    for f, (n, b) in sorted(fams.items()):
        print(f'  {f:16} {n:5} files {b / 1048576:8.1f} MB')
    for r in failures[:60]:
        print('FAIL', r['path'], '—', r['error'])
    seen = set()
    for m in missing:
        k = (m['in'], m['ref'])
        if k in seen:
            continue
        seen.add(k)
        print('MISSING', m['ref'], '← quoted in', m['in'])
        if len(seen) >= 80:
            print('… more in library-inventory.json')
            break
    return 1 if failures or missing else 0


if __name__ == '__main__':
    sys.exit(main())
