# 04 · Grid System v1.0

> **The grid provides order. The silk provides movement.** This contrast is part of the SIRAJ language.

The full table is in `GRID-TABLE.md` and the machine-readable version in `grids.json`. Overlays are in `SVG/` and `PNG/`. Rebuild with `node tools/build-grids.js`.

| Format | Columns | Margin | Gutter | Notes |
|---|---|---|---|---|
| Desktop 1440 | 12 | 80 | 24 | max content 1280 |
| Desktop 1920 | 12 | 240 | 32 | max content 1440 |
| Tablet 900 | 8 | 48 | 24 | |
| Mobile 390 | 4 | 20 | 16 | single text column |
| Presentation 1920×1080 | 12 | 120 | 32 | top/bottom 96, footer band 48 |
| Social Post 1080×1350 | 6 | 72 | 24 | logo zone bottom-start |
| Social Story 1080×1920 | 6 | 72 | 24 | safe area: top 250, bottom 340 |
| Editorial A4 | 12 | 15 mm (inner 20) | 4 mm | baseline 3 mm |
| Brochure A4 landscape | 12 | 15 mm | 4 mm | spreads 594 × 210 mm |
| Billboard 48-sheet | 12 | 300 mm | 120 mm | logo ≥ 10% of width, ≤ 7 words |
| Hoarding panel 6 × 2.4 m | 12 | 240 mm | 100 mm | silk continuous across panels |

The base unit is **8 px** on screen and **3 mm** in print. All spacing is a multiple of 4 or 8 (see the `space` tokens).

## Silk × Grid

- **Silk Axis:** silk travels along the **51°** axis (the official gradient angle). It enters from the lower-start corner of the live area and exits toward the upper end.
- **Silk Field:** the lower-end third of a layout (the shaded curve on the overlays) is where silk gestures live. Text and key architecture stay in the remaining two-thirds.
- **Silk never aligns to columns.** It is the one element allowed to cross the grid, which is exactly why it reads as a gesture.
- **Type always aligns to columns and baseline.** Images align to columns and may bleed off one or more edges.
- **Logo zone:** bottom-start (bottom-left in LTR, bottom-right in RTL), or top-start on covers. Respect clear space of ½ H.
- **RTL:** mirror the grid, the Silk Field and the logo zone. Never mirror the logo itself.
