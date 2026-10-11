# 15 · SIRAJ Motion System v1.0

> Motion is the **kinetic translation of the identity**: the controlled movement of silk. It is elegant, cinematic, architectural and controlled. It never bounces, never uses elastic movement, and never uses flashy transitions.

## Principles

| Principle | Meaning | Implementation |
|---|---|---|
| **FLOW** | Movement enters with continuous momentum | `easing.flow` cubic-bezier(.45,.05,.15,1) |
| **DRAPE** | Elements settle like falling fabric, never stopping mechanically | `easing.drape` cubic-bezier(.16,1,.3,1) · spring `drape` ζ≈1.0 |
| **REVEAL** | Content is uncovered as silk reveals architecture | Mask wipes along a curved silk edge · `easing.reveal` (.77,0,.18,1) |
| **WRAP** | A line or ribbon travels around an object, image or title | Real silk footage (`lib/siraj-footage.js`), time-mapped |
| **FOLD** | Transitions behave like controlled material folds | `easing.fold` (.7,0,.2,1) · *Silk Fold* transition |
| **GLIDE** | Camera and UI moves are smooth and confident | `easing.glide` (.65,0,.35,1) · parallax 12% |
| **SETTLE** | Every animation ends calmly and precisely | Final 30–40% of every move decelerates. Image scale goes 1.04 → 1.00, never above 1.08. |

## Tokens (`09-Design-System/tokens/siraj.tokens.json` → `motion.*`)

| Token | Duration | Typical use |
|---|---|---|
| micro | 120 ms | hover, press, focus |
| fast | 200 ms | toggles, tooltips |
| standard | 360 ms | menus, panels, cards |
| emphasis | 640 ms | titles, image reveals |
| cinematic | 1200 ms | silk sweeps, full-screen transitions |
| hero | 2400 ms | logo reveal, ribbon travel |

| Easing | Curve | Use |
|---|---|---|
| flow | (.45, .05, .15, 1) | default |
| drape | (.16, 1, .3, 1) | entrances and settling |
| glide | (.65, 0, .35, 1) | position and camera |
| fold | (.7, 0, .2, 1) | transitions |
| reveal | (.77, 0, .18, 1) | masks |
| release | (.5, 0, .75, .25) | exits |
| micro | (.2, 0, 0, 1) | UI feedback |

**Springs:** `drape` {k 90, c 19, m 1}, `settle` {140, 28, 1} (overdamped, for UI), and `silk` {38, 11, 1}, which allows one barely visible sway and is used **only for silk geometry, never for UI or the logo**.

**Stagger:** tight 40 ms, standard 80 ms, relaxed 140 ms. **Distance:** nudge 8 px, shift 24 px, travel 64 px.

**Reduced motion:** every duration collapses to 1 ms (CSS), and the web helper adds the end state directly.

## Silk in motion: real footage

**All delivered motion uses real silk** (rule since 2026-10-11). The ribbon in the intro, outro and transitions is filmed silk footage, keyed to alpha (`06-SIRAJ-Silk/Footage`). `lib/siraj-footage.js` seeks it frame-accurately inside `window.seek(t)`, so renders stay deterministic. Static silk in transitions (Sweep band, Fold flap, Curtain edge) is photographed silk from `06-SIRAJ-Silk/Stills`.

### Previs only: the procedural engine

The SIRAJ Silk Engine remains as the **previs tool** used to block timing and composition before footage is briefed. It is never a deliverable. Its approach is an **art-directed procedural simulation**:

- **Gravity and tension** come from the drape height field (long tension waves, creased valleys, folds converging to a held point).
- **Directional movement and air** come from the ribbon's travelling wave, the twist profile, and the time-varying sway of the spline control points.
- **Light** comes from an anisotropic sheen that travels as the light direction is animated (`light` vector over time).

Everything is a pure function of time, so a scene renders identically on the web, in stills and in video. For CGI productions, Blender and Cinema 4D should match this look (see `18-3D/README.md`).

## Library and renderer

| File | Purpose |
|---|---|
| `lib/siraj-motion.js` | Bezier solver, easings, springs, `seg`, `enter`, `exit` and `count` helpers: deterministic primitives |
| `lib/siraj-logo-data.js` | Official logo paths for compositions |
| `lib/siraj-brand-data.js` | Generated from `brand.config.json` (`node tools/build-motion-data.js`) |
| `web/siraj-motion.css` + `web/siraj-motion-web.js` | Website layer: `data-sj="enter|image|rule|parallax"`, `.sj-line`, `.sj-thread`, `.sj-loader` |
| `components/siraj-motion-components.html` | Motion component library (`?c=<component>&lang=en|ar`) |
| `transitions/siraj-transitions.html` | Signature transitions (`?type=sweep|fold|ribbon|arch|curtain`) |
| `../tools/render-motion.js` | Deterministic frame renderer (Chromium, then ffmpeg): MP4 H.264, WebM VP9 alpha, ProRes 4444 alpha |
| `../tools/build-motion.js` | Render all deliverables: `node tools/build-motion.js intro|outro|transitions|components` |

## Motion components (`Exports/Components/`)

The library contains Title, Subtitle, Lower third, Name plate, Statistics, Numbers (counter), Project card, Property details, Map and location marker (Lumen pin with spring drop and a single halo), Floor plan (walls draw on, rooms appear, area counts), Progress (construction), Chart, Quote, Image reveal, and CTA. Key components also have Arabic RTL versions.

The logo reveal and logo close are in `16-Intro` and `17-Outro`. The end card is the outro family. Full-screen transitions are listed below.

## Signature transitions (`Exports/Transitions/`)

| Transition | Duration | Behaviour |
|---|---|---|
| **Silk Sweep** | 1.2 s | A broad silk plane crosses the frame; the next scene lies behind its trailing edge. |
| **Silk Fold** | 1.0 s | The scene folds away along a travelling diagonal crease, and the flap shows silk sheen. |
| **Ribbon Pass** | 0.8 s | A slim ribbon passes through; the cut happens at its midpoint with a 1.04 → 1.0 settle. |
| **Architectural Reveal** | 1.2 s | Twelve grid columns open from the centre while a silk thread flows through. |
| **Curtain Reveal** | 1.2 s | The scene lifts with a soft draped lower edge. It is minimal and never theatrical. |

## Lottie

Lottie is **not** used for silk, because silk is shader-based and Lottie would flatten it. Lottie is appropriate only for small UI loops such as the Lumen loader. The CSS loader in `web/` covers that today.

## Sound (`Sound/`): optional, never part of the identity

| File | Character |
|---|---|
| `SIRAJ_SFX_Silk-Glide_v1.0.wav` | Refined fabric glide (ribbon entry) |
| `SIRAJ_SFX_Stone-Resonance_v1.0.wav` | Soft felt-mallet resonance in a stone space (logo settle) |
| `SIRAJ_SFX_Lumen-Shimmer_v1.0.wav` | Two delicate glass-like glints (Lumen ignition) |
| `SIRAJ_Intro_Sound-Bed_6s_v1.0.wav` / `SIRAJ_Outro_Sound-Bed_5s_v1.0.wav` | Mixed beds at −23 / −24 LUFS, true peak −3 dB |

**Rules:**

- Sound is optional.
- Every visual must work muted.
- No loud whooshes, trailer hits, sub-bass drops, gaming sounds or music logos.
- Mix the beds at least 6 dB under dialogue or music.

The SFX were generated with ElevenLabs Sound Effects for this system. Confirm the licence terms for broadcast use before distribution.
