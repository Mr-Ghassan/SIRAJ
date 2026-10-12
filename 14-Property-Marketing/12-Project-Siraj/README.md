# Project Siraj · The Founding Project

The official name of the Founding Project is **سراج · Siraj** (`brand.config.json → founding_project`).

> **Arabic only** (language policy, 2026-10-11). Builds render Arabic. The English editions are dormant in `99-Archive/English-Dormant/`; build them only with `SIRAJ_EN=1`.

## Official façade posts

Instagram post (4:5) and story (9:16), in Arabic and English. Each shows the official façade zoomed out on Warm Ivory, with one SIRAJ Silk ribbon passing behind the building.

- `Source/SIRAJ_Project-Siraj_Facade_Clean_v1.0.jpg`: the official render, cleaned.
  - The architect's placeholder "SIGNAGE" lettering is removed.
  - People are removed (street figures and reflections), following the SIRAJ people rule.
- `Source/SIRAJ_Project-Siraj_Facade_Cutout_v1.0.png`: the building cut out (RGBA), with the base at the kerb line.
- `Source/project-siraj-facade-post.html`: the layout (`?fmt=post|story&lang=ar|en`). The silk is rendered live by the SIRAJ Silk Engine.

Rebuild:

```
python3 tools/project-siraj-facade-prep.py <official-render.jpg> 14-Property-Marketing/12-Project-Siraj/Source
node tools/build-project-siraj-facade.js
```

## Hero · Siraj in the heart of Muscat

`SIRAJ_Project-Siraj_Hero_{Post,Story}_{AR,EN}_v1.0.png`: a low three-quarter hero shot of the building on a Muscat city-centre street at golden hour. A SIRAJ Silk Horizon forms the ground under the building and carries the type.

- `Source/SIRAJ_Project-Siraj_Hero_City_4x5_v1.0.jpg` and `Source/SIRAJ_Project-Siraj_Hero_City_9x16_v1.0.jpg` are AI-assisted visualisations (ElevenLabs · Nano Banana Pro) generated from the cleaned official façade. They carry the SIRAJ Silk Grade at 35 %, which keeps the official rose-copper true. There are no people in the images.
- The side elevation is interpreted by the visualisation. Replace it with the architect's CGI when it is available.
- Layout: `Source/project-siraj-hero-post.html` (`?fmt=post|story&lang=ar|en`). Build with `node tools/build-project-siraj-hero.js`.

## Message

| | Arabic | English |
|---|---|---|
| Façade post | سراج · أوّلُ الضوء. · مبنى واحد، بمعيارٍ كامل. | Siraj · The first light. · One building. A complete standard. |
| Hero post | في قلب المدينة، يبدأ المعيار. | In the heart of the city, the standard begins. |

Both lines build on the brand core «سراج لا تبدأ بالانتشار، بل تبدأ بمعيار».

## Silk Wrap · key visual (3D)

`SIRAJ_Project-Siraj_Wrap_{Post,Story}_{AR,EN}_v1.0.png`: one SIRAJ Silk ribbon wraps the building in a full three-dimensional spiral, rising from the plaza and flowing into the sky. This is the brand's WRAP formation.

- `Source/SIRAJ_Project-Siraj_Wrap_4x5_v1.0.jpg` and `Source/SIRAJ_Project-Siraj_Wrap_9x16_v1.0.jpg` are AI-assisted CGI (Nano Banana Pro) built on the hero view. Each is finished with `tools/keyvisual-enhance.py`: true black point, S-curve, vibrance and light sharpening. There is no fading.
- Layout: `Source/project-siraj-wrap-post.html`.
  - No milky overlays. The type sits in the sky, and on a deep SIRAJ Shadow fall at the bottom.
  - The logo stays in clear sky, never on the silk.
- Build: `node tools/build-project-siraj-wrap.js`.

The hero posts were rebuilt the same way: their ivory sky overlay was removed, and the 35 % grade was replaced by `keyvisual-enhance.py`.

**People rule fix (2026-10-12).** `Source/SIRAJ_Project-Siraj_Facade_Clean_v1.0.jpg` still showed street figures at full frame (a couple, one woman unveiled, and a pedestrian). They were removed with an AI edit (Nano Banana Pro). Only the two street patches were composited back into the original, so the building is pixel-identical. Re-running `tools/project-siraj-facade-prep.py` regenerates the file from the supplied photo with those figures, so keep this version. The cut-out used by the façade posts was never affected.

**Architect's design package (2026-10-12).** The original elevations and 3D renders by ORIX × Waleed Eid Group are in `Source/Architect/`: the presentation PDF plus six full-resolution renders (corner perspective, front and side elevations, each by day and by night). They are source files only. Every render still contains figures that break the people rule, so clean them before publishing. See `Source/Architect/README.md`.

**Publish-ready renders (2026-10-12).** `Source/Clean/` holds six cleaned and relit 4K renders: corner, front and side views, each as a cinematic cloudy day and at blue hour. There are no people and no placeholder signage, and the architecture is unchanged. These are the official project imagery for marketing. See `Source/Clean/README.md`.
