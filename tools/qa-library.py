#!/usr/bin/env python3
"""SIRAJ Brand Master Library QA v1.0.1 — one command that proves the library is complete and production-safe.

  python3 -I tools/qa-library.py            → prints the report, writes docs/library/QA_REPORT_v1.0.1.md, exit 1 on failures
  python3 -I tools/qa-library.py --quick    → skips the per-page guide render and video probing

Checks (brief §28):
  manifest        every declared path exists and the manifest/index are not stale (tools/build-master-library.py --check)
  corrupt         every production file opens by its real format (SVG parse, image decode, PDF render, font load, A/V probe)
  dimensions      logo matrix widths, monogram squares, silk 4K ratios, render/KV sizes, favicon sizes
  logo-colours    each logo variant carries exactly its specified colours
  duplicates      intentional copies are still byte-identical to their master (Monochrome, Master, brand kit, skill)
  fonts           only Jost and Tajawal ship as brand fonts; every font folder carries its OFL licence
  guide           guide v1.0.1: 82 pages, every page renders without error, brand fonts embedded
  contact         phone 7771 4404, Instagram icon + SIRAJPROPERTIES (no «@»), WWW.SIRAJPROPERTIES.NET (tools/qa-brand.js)
  silk            no washed sheen, no yellow cast, maroon chroma (tools/qa-silk.py)
  archive         no production source loads a file from 99-Archive (except the documented «before» reference)
  references      paths quoted in library documentation exist
  placeholders    no PLACEHOLDER / Lorem / TODO / «asset pending» / postponed lettering in production sources
"""
import hashlib, importlib.util, json, os, re, subprocess, sys
from xml.etree import ElementTree as ET

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
QUICK = '--quick' in sys.argv
os.chdir(ROOT)
spec = importlib.util.spec_from_file_location('audit', os.path.join(ROOT, 'tools', 'audit-library.py'))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
audit.QUICK = QUICK
audit.TMP = os.path.join(ROOT, 'tools', '.cache', 'qa-library')
os.makedirs(audit.TMP, exist_ok=True)

results = []  # (check, status, detail)


def ok(check, detail):
    results.append((check, 'PASS', detail))


def fail(check, detail):
    results.append((check, 'FAIL', detail))


def warn(check, detail):
    results.append((check, 'NOTE', detail))


def run(cmd, timeout=900):
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    return r.returncode, (r.stdout + r.stderr).strip()


def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


# ---- manifest ------------------------------------------------------------------------------------------------------
code, out = run(['python3', '-I', 'tools/build-master-library.py', '--check'])
(ok if code == 0 else fail)('manifest', out.splitlines()[-1] if out else 'no output')
M = json.load(open('brand-master-manifest.json', encoding='utf-8'))
prod_files = list(M['files'])

# ---- corrupt files ---------------------------------------------------------------------------------------------------
bad = []
for f in prod_files:
    ext = f.rsplit('.', 1)[-1].lower()
    fn = audit.CHECKERS.get(ext)
    if os.path.getsize(f) == 0:
        bad.append(f'{f}: empty')
        continue
    if fn:
        try:
            fn(f)
        except Exception as e:  # noqa: BLE001
            bad.append(f'{f}: {type(e).__name__}: {e}'[:200])
(fail if bad else ok)('corrupt', f'{len(prod_files)} production files opened by format' + ('' if not bad else ' · ' + '; '.join(bad[:5])))

# ---- dimensions ------------------------------------------------------------------------------------------------------
from PIL import Image  # noqa: E402
dim_err = []
for f, meta in M['files'].items():
    px = meta.get('px')
    if not px:
        continue
    w, h = px
    b = os.path.basename(f)
    m = re.search(r'_(\d+)px\.png$', b)
    if f.startswith('01-Logos/PNG/') and m and 'ClearSpace' not in b:
        if w != int(m.group(1)):
            dim_err.append(f'{f}: width {w} ≠ {m.group(1)}')
        if 'Monogram' in b or 'Favicon' in b:
            if w != h:
                dim_err.append(f'{f}: not square')
        elif abs(w / h - 98.163 / 28.11) > 0.01:
            dim_err.append(f'{f}: ratio {w / h:.3f} ≠ 3.492')
    if f.startswith('06-SIRAJ-Silk/Stills/') and not f.endswith('.webp'):
        want = {'16x9': (3840, 2160), '9x16': (2160, 3840)}
        for r, (ww, hh) in want.items():
            if f'_{r}_' in b and (w, h) != (ww, hh):
                dim_err.append(f'{f}: {w}×{h} ≠ {ww}×{hh}')
        if '_1x1_' in b and w != h:
            dim_err.append(f'{f}: 1:1 is {w}×{h}')
        if '_4x5_' in b and abs(w / h - 0.8) > 0.01:
            dim_err.append(f'{f}: 4:5 is {w}×{h}')
    if '/Source/Clean/' in f and b.endswith('_Clean_v1.0.jpg') and (w, h) != (3712, 4608):
        dim_err.append(f'{f}: render {w}×{h}')
    if '/Source/KeyVisuals/' in f and min(w, h) < 2500:
        dim_err.append(f'{f}: key visual below print resolution ({w}×{h})')
