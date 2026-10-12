# SIRAJ · Production

Contents: 1. Repo map · 2. make-post briefs (schema + recipes) · 3. Ready templates · 4. Other builds · 5. Real silk pipeline · 6. Language archive · 7. Saving work · 8. Without the repo (claude.ai, Claude Design, artifacts)

## 1. Repo map (github.com/Mr-Ghassan/SIRAJ)

| Folder | What |
|---|---|
| `00-Brand-Foundation` | strategy, design language, `brand.config.json` (facts, policies) |
| `01-Logos` · `02-Colours` · `03-Typography` · `04-Grids` · `05-Graphic-System` | core identity |
| `06-SIRAJ-Silk` | **real silk** stills (11 formations × 16:9, 9:16, 1:1, 4:5 + web), `Stills/Alpha` cut-outs, `Footage` (keyed ribbon video) |
| `07-Icon-System` · `08-Photography` · `09-Design-System` · `10-UI-Components` | icons, photo library, tokens + `siraj.css`, UI |
| `11-Social` | `Templates/` (engine `social.js`), `Exports/`, **`Content/`** (make-post output and `briefs/`) |
| `12-Print` · `13-Presentations` · `14-Property-Marketing` | stationery, decks (HTML/PDF/PPTX incl. Arabic PPTX), property marketing; `14-…/12-Project-Siraj` = Founding Project posts |
| `15-Motion-System` · `16-Intro` · `17-Outro` | motion library, official films |
| `20-Brand-Guidelines` · `21-Brand-Kit` | guidelines PDF (81 pp), ready-to-send ZIPs |
| `99-Archive` | dormant English, CG silk previs — never use in communications |

## 2. make-post briefs

`node tools/make-post.js <brief.json> [--formats post,story]` → `11-Social/Content/<date>_<name>/` with one PNG per format, `source.html` and a copy of the brief. Exit code 2 = layout-QA warnings (listed); fix and re-run.

| Field | Values | Notes |
|---|---|---|
| `name` | `Siraj-Teaser-01` | file-safe |
| `formats` | `post` `square` `story` `reel` `li` `x` | default `["post","story"]` |
| `layout` | `type` · `hero` · `window` · `split` | type = copy on a field/silk; hero = full-bleed photo; window = photo in a Silk-Corner window; split = half photo |
| `env` | `ivory` `linen` `deep` `shadow` `maroon` `photo` | use `photo` with `hero` |
| `still` | a formation name (`Drape-Deep`, `Drape-Lumen`, `Drape-Fall`, `Horizon-Deep`, `Horizon-Ivory`, `Ribbon-Sweep`, `Ribbon-Ivory`, `Ribbon-Pair`, `Fold-Corner-Ivory`, `Gateway`, `Wrap`) | real-silk background, ratio chosen automatically |
| `stillPos` / `stillMirror` | CSS position / `true` | reframe the silk |
| `photo` | library name or repo path | library: `Residential-Tower-Golden-Hour`, `Mixed-Use-Plaza-Evening`, `Commercial-Facade-Morning`, `Apartment-Interior-Sea-View`, `Sales-Centre-Interior`, `Construction-Site-Dawn`, `Aerial-Coastal-Community`, `Villa-Community-Dusk`, `Campaign-Silk-*`; Founding Project: `14-Property-Marketing/12-Project-Siraj/Source/SIRAJ_Project-Siraj_Hero_City_4x5_v1.0.jpg` (and `_9x16_`), `…/SIRAJ_Project-Siraj_Wrap_4x5_v1.0.jpg`, `…/SIRAJ_Project-Siraj_Facade_Clean_v1.0.jpg` |
| `pos` | `"50% 40%"` | photo framing |
| `overlay` | `horizon` · `scrim` | horizon = real-silk ground line under the copy; scrim = dark fall for legibility |
| `display` | `true` | big display title (short titles only) |
| `ar.eyebrow` `ar.title` `ar.lead` `ar.end` | text | `\n` = line break; `[[…]]` = keep LTR; tokens `{contact.website}` `{contact.social_handle}` `{founding_project.name_ar}` |
| `ar.blocks` | `[{type:"facts", items:[…]}]`, `{type:"stats", items:[{v,u,l}]}`, `{type:"list", items, numbered}`, `{type:"details", rows:[[k,v]]}`, `{type:"quote", text, cite}`, `{type:"progress", value, label}` | |
| `ar.note` | text (`\n` allowed) | multi-line footer note; **replaces** `ar.end` (use for CTA + disclaimer on two lines). `ar.end` is a single line |
| `logo` | `Primary` · `Sand` · `White` · `Deep` | force a logo variant (default is chosen by `env`; on photos prefer `Sand`) |
| `tint` | CSS colour, e.g. `"rgba(23,6,8,.35)"` | flat tint over the whole image |
| `topScrim` | `true` | short dark fall at the top (eyebrow over bright sky) |
| `scrimStrength` · `scrimReach` | `0–1` (default .9) · px (default 520) | strength / height of the bottom scrim with `overlay:"scrim"` |
| `photoScale` | e.g. `1.25` | zoom the hero photo (crop in on a detail — good for pre-launch "veil" teasers) |
| `horizonEdge` · `horizonScale` | e.g. `0.8` · `1.1` | how high the real-silk Horizon rises above the copy / its size |
| `formats_ar` | `{ "story": { "lead": "…" } }` | per-format **copy** overrides |
| `per_format` | `{ "story": { "photo": "…_9x16_v1.0.jpg", "pos": "50% 40%" } }` | per-format **design** overrides — use the native 9:16 photo for stories |

