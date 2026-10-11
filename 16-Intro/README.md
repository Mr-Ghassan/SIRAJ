# 16 · SIRAJ Official Brand Intro v1.0

**Duration:** 6.0 s at 30 fps. **Source:** `source/siraj-intro.html` (deterministic; open it in a browser to preview the loop).

| Time | Action |
|---|---|
| 0.0 | Near darkness. A warm light source breathes in at the upper end: the lamp (*siraj*). |
| 0.3 | A **real** maroon silk ribbon (filmed footage, `06-SIRAJ-Silk/Footage`) enters from the lower start and glides toward the upper end. |
| 1.5 – 3.2 | The ribbon sweeps across the frame. Behind its passage, the **official wordmark is revealed** by a feathered silk-edge mask. The silk never distorts the logo. |
| 1.4 – 5.0 | The logo settles imperceptibly from 1.03 to 1.00 (DRAPE). |
| 3.6 – 5.2 | The ribbon leaves through the upper end. The two **Lumen diamonds ignite** (stone to sand glow, then back to stone) with a soft halo. |
| 4.6 – 6.0 | Final frame: official logo, strong negative space, stable composition. |

## Exports (`Exports/`)

| File | Format |
|---|---|
| `SIRAJ_Intro_16x9_1920x1080_v1.0.mp4` | 16:9 H.264 (films, presentations, YouTube) |
| `SIRAJ_Intro_9x16_1080x1920_v1.0.mp4` | 9:16 (Reels, Stories, TikTok) |
| `SIRAJ_Intro_1x1_1080x1080_v1.0.mp4` | 1:1 (feed) |
| `SIRAJ_Intro_16x9_1920x1080_Transparent_v1.0_alpha.mov` / `.webm` | ProRes 4444 + VP9 **with alpha**: ribbon and logo over any footage |
| `SIRAJ_Intro_16x9_1920x1080_Bilingual-Lockup_v1.0.mp4` | Adds «سراج للتطوير العقاري · Real Estate Development» under the logo |
| `*_Sound_v1.0.mp4` | Versions with the optional SIRAJ sound bed |
| `*_poster.png` | Final-frame stills |

**Variants via query:** `?fmt=16x9|9x16|1x1`, `&alpha=1`, `&lockup=1`, `&line=1` (proposed brand line «نورٌ يُبنى · Light, built.»; use only after approval).

**Rebuild:** `node tools/build-motion.js intro`, then `tools/mux-sound.sh`.

**Usage:** place the intro before corporate films, project films, presentations, social campaigns and event content. Do not shorten it below 4 s. For a 4 s cut, trim the hold.