(fail if dim_err else ok)('dimensions', 'logo matrix, monograms, favicons, silk 4K ratios, renders, key visuals' + ('' if not dim_err else ' · ' + '; '.join(dim_err[:6])))

# ---- logo colours ----------------------------------------------------------------------------------------------------
EXPECT = {'Primary': {'#602733', '#AA9180'}, 'Deep': {'#2C0F12', '#AA9180'}, 'Sand': {'#D6C0B2', '#AA9180'}, 'White': {'#FFFFFF', '#D6C0B2'},
          'Mono-Black': {'#020202'}, 'Mono-White': {'#FFFFFF'}, 'Mono-Maroon': {'#602733'}, 'Mono-Deep': {'#2C0F12'}, 'Mono-Sand': {'#D6C0B2'}}
col_err = []
for v, want in EXPECT.items():
    for f in (f'01-Logos/SVG/SIRAJ_Logo_{v}_v1.0.svg', f'01-Logos/SVG/SIRAJ_Logo_{v}_v1.0_ClearSpace.svg'):
        got = set(c.upper() for c in re.findall(r'#[0-9A-Fa-f]{6}\b', open(f).read()))
        if got != want:
            col_err.append(f'{f}: {sorted(got)} ≠ {sorted(want)}')
for f in ('01-Logos/Master/SIRAJ_Logo_Master_v1.0.svg',):
    got = set(c.upper() for c in re.findall(r'#[0-9A-Fa-f]{6}\b', open(f).read()))
    if got != EXPECT['Primary']:
        col_err.append(f'{f}: {sorted(got)}')
for f in [p for p in prod_files if p.startswith('01-Logos/') and p.endswith('.svg') and '/Construction/' not in p]:  # the construction diagram is annotated
    t = open(f).read()
    if re.search(r'<text[\s>]', t) or '<image' in t:
        col_err.append(f'{f}: contains live text or an embedded image')
(fail if col_err else ok)('logo-colours', '9 variants + master: exact colour sets, no live text, no embedded rasters' + ('' if not col_err else ' · ' + '; '.join(col_err[:5])))

# ---- duplicates (intentional copies must not drift) -----------------------------------------------------------------
pairs = [(f'01-Logos/Monochrome/SIRAJ_Logo_{v}_v1.0.svg', f'01-Logos/SVG/SIRAJ_Logo_{v}_v1.0.svg') for v in ('Mono-Black', 'Mono-White', 'Mono-Maroon', 'Mono-Deep', 'Mono-Sand')]
pairs += [('01-Logos/Master/SIRAJ_Logo_Master_v1.0.svg', '01-Logos/SVG/SIRAJ_Logo_Primary_v1.0.svg'),
          ('01-Logos/Master/SIRAJ_Logo_Master-Reversed_v1.0.svg', '01-Logos/SVG/SIRAJ_Logo_Sand_v1.0.svg'),
          ('15-Motion-System/lib/siraj-motion-tokens.js', 'motion-system/tokens/build/siraj-motion.js')]
for d in ('21-Brand-Kit/Claude-Design-Kickoff/03_Fonts', '.claude/skills/siraj-brand-system/assets/fonts'):
    for f in os.listdir(d):
        if f.endswith('.ttf'):
            fam = 'Jost' if f.startswith('Jost') else 'Tajawal'
            pairs.append((f'{d}/{f}', f'03-Typography/fonts/{fam}/{f}'))
        if f.startswith('OFL-'):
            pairs.append((f'{d}/{f}', f"03-Typography/fonts/{f[4:-4]}/OFL.txt"))
drift = [f'{a} ≠ {b}' for a, b in pairs if sha(a) != sha(b)]
(fail if drift else ok)('duplicates', f'{len(pairs)} intentional copies identical to their master' + ('' if not drift else ' · ' + '; '.join(drift[:5])))

