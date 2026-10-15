#!/usr/bin/env python3
"""Build the Colab notebook that syncs the SIRAJ Brand Master Library v1.0.1 to Google Drive.

  python3 -I tools/build-drive-sync-notebook.py
  → docs/library/SIRAJ_Drive-Sync_Library_v1.0.1.ipynb

The notebook only authenticates, clones the library branch and calls tools/drive_sync.py; every rule (targets, exclusions,
no delete, no overwrite, size check) lives in that tool and in docs/library/drive-map.json so it can be reviewed in GitHub.
"""
import json, os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'docs', 'library', 'SIRAJ_Drive-Sync_Library_v1.0.1.ipynb')
REF = 'siraj-brand-library-v1.0.1'  # the release tag; falls back to main
REPO_FALLBACK = 'main'
REPO = 'Mr-Ghassan/SIRAJ'


def md(text):
    return {'cell_type': 'markdown', 'metadata': {}, 'source': text.strip('\n').splitlines(True)}


def code(text):
    return {'cell_type': 'code', 'metadata': {}, 'execution_count': None, 'outputs': [], 'source': text.strip('\n').splitlines(True)}


cells = [
    md('''
# مزامنة مكتبة هوية سراج ـ الإصدار 1.0.1

يرفع هذا الدفتر ملفات المكتبة المعتمدة من GitHub إلى مجلد «01 ـ الهوية البصرية الرسمية» في Google Drive، كلٌّ في مجلده العربي
(المصدر · ملفات الإنتاج · المعاينة)، ويضع الدليل الرسمي 1.0.1 في «02 ـ دليل الهوية الرسمي».

- لا يحذف شيئًا ولا يستبدل ملفًا موجودًا؛ الملف الموجود بالاسم والحجم نفسيهما يُتخطّى، فيمكن تشغيله أكثر من مرة بأمان.
- لا يقترب من «ملفات سراج الهندسية» ولا من «09 ـ الموقع والتجربة الرقمية».
- يكتب في وصف كل ملف مساره في GitHub وبصمته SHA-256، ويتحقق من الحجم بعد الرفع.

شغّل الخلايا بالترتيب: ١ ← ٢ ← ٣ ← ٤.
'''),
    md('## ١ ـ تسجيل الدخول إلى Google Drive'),
    code('''
from google.colab import auth
auth.authenticate_user()
from googleapiclient.discovery import build
drive = build('drive', 'v3')
print('✓ Drive جاهز:', drive.about().get(fields='user(emailAddress)').execute()['user']['emailAddress'])
'''),
    md('## ٢ ـ تنزيل المكتبة من GitHub\nإن كان المستودع خاصًا، الصق رمز GitHub (صلاحية قراءة فقط تكفي). الرمز لا يُحفظ في الدفتر.'),
    code(f'''
import getpass, os, subprocess
token = getpass.getpass('رمز GitHub (اتركه فارغًا إن كان المستودع عامًا): ').strip()
url = f'https://{{token}}@github.com/{REPO}.git' if token else 'https://github.com/{REPO}.git'
if not os.path.isdir('/content/siraj'):
    for ref in ('{REF}', '{REPO_FALLBACK}'):
        r = subprocess.run(['git', 'clone', '--depth', '1', '--branch', ref, url, '/content/siraj'], capture_output=True, text=True)
        print(ref, '→', (r.stderr.replace(token, '***') if token else r.stderr).strip()[-300:])
        if r.returncode == 0:
            break
    subprocess.run(['git', '-C', '/content/siraj', 'remote', 'set-url', 'origin', 'https://github.com/{REPO}.git'])
del token, url
print(subprocess.run(['git', '-C', '/content/siraj', 'log', '-1', '--format=%h %s'], capture_output=True, text=True).stdout)
'''),
    md('## ٣ ـ معاينة الخطة (لا يرفع شيئًا)'),
    code('''
import sys
sys.path.insert(0, '/content/siraj/tools')
import drive_sync
items, skipped, _ = drive_sync.plan()
print(len(items), 'ملفًا في الخطة')
drive_sync.run(drive, dry=True)
'''),
    md('## ٤ ـ الرفع\nيستغرق نحو 10 ـ 20 دقيقة (≈ 370 ميغابايت). إن انقطع، أعد تشغيل هذه الخلية: يكمل من حيث توقف.'),
    code('''
ok = drive_sync.run(drive)
print('✓ اكتملت المزامنة' if ok else '⚠ راجع الرسائل أعلاه')
'''),
]

nb = {'cells': cells, 'metadata': {'colab': {'name': 'SIRAJ_Drive-Sync_Library_v1.0.1.ipynb'},
                                   'kernelspec': {'name': 'python3', 'display_name': 'Python 3'},
                                   'language_info': {'name': 'python'}},
      'nbformat': 4, 'nbformat_minor': 0}

with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(nb, f, ensure_ascii=False, indent=1)
    f.write('\n')
print('wrote', os.path.relpath(OUT, ROOT))
