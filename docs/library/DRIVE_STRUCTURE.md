# SIRAJ Brand Library — Google Drive structure (v1.0.1)

Google Drive is the operational file store; GitHub is the source of record. Drive folders are **Arabic**; file names stay
identical to GitHub so every file traces back to its master (each synced file also carries its GitHub path and SHA-256 in
its Drive description). Only the official guide is given an Arabic file name: «دليل الهوية الرسمي ـ الإصدار 1.0.1.pdf».

## Top level («سراج»)

| Folder | Holds |
|---|---|
| 01 ـ الهوية البصرية الرسمية | **The Brand Master Library** (below) |
| 02 ـ نظام التصميم | Design System v1.0 |
| 03 ـ نظام الحركة والموشن | Motion System v1.0 |
| 04 ـ الفيديو والافتتاحيات والخواتيم | Intro / outro and films |
| 05 ـ القوالب والمواد التسويقية | Templates |
| 06 ـ المشاريع العقارية | The real project (renders, key visuals) |
| 07 ـ العروض والمستندات الرسمية | Presentations and official documents |
| 08 ـ الإصدارات والتقارير | Release packages (ZIP), reports, sync notebooks |
| 09 ـ الموقع والتجربة الرقمية | Reserved — not filled at this stage |
| ملفات سراج الهندسية | Engineering files — **never touched** |

## Inside «01 ـ الهوية البصرية الرسمية»

| Family folder | Status folders |
|---|---|
| 00 ـ فهرس المكتبة | `BRAND_MASTER_ASSET_INDEX.md`, `brand-master-manifest.json`, QA report, release notes, sync notebook |
| 01 ـ الشعار | المصدر (AI master, SVG/PDF masters, supplied sources) · ملفات الإنتاج → متجه ـ SVG و PDF / صور ـ PNG · المعاينة |
| 02 ـ دليل الهوية الرسمي | «دليل الهوية الرسمي ـ الإصدار 1.0.1.pdf» · المعاينة (contact sheet) |
| 03 ـ الألوان | المصدر (palette JSON) · ملفات الإنتاج (ASE RGB/CMYK, GPL, CSV, CSS) |
| 04 ـ الخطوط | المصدر (TTF + OFL) · ملفات الإنتاج (WOFF2 + CSS) · المعاينة (specimens) |
| 05 ـ الشبكات | المصدر (SVG + JSON) · ملفات الإنتاج (PNG) |
| 06 ـ العناصر الجرافيكية | ملفات الإنتاج · المعاينة · إنتاج خاص ـ استخدام مقيّد (vector silk, decision D2) |
| 07 ـ الحرير | المصدر (4K stills, alpha cut-outs, green-screen masters) · ملفات الإنتاج (web) |
| 08 ـ الحرير والنور | المصدر (key visuals, renders) · ملفات الإنتاج (posts/stories, grade) · المعاينة (camera/composition references) |
| 09 ـ الأيقونات | المصدر (85 outline SVG) · ملفات الإنتاج (filled SVG, sprite, JSON) · المعاينة (specimens) |
| 10 ـ رموز التصميم الرقمية | المصدر (W3C tokens) · ملفات الإنتاج (platform builds) |
| 99 ـ الأرشيف ـ غير معتمد للإنتاج | Superseded guide v1.0, the earlier unapproved guide, empty folders of the previous layout |

| Arabic | Status (GitHub index) | Meaning |
|---|---|---|
| المصدر | MASTER, SOURCE | Original / editable — derive from it |
| ملفات الإنتاج | PRODUCTION EXPORT | Ready to use |
| المعاينة | PREVIEW, REFERENCE | Look only, never published |
| إنتاج خاص ـ استخدام مقيّد | SPECIAL PRODUCTION | Restricted use: vinyl, embroidery, special print, fabrication, cutting (D2) |
| الأرشيف | ARCHIVE, POSTPONED | Not approved for production |

## Sync

- Mapping: `docs/library/drive-map.json` (folder IDs per family and status, exclusions, the Arabic guide name).
- Logic: `tools/drive_sync.py` — `--plan` prints the plan anywhere; in Colab `drive_sync.run(drive)` uploads. It never
  deletes and never overwrites (a file with the same name and size is skipped; a different size is reported, not
  replaced), and verifies the size after upload. Safe to re-run.
- Notebook: `docs/library/SIRAJ_Drive-Sync_Library_v1.0.1.ipynb` (built by `tools/build-drive-sync-notebook.py`), a copy
  in «00 ـ فهرس المكتبة». Plan v1.0.1: 630 files, ≈ 372 MB, 27 folders.
- Not synced to «01»: code and Markdown (they live in GitHub), motion (its own folder «03»), archive and postponed files,
  and the architect's presentation PDF (supplier source, already on Drive in «08 ـ الحرير والنور ← المصدر»).
