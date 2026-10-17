#!/usr/bin/env python3
"""SIRAJ content → Google Drive (Arabic names). Reads 11-Social/Content/drive-content-map.json.

  python3 -I tools/content_drive_sync.py --plan          → prints what would be uploaded
  In Colab: import content_drive_sync; content_drive_sync.run(drive)

Every item names a source file in the repository, a Drive folder ID and the Arabic file name to use there.
Never deletes, never overwrites: a file with the same name and size in the target folder is skipped.
"""
import json, os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MAP = os.path.join(ROOT, '11-Social', 'Content', 'drive-content-map.json')
MIME = {'png': 'image/png', 'jpg': 'image/jpeg', 'mp4': 'video/mp4', 'pdf': 'application/pdf', 'md': 'text/markdown'}


def items():
    m = json.load(open(MAP, encoding='utf-8'))
    out = []
    for batch in m['batches']:
        for it in batch['files']:
            out.append({'src': it['src'], 'folder': batch['folder'], 'name': it['name'], 'batch': batch['title']})
    return out


def run(drive, dry=False):
    from googleapiclient.http import MediaFileUpload
    cache, done, skip, bad = {}, 0, 0, 0
    for it in items():
        p = os.path.join(ROOT, it['src'])
        size = os.path.getsize(p)
        f = it['folder']
        if f not in cache:
            r = drive.files().list(q=f"'{f}' in parents and trashed = false", fields='files(name,size)', pageSize=1000).execute()
            cache[f] = {x['name']: int(x.get('size', 0) or 0) for x in r.get('files', [])}
        if it['name'] in cache[f]:
            skip += 1
            continue
        if dry:
            print('سيُرفع:', it['batch'], '←', it['name'])
            done += 1
            continue
        ext = p.rsplit('.', 1)[-1].lower()
        media = MediaFileUpload(p, mimetype=MIME.get(ext, 'application/octet-stream'), resumable=size > 5 * 1024 * 1024)
        r = drive.files().create(body={'name': it['name'], 'parents': [f], 'description': f"SIRAJ · {it['batch']} · GitHub: {it['src']}"},
                                 media_body=media, fields='id,size').execute()
        if int(r.get('size', 0)) == size:
            done += 1
            cache[f][it['name']] = size
            print('✓', it['name'])
        else:
            bad += 1
            print('✗', it['name'])
    print(f"{'للرفع' if dry else 'رُفع'}: {done} · موجود مسبقًا: {skip} · مشكلات: {bad}")
    return bad == 0


if __name__ == '__main__':
    its = items()
    miss = [i['src'] for i in its if not os.path.isfile(os.path.join(ROOT, i['src']))]
    print(len(its), 'files ·', 'missing:', miss or 'none')
    sys.exit(1 if miss else 0)