# ---- fonts and licences ----------------------------------------------------------------------------------------------
font_err = []
for cur, dirs, names in os.walk(ROOT):
    rel = os.path.relpath(cur, ROOT)
    if rel.startswith(('99-Archive', 'node_modules', '.git', 'website')) or '/node_modules' in rel:
        dirs[:] = []
        continue
    fonts = [n for n in names if n.lower().endswith(('.ttf', '.otf', '.woff', '.woff2'))]
    for n in fonts:
        fam = audit.check_font(os.path.join(cur, n))['font_family'] or ''
        if not fam.startswith(('Jost', 'Tajawal')):
            font_err.append(f'{rel}/{n}: unapproved font «{fam}»')
    if fonts and not any(n.upper().startswith('OFL') for n in names):
        font_err.append(f'{rel}: fonts without an OFL licence file')
(fail if font_err else ok)('fonts', 'only Jost + Tajawal outside the archive; every font folder has its SIL OFL licence' + ('' if not font_err else ' · ' + '; '.join(font_err[:5])))

# ---- guide -----------------------------------------------------------------------------------------------------------
G = '20-Brand-Guidelines/SIRAJ_Brand-Guidelines_v1.0.1.pdf'
code, info = run(['pdfinfo', G])
pages = int(re.search(r'Pages:\s+(\d+)', info).group(1)) if code == 0 else 0
gerr = [] if pages == 82 else [f'{pages} pages ≠ 82']
if not QUICK:
    for i in range(1, pages + 1):
        c, o = run(['pdftoppm', '-f', str(i), '-l', str(i), '-r', '8', '-png', '-singlefile', G, os.path.join(audit.TMP, 'g')])
        if c or o:
            gerr.append(f'page {i}: {o.splitlines()[0] if o else "render failed"}')
code, fonts = run(['pdffonts', G])
used = {re.sub(r'^[A-Z]{6}\+', '', l.split()[0]) for l in fonts.splitlines()[2:] if l.strip()}
brand = {f for f in used if f.startswith(('Jost', 'Tajawal'))}
other = sorted(used - brand)
if not brand:
    gerr.append('brand fonts not embedded')
not_embedded = [l.split()[0] for l in fonts.splitlines()[2:] if l.strip() and l.split()[-5] == 'no']
if not_embedded:
    gerr.append('fonts not embedded: ' + ', '.join(not_embedded))
(fail if gerr else ok)('guide', f'{G}: {pages} pages, ' + ('all pages render cleanly' if not QUICK else 'structure checked') + f'; brand fonts {len(brand)}' + ('' if not gerr else ' · ' + '; '.join(gerr[:5])))
if other:
    warn('guide', f'symbol fallback fonts present ({", ".join(other)}) for ✕ ◆ → glyphs that Jost/Tajawal do not contain — documented in 20-Brand-Guidelines/README.md')

# ---- contact rules (existing brand QA) --------------------------------------------------------------------------------
code, out = run(['node', 'tools/qa-brand.js'])
last = [l for l in out.splitlines() if l.strip()][-1] if out else ''
(ok if code == 0 else fail)('contact', 'tools/qa-brand.js · ' + last[:160])
lib_txt = [f for f in prod_files if f.endswith(('.md', '.json', '.css', '.html', '.svg', '.txt'))]
cbad = []
for f in lib_txt:
    t = open(f, encoding='utf-8', errors='replace').read()
    if re.search(r'(?<![\w.])@(SIRAJPROPERTIES|sirajproperties)\b', t):
        cbad.append(f'{f}: «@» before the handle')
    if re.search(r'(?<![\d+/:"\'=])77714404(?!\d)', t) and 'tel:' not in t and 'wa.me' not in t and 'brand.config' not in f:
        cbad.append(f'{f}: ungrouped phone')
(fail if cbad else ok)('contact', f'{len(lib_txt)} library text files: no «@» handle, phone grouped' + ('' if not cbad else ' · ' + '; '.join(cbad[:5])))

# ---- silk ------------------------------------------------------------------------------------------------------------
code, out = run(['python3', '-I', 'tools/qa-silk.py'])
(ok if code == 0 else fail)('silk', out.splitlines()[-1] if out else 'no output')

# ---- archive leakage -------------------------------------------------------------------------------------------------
ALLOW = {('20-Brand-Guidelines/source/siraj-brand-guidelines.html', '99-Archive/Pre-Luxe-Grade-v1.0/'), ('20-Brand-Guidelines/source/siraj-brand-guidelines.html', '99-Archive/Demo-Isolated'), ('20-Brand-Guidelines/source/siraj-brand-guidelines.html', '99-Archive/English-Dormant'), ('tools/silk-photo-import.py', '99-Archive'), ('00-Brand-Foundation/brand.config.json', '99-Archive'), ('11-Social/Templates/brand-data.js', '99-Archive'), ('tools/build-guidelines.js', '99-Archive/Pre-Luxe-Grade-v1.0/'), ('tools/build-guidelines.js', '99-Archive/Demo-Isolated'), ('tools/build-guidelines.js', '99-Archive/English-Dormant'), ('tools/archive-english.sh', '99-Archive/English-Dormant'),
         ('tools/build-silk.js', '99-Archive/Silk-CG-v1.0'), ('tools/qa-brand.js', '99-Archive'), ('tools/qa-library.py', '99-Archive'),
         ('tools/audit-library.py', '99-Archive'), ('tools/build-master-library.py', '99-Archive'), ('tools/build-index.js', '99-Archive'),
         ('tools/build-kit.sh', '99-Archive')}
