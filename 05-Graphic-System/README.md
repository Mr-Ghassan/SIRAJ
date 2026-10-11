# 05 · Graphic System v1.0 — Signature Elements

Every element is derived from the wordmark or from the behaviour of silk. Use **one signature element per layout**.

The specimen is at `Previews/SIRAJ_Graphic-System_Specimen_v1.0.png`. Vectors are in `SVG/`, PNGs in `PNG/`, responsive masks in `Masks/`, and CSS helpers in `siraj-graphics.css`. Rebuild with `node tools/build-graphics.js`.

| Element | Origin | Rule | Files |
|---|---|---|---|
| **Silk Blade** | The R-leg crescent of the official wordmark | Accents, section openers, dividers. Use it at no more than 1.5× the cap height of the adjacent headline. It never rotates more than ±15°. | `SIRAJ_Silk-Blade_{Maroon,Stone,Sand}` |
| **Silk Line** | Silk thread: a tapered S-curve | Connects content across a spread. Use one per layout, at least 3 mm thick in print, and never under body text. | `SIRAJ_Silk-Line_*`, `Silk-Line-Pair` |
| **Lumen ◆** | The I/J diamonds | Bullets, active state, map pin head, step markers and the loader. It is always 45°, always Stone (or Maroon when active), and never larger than 16 px in UI. | `SIRAJ_Lumen*` · `.lumen` CSS |
| **Silk Ribbon (vector)** | The engine ribbon, projected to vectors | Print and large format where raster is unsuitable. | `SIRAJ_Silk-Ribbon_Vector-{Continuous,Tonal}` |
| **Silk Wrap (vector)** | Spiral ribbon | Composited around towers. | `SIRAJ_Silk-Wrap_Vector-Continuous` |
| **SIRAJ Window (Silk Corner)** | A rectangle with one draped corner | The hero image container. The curve sits on the **top-end** corner only (handles 0.25 / 0.45 of r). Use at most two per view. | `SIRAJ_Silk-Corner-Window`, `.sj-mask-silk-corner`, `border-start-end-radius` |
| **SIRAJ Portal** | An asymmetric silk arch | Vertical image openings for project reveals and entrances. | `SIRAJ_Portal`, `.sj-mask-portal` |
| **Architectural Cut** | The stencil cuts of S-I-R-A-J | Splits a plane or image with a thin cut at the Lumen angle; the Lumen marks its head. | `SIRAJ_Architectural-Cut` |
| **Silk Fold** | Silk translated into a planar fold | Covers and section dividers: a corner folds along a draped crease. | `SIRAJ_Silk-Fold_Corner` |
| **Silk Drape / Horizon** | Raster silk from the engine | Full-bleed backgrounds and ground lines. | `06-SIRAJ-Silk/Stills/` |

## Do not

- Do not combine more than one silk element with a Silk Corner in the same view.
- Do not use decorative arabesques, generic waves, swooshes or gold lines.
- Do not use silk elements as frames around the logo, or let them touch it.
- Do not animate elements independently of the motion system.