**Recipes**

```json
{ "name": "Siraj-Heart-Of-City", "formats": ["post","story"], "layout": "hero", "env": "photo",
  "photo": "14-Property-Marketing/12-Project-Siraj/Source/SIRAJ_Project-Siraj_Hero_City_4x5_v1.0.jpg",
  "pos": "50% 40%", "overlay": "horizon", "display": true,
  "ar": { "eyebrow": "المشروع المؤسِّس · مسقط", "title": "{founding_project.name_ar}",
          "lead": "في قلب المدينة، يبدأ المعيار.", "end": "{contact.post_line}" } }
```
```json
{ "name": "Standard-Statement", "formats": ["post","square"], "layout": "type", "env": "deep", "still": "Drape-Deep",
  "ar": { "eyebrow": "سراج للتطوير العقاري", "title": "لا نبدأ بالانتشار،\nبل نبدأ بمعيار.",
          "lead": "نبدأ بمشروع قوي، نبني اسمًا موثوقًا، ثم نتوسع بغاية واضحة.", "end": "[[@SIRAJPROPERTIES]]" } }
```
```json
{ "name": "Pillar-Product", "formats": ["post"], "layout": "window", "env": "ivory",
  "photo": "14-Property-Marketing/12-Project-Siraj/Source/SIRAJ_Project-Siraj_Facade_Clean_v1.0.jpg",
  "ar": { "eyebrow": "المنتج", "title": "مدروسة في كل تفاصيلها.",
          "blocks": [{ "type": "facts", "items": ["6 طوابق", "سكني وتجاري", "مسقط"] }],
          "end": "{contact.post_line}" } }
```
```json
{ "name": "Quote-Standard", "formats": ["post"], "layout": "type", "env": "deep", "still": "Drape-Deep",
  "ar": { "blocks": [{ "type": "quote", "text": "لا نبدأ بالانتشار،\nبل نبدأ بمعيار.", "cite": "سراج للتطوير العقاري" }],
          "end": "[[@SIRAJPROPERTIES]]" } }
```
A quote post needs no title. For a pre-launch **veil** teaser, use the Wrap key visual with `photoScale` ~1.3, `overlay:"scrim"` and `per_format.story.photo` = the 9:16 version.

Examples live in `11-Social/Content/briefs/`. Always open the PNGs and review them (SKILL.md §8) before presenting.

## 3. Ready templates (`11-Social/Templates`)

Property-Launch, Project-Feature, Construction-Update, Investment-Opportunity, Statistics, Quote, Event-Invitation, Corporate-Announcement, Partnership, Hiring, Sold-Announcement, Reel-Cover, Highlight-Cover, Profile-Avatar, Profile-Grid, Noor-Carousel (demo). Edit the JSON block in the template, then `node tools/build-social.js <Name>`. Templates render Arabic and English; after a build run `bash tools/archive-english.sh` to move English outputs to the dormant archive.

## 4. Other builds

