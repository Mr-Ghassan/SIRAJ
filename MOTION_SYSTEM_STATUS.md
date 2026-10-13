# SIRAJ Motion System v1.0 — CLOSED / PRODUCTION READY

**Status:** closed on 13 October 2026 · tokens `motion-system/` · library `15-Motion-System/` · films `16-Intro/`, `17-Outro/`
Build: `npm run build:motion` (tokens → renders → sound versions).

## Foundations

- **Principles:** AIR (the driving force) · FLOW · DRAPE · REVEAL · WRAP · FOLD · GLIDE · SETTLE. No bounce, elastic, glitch, flashy zoom, random 3D or gold clichés.
- **Six levels** (`motion-system/tokens/siraj-motion-levels.json`): Micro 120 ms · Fast 200 ms · Standard 360 ms · Emphasis 640 ms · Hero 1200 ms · Cinematic 2400 ms, each with ease, stagger, scale, translate, blur and camera; reduced motion = opacity only, 120 ms. Built to JSON, CSS (`.m-<level>`), JS and TypeScript.
- **Air / wind** (`motion-system/tokens/siraj-wind.json`): still · whisper · breeze · gust; one direction (right → left); travelling wave with lag; gust envelope rise 0.6–0.9 s / fall 1.2–1.8 s; foliage sway; ready EN/AR video-prompt lines.
- **Silk finish:** pressed silk only; close-ups from 4K masters (`06-SIRAJ-Silk/Footage/Source/*_4K_*`).
- **Light:** ivory-rose, never yellow; final frames quiet and luxurious.

## Silk Motion Engine (`15-Motion-System/lib/siraj-silk-engine.js`)

Deterministic primitives (pure in t): `air`, `breathe`, `drift`, `sway`, `axisMask`, `maskReveal`, `silkEdge`, `lightSweep`, `sweep` (real footage locked to its measured track) with **exit glide** (the air carries the ribbon out), `wrap`, `fold`, `axisBand`, `settle`.

## Deliverables

| Item | Versions | Files |
|---|---|---|
| Intro · company (SIRAJ wordmark) | 16:9, 9:16, 16:9 alpha · + sound | `16-Intro/Exports/SIRAJ_Intro_*` |
| Outro · official (logo + 7771 4404 + Instagram icon) | 16:9, 9:16 · + sound | `17-Outro/Exports/SIRAJ_Outro_Official_*` |
| Outro · logo only (editing utility) | 16:9 alpha | `17-Outro/Exports/SIRAJ_Outro_Logo_*` |
| 5 signature transitions: Silk Sweep, Silk Fold, Ribbon Pass, Architectural Reveal, Light Reveal | 16:9, 9:16 | `15-Motion-System/Exports/Transitions/` |
| 16 components: logo reveal, logo close, title, subtitle, lower third, stat, counter, property reveal, image reveal, map, location marker, floor plan, chart, CTA, transition, end card | 16:9, 9:16 (Arabic) | `15-Motion-System/Exports/Components/` |
| Sound beds and SFX | intro 6 s, outro 5 s, 3 SFX | `15-Motion-System/Sound/` |

Project versions of the intro and outro are postponed with the project-name lettering (archived in `99-Archive/Postponed/Project-Lettering/Intro-Outro-Project`).

## Tests

- Visual QA of all 16 components in both formats and the five transitions (contact sheets reviewed); 9:16 layouts for property reveal and floor plan were rebuilt.
- Silk audit: creased stills replaced; soft 1080p footage replaced by 4K masters (archived: `99-Archive/Silk-Footage-Soft-v1.0`).
