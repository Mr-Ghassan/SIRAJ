# SIRAJ Brand Library v1.0.1 — Release Notes

| | |
|---|---|
| **Release** | SIRAJ Brand Library v1.0.1 (SIRAJ Brand Master Library) |
| **Type** | Library completion — organisation, manifests, missing exports, documentation, reproducibility, objective file fixes |
| **Design change** | No redesign. Owner decisions D1–D6 (2026-10-15) applied as production corrections; Brand Identity, Design System and Motion System v1.0 otherwise frozen. |
| **Base** | SIRAJ Brand System v1.0 · tag `siraj-brand-system-v1.0.0` (unchanged) |
| **Branch** | `feat/siraj-brand-library-completion-v1` |
| **Tag** | `siraj-brand-library-v1.0.1` (annotated; library completion and production corrections only) |
| **QA** | Library QA 15/15 (0 failures) · Brand QA 0 · Silk QA 22/22 · guide 82 pages render cleanly · 925 files indexed (917 approved + the 8-file presentation folder classified PREVIEW) |

## Contents

- **Index and manifest:** `BRAND_MASTER_ASSET_INDEX.md`, `brand-master-manifest.json`.
- **Production guide:** `20-Brand-Guidelines/SIRAJ_Brand-Guidelines_v1.0.1.pdf` (82 pages; replaces v1.0, which lost two images).
- **New exports:** monogram matrix + PDFs, colour CSS, WOFF2 web fonts.
- **Reproducible builds:** guide, logos, colours, icons, grids, graphics, tokens, type — each verified against the committed files.
- **Docs:** `docs/library/` (overview, audit, naming, QA report, Drive structure).

## Upgrade notes

- Use `SIRAJ_Brand-Guidelines_v1.0.1.pdf`. Do not distribute the v1.0 PDF (pages 6 and 19 render without their images).
- New and corrected files are listed in `CHANGELOG.md` (Library v1.0.1).
- Owner decisions D1–D6 (2026-10-15) are applied and recorded at the end of `BRAND_MASTER_ASSET_INDEX.md`:
  - **D1** Arabic-name lockups withdrawn → `99-Archive/Withdrawn/Arabic-Name-Lockups/`; the letterhead and business card use the official wordmark. Replace any local copy of `SIRAJ_Lockup_Horizontal_*`, `_Stacked_*` or `_Arabic_*`.
  - **D2** vector silk = SPECIAL PRODUCTION / RESTRICTED USE. The presentation folder, which prints vector silk across its exterior, is classified PREVIEW · NOT FOR PRODUCTION until the Applied Design & Collateral phase.
  - **D3** dark `border-strong` = #8C6B64 in every token set (`09-Design-System/tokens/build/*` regenerated).
  - **D4** project name stays postponed.
  - **D5** unresolved data («—») only in editable templates; exports hide the field (`?export` in the document runtime).
  - **D6** Ribbon key visual re-graded (`tools/siraj-warmth-match.py`); posts, stories, slide 8 and Carousel-04 rebuilt.
