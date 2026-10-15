# SIRAJ Brand Master Library v1.0.1

The complete, production-ready source library of the SIRAJ identity. Any designer, agency, developer or motion team
works from it without searching for missing assets or recreating anything.

**Built on:** SIRAJ Brand System v1.0 (tag `siraj-brand-system-v1.0.0`). Brand Identity, Design System and Motion System
v1.0 are frozen; v1.0.1 changes organisation, manifests, missing exports, documentation, reproducibility and objective
file corrections only. No visual or design change.

## Start here

| Need | Open |
|---|---|
| Which file is the official one, and where is it | `BRAND_MASTER_ASSET_INDEX.md` (repository root) |
| Machine-readable list (paths, status, size, pixels, SHA-256) | `brand-master-manifest.json` (repository root) |
| Rules everyone follows | `AGENTS.md`, the brand guide `20-Brand-Guidelines/SIRAJ_Brand-Guidelines_v1.0.1.pdf` |
| What the audit found and what changed | `docs/library/LIBRARY_AUDIT_v1.0.1.md`, `RELEASE_NOTES_LIBRARY_v1.0.1.md` |
| Latest QA result | `docs/library/QA_REPORT_v1.0.1.md` |
| File naming | `docs/library/NAMING.md` |
| Google Drive layout (Arabic) | `docs/library/DRIVE_STRUCTURE.md` |

## Statuses

| Status | Arabic (Drive) | Meaning |
|---|---|---|
| MASTER | المصدر | The canonical original. Derive from it; never edit an export instead. |
| SOURCE | المصدر | Editable or generating source (AI file, build script, HTML composition, green-screen master). |
| PRODUCTION EXPORT | ملفات الإنتاج | Ready to use. |
| PREVIEW / REFERENCE | المعاينة | Look only; never a deliverable, never published. |
| SPECIAL PRODUCTION | إنتاج خاص ـ استخدام مقيّد | Restricted use: only where a production process technically needs it (vector silk, decision D2). |
| ARCHIVE / POSTPONED | الأرشيف | Not approved for production. |

## Commands

```bash
npm ci                          # root build dependencies (HarfBuzz, opentype.js, svgo, fonts)
npm run qa:library              # full library QA (≈ 40 s) → docs/library/QA_REPORT_v1.0.1.md
npm run build:master-library    # regenerate BRAND_MASTER_ASSET_INDEX.md + brand-master-manifest.json
npm run audit:library           # open every file in the repository by its real format (≈ 3 min)
npm run build:guidelines        # rebuild the brand guide (≈ 4 min, with PDF integrity check)
npm run build:logos             # logos from the master geometry · npm run build:logo-matrix for missing raster sizes
npm run build:icons             # 85 icons, sprite, JSON, README index
npm run build:colours           # palette JSON, ASE, GPL, CSV, CSS
npm run build:webfonts          # WOFF2 from the TTF masters
npm run qa:silk                 # silk stills: no wash, no yellow, maroon chroma
```

Python tools need Pillow, NumPy, fontTools, brotli and pypdf; render tools need Playwright + Chromium, poppler-utils,
ImageMagick and ffmpeg (versions in `20-Brand-Guidelines/README.md`).
