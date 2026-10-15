# SIRAJ Brand Library — audit v1.0.1 (2026-10-15)

Branch `feat/siraj-brand-library-completion-v1`, from `main` = tag `siraj-brand-system-v1.0.0` (`323431d`).
Method: every file was opened by its real format (`tools/audit-library.py`: SVG parse, image decode, PDF page render,
font load, A/V probe, ZIP CRC, JSON/ASE parse); every foundation build was re-run and its output compared with the
committed files; documentation paths were checked against the disk. Nothing was assumed from documentation.

## Inventory

2,267 files audited (archive included), 1,989 opened by format (the rest are code/config and were checked for presence
and non-zero size). Open failures: **0** (one empty `99-Archive/.gitkeep`, intentional). Production files indexed in the
manifest: **947**.

## Family status

| Family | Already complete in v1.0 | Missing / defective | Done in v1.0.1 |
|---|---|---|---|
| **Logos** | AI master (5 artboards), SVG + PDF masters, reversed master, 9 colour variants × (SVG, clear-space SVG, vector PDF, PNG 512/1024/2048/4096, clear-space PNG), mono Black/White/Maroon/Deep/Sand, 4 monograms, favicons, avatars, logo on 9 backgrounds, 4 lockups, construction | Monogram had only 1024 px and no PDF | Monogram PNG 512/2048/4096 + vector PDF (16 files, pixel-identical pipeline). All logo SVGs/PNGs rebuild byte-identical; PDFs content-identical. Colours verified per variant; no live text, no embedded rasters; all PDFs pure vector. |
| **Colours** | 15 colours: HEX, RGB, CMYK (FOGRA39), Pantone, contrast; ASE RGB + CMYK, GPL, CSV, JSON | No CSS file; the build would have erased the approval status | `SIRAJ_Colours_v1.0.css` (one canonical name per colour + G1–G5); build now reproduces the approved JSON/ASE/GPL/CSV byte-for-byte. |
| **Typography** | Jost 8 + Tajawal 7 TTF, OFL licences, @font-face CSS, specimen | No web fonts; Tajawal OFL credited «Google Inc.»; README Arabic line heights stale (display 1.25, H2 1.38) | 15 lossless WOFF2 + CSS; official Tajawal OFL (Boutros International) in all 3 copies; README aligned with the frozen Design System values (display 1.36, H1 1.42, H2 1.45, body 1.80) and given files, weights and RTL guidance. |
| **Grids** | 12 formats, SVG + PNG + JSON | — | Verified; rebuild pixel-identical. |
| **Graphic system** | Silk Blade, Silk Line, Lumen, Window, Portal, Architectural Cut, Silk Fold, masks, CSS, specimen | README called silk drapes «raster silk from the engine»; vector silk conflicts with the real-silk rule | README corrected; vector silk marked REVIEW (decision D2). Rebuild byte-identical. |
| **Silk** | 11 formations × 16:9, 9:16 (4K), 1:1, 4:5 JPG + web WebP; 13 alpha cut-outs (4K); 2 alpha footage clips; 2 × 4K green-screen masters; engine | — | Verified 4K, Silk QA 22/22 (no wash, no yellow, maroon chroma), visual pressed-silk check of all 11 formations. Indexed per formation. |
| **Silk & Light** | 5 key visuals (4:5 + 9:16), 6 clean renders (3712 × 4608), posts/stories, architect source, grade LUT + Luxe Grade | Not organised as one family; grade/camera references scattered | Organised in the index: approved KVs, renders, compositions, grade, before/after reference, camera/composition references (AI concept, reference only). Ribbon KV measured warmer (decision D6). |
| **Icons** | 85 icons × 2 styles on the 24 grid, 1.25 stroke, sprite, JSON catalogue with AR/EN labels, specimens | Source of truth defined only 82: a rebuild deleted **shop, instagram, brochure**; README said 82 | The 3 drawings restored element by element into `tools/build-icons.js`; all icon files rebuild byte-identical; README count corrected. Geometry consistent (grid, stroke, caps/joins) across all 170 SVGs. |
| **Design tokens** | Design System v1.0 tokens (W3C) + builds; brand tokens + platform exports | One value differs between the two sets (dark border-strong) | Documented (decision D3); not changed (frozen). |
| **Motion** | Tokens (six levels, wind), runtime lib, plates, transitions (source + 10 exports), components (source + 32 exports), intro + outro (source, MP4, sound, ProRes/WebM alpha, posters), 5 sound files | Not separated in one place | Separated in the index: tokens · runtime · silk engine · footage · transitions · components · intro · outro · audio · sources · exports. All media open (ffprobe). No re-animation. |
| **Guidelines** | 82-page PDF, HTML source, build script, page previews | **Pages 6 and 19 missing an image** (broken objects from compression); internal pages not marked; 2 errata | v1.0.1 PDF (82 pages): images restored, «Internal» marker on pages 9–10, token path and icon count corrected; compressor fixed; build verifies every page. Reproducibility proven (byte-identical HTML, identical text layer). v1.0 archived. |
| **Archive** | Folders for demo, English-dormant, postponed lettering, retired silk | No index of what each folder is; no markers | `99-Archive/README.md` table + `_NOT-FOR-PRODUCTION.md` in every archive folder. |
| **Documentation** | Family READMEs | Stale paths to tools archived with the demo kit; stale contact syntax («@SIRAJPROPERTIES», lowercase website) in strategy docs and project READMEs | Annotated/corrected (no rule changed). |

## Corrected (objective production fixes)

1. Guide v1.0 → v1.0.1: two missing images, internal marker, two errata (see `20-Brand-Guidelines/README.md`).
2. `tools/compress-pdf.py`: no longer re-encodes masked images or drops shared objects.
3. `tools/build-icons.js`: three approved icons restored to the source.
4. `tools/build-colours.py`: approval status preserved on rebuild.
5. Tajawal licence text: official OFL with the correct copyright (3 copies).
6. Typography README: Arabic line heights match the approved tokens.
7. Contact syntax in 6 documents: Instagram icon + SIRAJPROPERTIES (never «@»), `WWW.SIRAJPROPERTIES.NET`, `7771 4404`.
8. Stale tool paths in 6 documents annotated with their archive location.

## Archived in v1.0.1

- `20-Brand-Guidelines/SIRAJ_Brand-Guidelines_v1.0.pdf` and its contact sheet → `99-Archive/Superseded/Brand-Guidelines-v1.0/`.

## Known, accepted, documented

- Symbol glyphs ✕ ◆ → in the guide render through system fallback fonts (not in Jost/Tajawal); visually correct.
- The guide's page 54 shows a CSS sample on purpose (developer page).
- Icon specimen previews render label weights depending on the installed font environment; the icons are identical.
- 20 line-only icons are the same drawing in outline and filled (documented as «same» in the catalogue).
- `01-Logos/Monochrome/` and `01-Logos/Master/` hold intentional byte-identical copies; QA fails if they ever drift.

## Decisions for the owner (D1–D6)

Listed with context at the end of `BRAND_MASTER_ASSET_INDEX.md`.
