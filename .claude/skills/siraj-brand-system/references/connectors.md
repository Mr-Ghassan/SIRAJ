# SIRAJ · Generating imagery and video with connectors

Use connectors (ElevenLabs Creative, Higgsfield, Runway, Adobe …) only for *photographic* material: architecture, interiors, people, real silk. Typography, logo and layout always come from the SIRAJ system (templates or HTML) — never ask an image model to render the logo or Arabic text.

Contents: 1. House rules · 2. Real silk prompts · 3. Architecture & lifestyle prompts · 4. People prompts · 5. Video · 6. Cut-outs · 7. After generation

## 1. House rules

- **Price first.** Run with `estimate_only` and say the cost; short clips and a handful of stills don't need approval, but long videos and big batches do.
- **Never repeat a generation call to "retry"** — it charges again. Poll the run status instead.
- Generate variations (default 4 for stills), pick the best against SKILL.md §2 and §6, and say which one you chose and why.
- Signed download URLs expire (≈ 2 h): download immediately into the repo/scratch and keep the generation IDs.
- Label AI imagery with the render disclaimer when published.
- Models that worked well: stills `bytedance-seedream-5-pro` (photoreal, 2K; custom sizes up to 3840 px, e.g. 3840×1280 for long formats); edits/references `gemini-3-pro-image`; video `bytedance-seedance-v2.5` (1080p, 4–30 s, set `generate_audio:false`); background removal `birefnet-v2-bg-removal` (≈ $0.005).

## 2. Real silk prompts (studio photography, never CGI)

Template — fill the formation line:
```
Real studio photograph, not CGI, not a 3D render. <FORMATION LINE>. Genuine deep wine-maroon (#602733) silk satin
with real weave texture, fine hems and realistic weight; soft warm highlights travel along the glossy folds, deep
burgundy shadows (#2C0F12) in the valleys. Background: <seamless very dark burgundy-black (#170608) backdrop with a
soft warm glow at the upper right | seamless warm ivory paper (#F7F2ED), evenly lit>. Single warm key light from the
upper right. Medium-format camera, 80 mm, sharp. Elegant, calm, architectural, minimal. No text, no logos, no people,
no props, no other colours.
```
Formation lines:
- Drape: «a large sheet of silk filling the frame in long calm diagonal folds rising from lower left to upper right, no more than three dominant folds»
- Drape-Fall: «a vertical silk curtain falling in long folds»
- Horizon: «silk laid low across the bottom third like gentle dunes, the top two thirds empty backdrop»
- Ribbon: «a single long ribbon, about a hand's width, floating diagonally from lower left to upper right with one gentle twist»
- Ribbon-Pair: «two parallel ribbons crossing once»
- Gateway: «two silk curtains framing a dark central opening»
- Wrap: «a single ribbon spiralling around an invisible vertical axis in three loops»
- Long format (3840×1280): «one very long ribbon stretched horizontally across the entire width in a calm shallow wave with two twists, staying inside the middle third»

For moving silk, generate on **pure chroma-key green (#00B140), evenly lit, no shadows**, locked-off camera, slow motion; the ribbon must enter and fully leave the frame. Key with `tools/silk-footage-key.sh`.

## 3. Architecture & lifestyle

```
Architectural photograph of <subject> in Muscat, Oman. <golden-hour | blue-hour> light, calm clear sky, Hajar mountains
softly in the distance, date palms, clean Omani streetscape. Honest perspective, natural materials (travertine,
warm stone, bronze, glass, timber), restrained landscaping. Photoreal, medium-format, no HDR, no lens flare,
no oversaturation, no text, no signage, no logos.
```
Use the publish-ready renders (`14-Property-Marketing/12-Project-Siraj/Source/Clean/`, corner/front/side × cloudy day/blue hour) as reference images when the Founding Project must appear, and keep its architecture unchanged (6 storeys, ivory and terracotta-screen façade with planting).

## 4. People (mandatory wording — include it every time people may appear)

```
People rules: every woman wears a hijab that fully covers her hair and neck and loose, modest, long clothing;
no uncovered hair or skin beyond face and hands, including people in the background. A mix of Omani and
international people. Omani men wear a white dishdasha with the Omani massar (embroidered turban), not a kumma cap
and not a Gulf ghutra or agal. Respectful, professional interactions; no intimate poses.
```
Check every output at full size — background figures are where violations hide. Reject and regenerate (a new run, with a stronger prompt) rather than retouching ʿawrah.

## 5. Video

- Seedance 2.5 at 1080p/8 s costs roughly $8 per clip; 720p/5 s ≈ $2.3. Price it first.
- Brief like a cinematographer: locked-off or slow dolly, one movement, no cuts, the same light rules as stills.
- Composite logos, Arabic type and end cards in the SIRAJ motion system (`15-Motion-System`, `17-Outro`), never inside the generated video.

## 6. Cut-outs

- Silk or objects on a clean backdrop: BiRefNet background removal; if it drops fabric that touches the frame edges (e.g. curtains), key locally against the backdrop instead.
- Very clean ivory backdrops can be keyed locally by colour distance with a per-column backdrop model.

## 7. After generation

Grade toward the SIRAJ palette (`tools/siraj-grade.py` / `tools/keyvisual-enhance.py` in the repo), import silk with `tools/silk-photo-import.py`, place photography through the templates, and commit sources plus outputs with a note of the model and cost.
