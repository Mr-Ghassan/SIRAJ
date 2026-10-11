# SIRAJ Silk · Footage (real silk)

This folder holds the moving silk used in motion. It is **real silk footage**, not a render. A wine-maroon silk satin ribbon was filmed passing through the frame on a chroma-key green screen, then keyed to an alpha channel.

| File | Use |
|---|---|
| `SIRAJ_Silk_Ribbon-Pass_16x9_v1.0_alpha.webm` | 1920×1080, 24 fps, VP9 + alpha. Used by the intro, outro and transitions. 1:1 compositions crop it. |
| `SIRAJ_Silk_Ribbon-Pass_9x16_v1.0_alpha.webm` | 1080×1920, 24 fps, VP9 + alpha. Used by vertical compositions. |
| `Source/*_Green_v1.0.mp4` | The green-screen masters, kept for re-keying. |

- **Pass window:** the ribbon enters the lower start at 0.0 s and has fully left through the upper end at 7.5 s (16:9) or 6.25 s (9:16). This is recorded in `SirajFootage.PASS`.
- **Playback in compositions:** `15-Motion-System/lib/siraj-footage.js` seeks the clip frame-accurately inside `window.seek(t)`, so renders stay deterministic.
- **Keying:** `bash tools/silk-footage-key.sh <green.mp4> <out_alpha.webm> [0xRRGGBB]` runs chromakey and despill, then turns the hue −9° so the satin stays on SIRAJ wine-maroon.
- **Origin:** generated as studio footage of real silk (ElevenLabs · Seedance 2.5, 1080p, 8 s, brief: real silk satin, locked-off camera, chroma green). Replace it with commissioned high-speed footage when available. Keep the same file names and update `PASS`.
