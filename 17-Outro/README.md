# 17 · SIRAJ Official Brand Outro v1.0

**Duration:** 5.0 s at 30 fps. **Source:** `source/siraj-outro.html`. The outro shows the visual system coming to rest.

| Time | Action |
|---|---|
| 0.0 – 2.6 | A **real** silk ribbon (filmed footage, mirrored) passes from the end side back toward the start, the mirror of the intro. |
| 0.55 – 2.1 | Behind it, the wordmark resolves through a wipe from the end side, unblurring and settling (DRAPE). |
| 1.9 – 2.8 | A stone hairline draws from the centre (FLOW). |
| 2.15 → | Supporting details settle in, with 120 ms stagger. |
| 3.2 – 5.0 | Clean final frame and hold. |

## Modular variants (`?v=`)

| Variant | Content |
|---|---|
| `logo` | Logo only |
| `url` | Logo, rule, website |
| `contact` | Logo, Arabic name, phone · email · website |
| `cta` | "Register your interest", website, Arabic CTA with phone |
| `project` | Project name EN/AR, then SIRAJ endorsement «A SIRAJ development · من تطوير سراج» and contact |
| `social` | 9:16 with handle and "Follow · تابعونا" |

Other parameters are `&theme=dark|light`, `&fmt=16x9|9x16|1x1` and `&alpha=1`. Contact data comes from `00-Brand-Foundation/brand.config.json` (placeholders until confirmed). After editing it, run `node tools/build-motion-data.js` and re-render.

**Exports** are in `Exports/` (MP4, transparent MOV/WebM for the logo variant, `_Sound` versions, and posters). Rebuild with `node tools/build-motion.js outro`, then `tools/mux-sound.sh`.
