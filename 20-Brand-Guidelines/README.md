# 20 · Brand Guidelines — SIRAJ Brand Guidelines v1.0.1

**Production guide:** `SIRAJ_Brand-Guidelines_v1.0.1.pdf` · 82 pages · 1440 × 810 pt (16:9) · English with Arabic samples.
**Status:** PRODUCTION (v1.0.1, 2026-10-15). Objective production fixes only; the identity, layout and rules are those of v1.0.
**Superseded:** `SIRAJ_Brand-Guidelines_v1.0.pdf` → `99-Archive/Superseded/Brand-Guidelines-v1.0/` (still attached to the
GitHub Release `siraj-brand-system-v1.0.0`; do not use it for production, two of its images do not render).

## What changed in v1.0.1 (and why)

| Page | v1.0 | v1.0.1 | Type |
|---|---|---|---|
| 6 · Brand idea | the Silk Blade image did not render (broken PDF object) | restored | production error |
| 19 · Monogram, favicon and avatars | the circular social avatar did not render (broken PDF object) | restored | production error |
| 9 · Marketing framework | the five value pillars were not marked as internal | «Internal · not for public communication» marker | governance (AGENTS.md rule 5) |
| 10 · Campaign lifecycle | internal campaign planning not marked | same marker | governance |
| 54 · Design tokens | named `design-system/tokens/siraj-ds.tokens.json` while listing the `09-Design-System` outputs | `09-Design-System/tokens/siraj.tokens.json` (the file those outputs are built from) | factual error |
| 79 · Asset library | «82 icons» | «85 icons» (Instagram, WhatsApp and Email were added after the count was written) | factual error |
| every footer | Brand Guidelines v1.0 | Brand Guidelines v1.0.1 | version |

Root cause of the missing images: `tools/compress-pdf.py` re-encoded soft-masked images and dropped "orphan" objects after
merging duplicates, which broke a shared colour-profile reference. The HTML page previews (`pages/`) are rendered from
HTML, not from the PDF, so they never showed the problem. Both causes are fixed, and the build now refuses to finish
unless every page of the PDF renders without a single error and no page loses an image (`verifyPdf`).

## Reproducible source

| Item | Path |
|---|---|
| Page definitions (content, order, assets) | `tools/build-guidelines.js` |
| Generated HTML source (byte-identical on every run) | `20-Brand-Guidelines/source/siraj-brand-guidelines.html` |
| Stylesheet (hand-kept source) | `20-Brand-Guidelines/source/guidelines.css` + `09-Design-System/css/siraj.css` |
| Data read at build time | `00-Brand-Foundation/brand.config.json`, `02-Colours/SIRAJ_Colour-Palette_v1.0.json`, `09-Design-System/tokens/build/*`, `07-Icon-System/siraj-icons.json`, `motion-system/tokens/*.json` |
| Images read at build time | `01-Logos/`, `05-Graphic-System/`, `06-SIRAJ-Silk/Stills/`, `14-Property-Marketing/12-Project-Siraj/`, `16-Intro/`, `17-Outro/`, `99-Archive/Pre-Luxe-Grade-v1.0/` (before/after page) |
| Film strips (generated) | `20-Brand-Guidelines/assets/intro-strip.png` and `intro-strip-v.png` (frames from the intro exports, via ffmpeg) |
| Final PDF | `20-Brand-Guidelines/SIRAJ_Brand-Guidelines_v1.0.1.pdf` |
| Page previews + contact sheet | `20-Brand-Guidelines/pages/` (82 JPG, one per page), `SIRAJ_Brand-Guidelines_Contact-Sheet_v1.0.1.jpg` |

## Build and export

```bash
npm run build:guidelines                      # HTML → PDF → compress → integrity check → page previews (≈ 4 min)
node tools/build-guidelines.js --html-only    # HTML source only (fast check)
SIRAJ_GUIDE_VERSION=1.0 npm run build:guidelines   # reproduce the v1.0 layout (writes SIRAJ_Brand-Guidelines_v1.0.pdf)
```

Steps inside the build: page HTML is generated → Chromium (Playwright) prints the PDF at 1920 × 1080 px per page →
`tools/compress-pdf.py` downscales opaque photographs to 1800 px / JPEG q80 (masked images are kept as they are) →
`verifyPdf` renders all pages with poppler and compares image counts before and after compression → each page is
screenshotted to `pages/` and the contact sheet is assembled with ImageMagick `montage`.

## Dependencies

| Dependency | Version used for v1.0.1 | Used for |
|---|---|---|
| Node.js | 22 | build script |
| Playwright + Chromium | 1.56 (`/opt/node22/lib/node_modules/playwright`, or set `PLAYWRIGHT_PATH`) | PDF print and page screenshots |
| Python 3 + pypdf + Pillow | pypdf 5.9, Pillow 12 | image compression |
| poppler-utils | 24.02 (`pdfinfo`, `pdftoppm`, `pdfimages`) | integrity check |
| ImageMagick | `convert`, `montage` | page previews, contact sheet |
| ffmpeg | 6.1 | intro film strips |
| Fonts | `03-Typography/fonts` (Jost, Tajawal), loaded by `09-Design-System/css/siraj.css` | all text |

Reproducibility was verified on 2026-10-15: rebuilding v1.0 from source gave a byte-identical HTML source, identical page
previews and an identical PDF text layer; page renders matched within JPEG re-compression noise.

## Known minor items (not production errors, left as approved)

- Three symbols the brand fonts do not contain (✕ «don't» marks, ◆ Lumen bullets, → arrows) are drawn by the system fallback
  font (DejaVu / Inter / Liberation). They render correctly; a future version can replace them with the icon set.
- Page 54 shows a CSS sample on purpose (the developer-facing Design tokens page).