| Need | Command / place |
|---|---|
| Founding Project posts (facade, hero, wrap) | `node tools/build-project-siraj-{facade,hero,wrap}.js` → `14-Property-Marketing/12-Project-Siraj/` |
| Presentations (HTML/PDF/PPTX + Arabic PPTX) | `npm run build:presentations` |
| Print / stationery | `npm run build:print` |
| Property marketing (brochure, outdoor, sales centre, events, mockups) | `npm run build:property` (sections: `node tools/build-property.js outdoor event …`) |
| Motion (intro, outro, transitions, components) | `npm run build:motion` (slow: ~1 h) |
| Guidelines PDF | `npm run build:guidelines` |
| Asset index | `npm run build:index` |
| Brand-kit ZIPs | `npm run build:kit` |

Renders use Playwright/Chromium via `tools/lib/render.js`; fonts load from `09-Design-System/css/siraj.css`.

## 5. Real silk pipeline

- New still: generate photographs (see `connectors.md`), pick the best, then `python3 tools/silk-photo-import.py <Formation> <landscape.png> <portrait.png> [grade 0–1]` → writes all ratios + web.
- Cut-outs: background removal (ElevenLabs `birefnet-v2-bg-removal`) → `06-SIRAJ-Silk/Stills/Alpha/SIRAJ_Silk_<F>-Alpha_<16x9|9x16>_v1.0.png`.
- Footage: shoot/generate on chroma green → `bash tools/silk-footage-key.sh <green.mp4> <out_alpha.webm> [0xRRGGBB]`; update `SirajFootage.PASS` in `15-Motion-System/lib/siraj-footage.js`.
- `npm run build:silk-cg` only writes CG previs to `99-Archive` — never a deliverable.

## 6. Language archive

Arabic is the only active language. Builders produce English only when `SIRAJ_EN=1`; templates that still emit English are cleaned with `bash tools/archive-english.sh` (`--dry-run`, `--restore` when English is re-activated).

## 7. Saving work

Work on the session's designated branch, commit with a clear message, push. Large binaries: keep single files < 100 MB (GitHub limit). Don't commit scratch files or `tools/.cache`.

## 8. Without the repo (claude.ai, Claude Design, HTML artifacts)

Use the bundled assets:
- **Fonts:** `assets/fonts/` (Tajawal, Jost) or Google Fonts (`Tajawal:wght@300;400;500;700`, `Jost:wght@300;400;500`).
- **Logo:** inline the SVG from `assets/logo/` (keeps it crisp); pick the variant by background (visual-system §3).
- **Silk:** `assets/silk/SIRAJ_Silk_<Formation>_<4x5|9x16>_web_v1.0.webp` as a full-bleed `background-size: cover` image — never a CSS gradient pretending to be silk.
- **Tokens:** `assets/tokens/siraj-tokens.css` (`--siraj-color-maroon` …).

HTML post skeleton (1080×1350, Arabic):
```html
<div dir="rtl" lang="ar" style="width:1080px;height:1350px;position:relative;overflow:hidden;background:#2C0F12;font-family:Tajawal">
  <img src="SIRAJ_Silk_Drape-Deep_4x5_web_v1.0.webp" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
  <div style="position:absolute;inset-inline:72px;top:72px;color:#D6C0B2">
    <div style="font-weight:500;font-size:21px;display:flex;align-items:center;gap:12px"><i style="width:9px;height:9px;background:#AA9180;transform:rotate(45deg)"></i>المشروع المؤسِّس · مسقط</div>
    <h1 style="font-weight:300;font-size:96px;line-height:1.2;color:#F7F2ED;margin:28px 0 0">أوّلُ الضوء.</h1>
    <p style="font-weight:400;font-size:30px;line-height:1.6;margin:16px 0 0">مبنى واحد، بمعيارٍ كامل.</p>
  </div>
  <div style="position:absolute;inset-inline:72px;bottom:72px;display:flex;justify-content:space-between;align-items:flex-end;color:#D6C0B2;font-size:19px">
    <!-- bottom-start (right in RTL): inline SIRAJ_Logo_Sand_v1.0.svg here, width 168px -->
    <span>سجّل اهتمامك · <span dir="ltr">[رقم الهاتف]</span> · <span dir="ltr">@SIRAJPROPERTIES</span></span>
  </div>
</div>
```
In **Claude Design**, start from the SIRAJ design system (colours, type, logo and silk assets loaded from this skill / the repo) and keep every rule in SKILL.md §2; hand final production back to the repo (§2 above) when the post must be pixel-exact, multi-format or archived.