leak = []
SCAN_EXT = ('.js', '.mjs', '.html', '.css', '.py', '.sh', '.json')
for cur, dirs, names in os.walk(ROOT):
    rel = os.path.relpath(cur, ROOT)
    if rel.startswith(('99-Archive', 'node_modules', '.git', 'docs', 'website', '21-Brand-Kit')) or 'node_modules' in rel or '/.cache' in rel:
        dirs[:] = []
        continue
    for n in names:
        if not n.endswith(SCAN_EXT) or n in ('brand-master-manifest.json', 'library-inventory.json'):
            continue
        f = os.path.normpath(os.path.join(rel, n))
        t = open(os.path.join(cur, n), encoding='utf-8', errors='replace').read()
        for m in re.finditer(r'99-Archive/[^\s\'"`)<>]*', t):
            # generated copies of brand.config.json (*brand-data.js) carry its policy notes, which name archive folders
            if not any(f == a and m.group(0).startswith(b) for a, b in ALLOW) and not n.endswith(('brand-data.js', 'brand-config.js')):
                leak.append(f'{f} → {m.group(0)[:80]}')
leak = sorted(set(leak))
(fail if leak else ok)('archive', 'no production source loads archived files (documented exceptions only)' + ('' if not leak else ' · ' + '; '.join(leak[:6])))

# ---- references ------------------------------------------------------------------------------------------------------
missing = []
for f in [p for p in prod_files if p.endswith('.md')] + ['BRAND_MASTER_ASSET_INDEX.md', 'AGENTS.md', '99-Archive/README.md']:
    t = open(f, encoding='utf-8', errors='replace').read()
    for m in audit.REF_RE.finditer(t):
        ref = m.group(1).rstrip('.:')
        if re.search(r'[$*<>{}\\]|\.\.\.|…|[_-]$', ref) or t[m.end():m.end() + 1] in '*{':
            continue  # glob pattern, template or prefix
        cands = [os.path.join(os.path.dirname(f), ref), ref, re.sub(r'^(\.\./)+', '', ref)]
        if not any(os.path.exists(c) or os.path.exists(c.rstrip('/')) for c in cands):
            missing.append(f'{f} → {ref}')
missing = sorted(set(missing))
(fail if missing else ok)('references', 'every repository path quoted in library documentation exists' + ('' if not missing else ' · ' + '; '.join(missing[:6])))

# ---- placeholders ----------------------------------------------------------------------------------------------------
PH = re.compile(r'\bPLACEHOLDER\b|Lorem ipsum|\bTODO\b|asset pending|class="missing"|مشروع سراج|Project-Siraj_Lettering')
ph = []
for f in [p for p in prod_files if p.endswith(('.html', '.svg', '.css', '.json')) and not p.endswith('brand.config.json')]:
    t = open(f, encoding='utf-8', errors='replace').read()
    if PH.search(t):
        ph.append(f'{f}: {PH.search(t).group(0)}')
(fail if ph else ok)('placeholders', 'no placeholder text, «asset pending» tiles or postponed lettering in production sources' + ('' if not ph else ' · ' + '; '.join(ph[:5])))

# ---- report ----------------------------------------------------------------------------------------------------------
fails = [r for r in results if r[1] == 'FAIL']
lines = ['# SIRAJ Brand Master Library — QA report v1.0.1', '',
         f'`python3 -I tools/qa-library.py{" --quick" if QUICK else ""}` · {len(results)} checks · **failures: {len(fails)}**', '',
         '| Check | Result | Detail |', '|---|---|---|'] + [f'| {c} | {"✅ PASS" if s == "PASS" else ("❌ FAIL" if s == "FAIL" else "ℹ️ NOTE")} | {d} |' for c, s, d in results] + ['']
os.makedirs('docs/library', exist_ok=True)
open('docs/library/QA_REPORT_v1.0.1.md', 'w', encoding='utf-8').write('\n'.join(lines))
for c, s, d in results:
    print(f'{s:4}  {c:12} {d[:220]}')
print(f'library QA: {len(results)} checks · failures: {len(fails)}')
sys.exit(1 if fails else 0)
