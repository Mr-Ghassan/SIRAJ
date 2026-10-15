#!/usr/bin/env python3
"""SIRAJ Brand Library v1.0.1 — sync the master library to Google Drive (Arabic folders), from the manifest.

  python3 -I tools/drive_sync.py --plan     → prints the upload plan (works anywhere, no Google account needed)
  In Colab (authenticated):  import drive_sync; drive_sync.run(drive_service)

Rules: reads brand-master-manifest.json + docs/library/drive-map.json; uploads only the identity library families;
never deletes, never overwrites, never touches «ملفات سراج الهندسية» or «09 ـ الموقع والتجربة الرقمية»; skips a file
that already exists in its target folder with the same name and size; records the GitHub path and SHA-256 in each
file's Drive description; verifies the uploaded size.
"""
import hashlib, json, os, sys
from collections import Counter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MIME = {'svg': 'image/svg+xml', 'pdf': 'application/pdf', 'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
        'webp': 'image/webp', 'webm': 'video/webm', 'mp4': 'video/mp4', 'ttf': 'font/ttf', 'woff2': 'font/woff2',
        'json': 'application/json', 'css': 'text/css', 'csv': 'text/csv', 'txt': 'text/plain', 'gpl': 'text/plain',
        'ase': 'application/octet-stream', 'ai': 'application/postscript', 'cube': 'text/plain', 'md': 'text/markdown',
        'scss': 'text/plain', 'swift': 'text/plain', 'kt': 'text/plain'}


def load():
    M = json.load(open(os.path.join(ROOT, 'brand-master-manifest.json'), encoding='utf-8'))
    D = json.load(open(os.path.join(ROOT, 'docs', 'library', 'drive-map.json'), encoding='utf-8'))
    return M, D


def plan():
    M, D = load()
    items, skipped = [], Counter()
    for e in M['entries']:
        fam = D['families'].get(e['category'])
        if not fam or e['id'] in D['exclude_entries']:
            skipped[e['category'] if not fam else 'excluded entry'] += len(e['files'])
            continue
        target = fam.get(e['status'])
        if not target:
            skipped[f"no folder for {e['category']} / {e['status']}"] += len(e['files'])
            continue
        files = D['only_files'].get(e['id'], e['files'])
        for f in files:
            ext = f.rsplit('.', 1)[-1].lower()
            if ext in D['exclude_ext'] or f in D['exclude_files']:
                skipped['code / docs / excluded file'] += 1
                continue
            folder = target.get(ext, target.get('_default')) if isinstance(target, dict) else target
            if not folder:
                skipped[f'no folder for .{ext}'] += 1
                continue
            items.append({'path': f, 'folder': folder, 'entry': e['id'], 'status': e['status']})
    for x in D['extra']:
        items.append({'path': x['path'], 'folder': x['folder'], 'entry': 'extra', 'status': 'INDEX'})
    # one file per path; names unique per folder (identical names, e.g. OFL.txt, get their parent folder as prefix)
    seen, out = set(), []
    for it in items:
        if it['path'] in seen:
            continue
        seen.add(it['path'])
        out.append(it)
    names = Counter((it['folder'], os.path.basename(it['path'])) for it in out)
    for it in out:
        base = os.path.basename(it['path'])
        it['name'] = D['rename'].get(it['path']) or (base if names[(it['folder'], base)] == 1 else f"{os.path.basename(os.path.dirname(it['path']))}_{base}")
    clash = [k for k, v in Counter((it['folder'], it['name']) for it in out).items() if v > 1]
    if clash:
        raise SystemExit(f'name clash in Drive plan: {clash[:5]}')
    return out, skipped, D


def sha256(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def run(drive, dry=False):
    from googleapiclient.http import MediaFileUpload
    items, skipped, D = plan()
    existing = {}

    def listing(folder):
        if folder not in existing:
            got, token = {}, None
            while True:
                r = drive.files().list(q=f"'{folder}' in parents and trashed = false", fields='nextPageToken, files(id,name,size)',
                                       pageSize=1000, pageToken=token).execute()
                for f in r.get('files', []):
                    got[f['name']] = int(f.get('size', 0) or 0)
                token = r.get('nextPageToken')
                if not token:
                    break
            existing[folder] = got
        return existing[folder]

    done = skip = bad = 0
    for i, it in enumerate(items, 1):
        p = os.path.join(ROOT, it['path'])
        size = os.path.getsize(p)
        have = listing(it['folder'])
        if it['name'] in have:
            if have[it['name']] == size:
                skip += 1
                continue
            print(f"⚠ exists with a different size, not overwritten: {it['name']}")
            bad += 1
            continue
        if dry:
            done += 1
            continue
        ext = p.rsplit('.', 1)[-1].lower()
        body = {'name': it['name'], 'parents': [it['folder']],
                'description': f"SIRAJ Brand Library v1.0.1 · {it['status']} · GitHub: {it['path']} · SHA-256: {sha256(p)}"}
        media = MediaFileUpload(p, mimetype=MIME.get(ext, 'application/octet-stream'), resumable=size > 5 * 1024 * 1024, chunksize=32 * 1024 * 1024)
        r = drive.files().create(body=body, media_body=media, fields='id,size').execute()
        if int(r.get('size', 0)) != size:
            print(f"✗ size mismatch after upload: {it['name']}")
            bad += 1
        else:
            done += 1
            have[it['name']] = size
        if i % 25 == 0:
            print(f'… {i}/{len(items)}')
    verb = 'to upload' if dry else 'uploaded'
    print(f'Drive sync: {done} {verb} · {skip} already present · {bad} problems · {len(items)} files in the plan')
    return bad == 0


if __name__ == '__main__':
    items, skipped, D = plan()
    by_folder = Counter(it['folder'] for it in items)
    total = sum(os.path.getsize(os.path.join(ROOT, it['path'])) for it in items)
    print(f'plan: {len(items)} files · {total / 1048576:.1f} MB · {len(by_folder)} folders')
    for k, v in sorted(skipped.items()):
        print(f'  not synced: {v:4}  {k}')
    if '--plan' in sys.argv and '--verbose' in sys.argv:
        for it in items:
            print(f"  {it['folder'][:8]}… {it['name']}")
