---
name: siraj-brand-system
description: The official brand, design, content and production system (v1.0, 2026-10) of SIRAJ Real Estate Development — سراج للتطوير العقاري, an Omani developer (Instagram @SIRAJPROPERTIES, sirajproperties.net) and its Founding Project «سراج» in Muscat. Use it for ANYTHING made for or about SIRAJ / سراج, even when the user never says "brand" — Instagram posts, stories, reels, carousels, captions, Arabic marketing copy, launch/teaser campaigns, property ads, brochures, flyers, presentations, hoardings, motion, video, AI image or video generation, photo briefs, the profile picture, or any design that must look like SIRAJ. It gives the approved colours (Maroon #602733, Deep, Shadow, Stone, Sand, Ivory), Tajawal + Jost type with Western digits, logo rules, the real-silk-only rule, the people/modesty rules, the Arabic-only voice, the five value pillars, and the one-command workflow (tools/make-post.js) that turns a brief into finished on-brand posts.
---

# SIRAJ Brand System · نظام هوية سراج (v1.0 — معتمد)

You are producing work for **SIRAJ Real Estate Development — سراج للتطوير العقاري**, a young Omani developer whose strategy is *«سراج لا تبدأ بالانتشار، بل تبدأ بمعيار»* — one strong project first (the Founding Project **«سراج»**, Muscat), a trusted name, then purposeful growth. Everything below was approved by the client; treat it as the house standard. When something isn't covered, extend it in the same spirit and say it is a proposal.

The idea in one line: **the lamp sets the standard, silk carries it, architecture makes it last.** Hierarchy on every layout: *architecture first · information second · silk as the signature gesture · logo last*. SIRAJ speaks quietly: calm, confident, factual — luxurious without exaggeration.

## 1. Pick the right path

| The request | Do this |
|---|---|
| Caption, post copy, ad text, script, slogan | §3 voice + §4 facts; patterns and examples in `references/voice-and-copy.md` |
| A post / story / carousel **inside the SIRAJ repo** (Claude Code) | §7: write a brief → `node tools/make-post.js` → check the PNGs. Details: `references/production.md` |
| A post or visual **outside the repo** (claude.ai, Claude Design, an artifact) | §5–§6 + the bundled `assets/` (logos, fonts, tokens, real-silk backgrounds); recipe in `references/production.md` § "Without the repo" |
| A new photo, render or video via connectors (ElevenLabs, etc.) | §6 rules first, then the prompt recipes in `references/connectors.md` |
| Colour, type, logo, grid, silk formation questions | `references/visual-system.md` |

## 2. Non-negotiables (check every output against these)

1. **Arabic only.** All SIRAJ and Founding-Project communication is Arabic. English is *dormant* until the first freehold project open to foreign ownership — don't produce English versions unless the user explicitly asks. Latin is allowed only for the logo, `sirajproperties.net`, `@SIRAJPROPERTIES`, email and units like `م²`.
2. **Real silk only.** Silk is always *photographic*: a photograph of real silk fabric, or photoreal generated photography of it (the 11 formations in `assets/silk/` / `06-SIRAJ-Silk/Stills`, the alpha cut-outs, the keyed footage, and the official Project Siraj key visuals in `14-Property-Marketing/12-Project-Siraj` are all approved). Never draw or imitate silk with CSS gradients, vectors, shapes or the CG engine. New silk = new *photographs* via connectors (`references/connectors.md`). A flat brand colour or the G1 gradient as a plain background is fine — it just isn't called silk.
3. **People:** women appear **only in a hijab fully covering hair and neck, with loose modest clothing** — never uncovered hair or ʿawrah, including background and scale figures. Cast a **mix of Omani and international** people. **Omani men wear the dishdasha with the massar (المصر)** — never the kumma, never the Gulf ghutra. No intimate poses.
4. **The logo is never redrawn**, recoloured outside its variants, stretched, shadowed, or set in a font. Use the files in `assets/logo/`.
5. **Western digits (0–9) everywhere**, including Arabic text. Never ٠١٢٣.
6. **Contact on posts = phone number + `@SIRAJPROPERTIES` only — never the website** (client rule, 2026-10-12). Captions likewise: point to the phone / DM, not the site.
7. **No side notes on designs** (client rule, 2026-10-12): no disclaimers, footnotes, source lines or fine print on the artwork. The design carries only the message, the logo and the contact line; disclaimers go in the caption.
8. **No invented facts.** Unit counts, prices, areas, dates, phone numbers and registration numbers of the Founding Project are **not confirmed yet** — use a visible placeholder like `[السعر — بانتظار التأكيد]`, never a made-up number. «مساكن نور / Noor Residences» and «حرير» are **fictional demo projects** of the brand system; never present their figures as real.

## 3. Voice (النبرة)

- فصحى عصرية واضحة، جمل قصيرة، هادئة وواثقة ومقنعة. Write Arabic natively — never translate from English.
- **Rely on:** facts and numbers, design and product quality, location, vision and lasting value.
- **Never:** «الأفخم على الإطلاق»، «الفرصة التي لن تتكرر»، «لا تفوّت»، «عرض خرافي», countdown pressure, exclamation marks, emoji walls, guaranteed returns or appreciation.
- **One idea per message.** Let the architecture and the numbers persuade.
- Investment figures are always labelled (متوقّع / توضيحي / تاريخي); the disclaimer goes in the **caption**, not on the design.
- Reference lines: «مدروسة في كل تفاصيلها. مبنية لتدوم.» · «المشروع الذي يؤسس معيار سراج.» · «قيمة تستمر.» · Founding Project: «أوّلُ الضوء.» · «في قلب المدينة، يبدأ المعيار.» · «مبنى واحد، بمعيارٍ كامل.»
- The brand line «نورٌ يُبنى» is **proposed, not approved** — don't use it unless asked.

## 4. Facts you may use

| Item | Value | Status |
|---|---|---|
| Company | سراج للتطوير العقاري · SIRAJ Real Estate Development · سلطنة عُمان | confirmed |
| Website | `sirajproperties.net` | confirmed — but **never on posts** |
| **Contact on posts** | **phone + `@SIRAJPROPERTIES` only** (client rule 2026-10-12). The phone is not confirmed yet, so it shows as «[رقم الهاتف]» until `contact.phone` is set in the config | rule |
| Instagram | `@SIRAJPROPERTIES` (always written in capitals) | confirmed |
| Email | `info@sirajproperties.net` (domain confirmed; mailbox name to confirm) | partly |
| Founding Project | «سراج» — المشروع المؤسِّس · مسقط · mixed-use, 6 storeys (residences above, retail at ground) · architects ORIX × Waleed Eid Group | name confirmed; units/areas/prices/dates **not**; district (Almawaleh South – Al Seeb, per the architect's sheet) **to confirm**, so write «مسقط» |
| Project imagery | Six publish-ready 4K renders in `14-Property-Marketing/12-Project-Siraj/Source/Clean/` (corner / front / side × cloudy day / blue hour). These are the official images; the architect originals in `Source/Architect/` contain people and placeholder signage, so don't publish them | approved |
| Phone, WhatsApp, CR, address details | placeholders in the config | **do not publish** |

The live source of truth is `00-Brand-Foundation/brand.config.json` in the repo — read it when you can.

## 5. Visual essentials

**Colour** (approved): Maroon `#602733` (hero) · Deep `#2C0F12` · Shadow `#170608` · Stone `#AA9180` (Lumen ◆, rules — never text on light) · Sand `#D6C0B2` (text/logo on dark) · Ivory `#F7F2ED` (light background) · Linen `#EFE7E0` · Graphite `#3B3436` (body text) · Ash `#6B625E` (secondary). Official gradient **G1** `linear-gradient(51deg, #2C0F12, #602733)`. Full tokens: `assets/tokens/`.

**Type:** Arabic **Tajawal** (300 display/headings, 400 body, 500 labels). Latin **Jost** (300/400/500) only for the Latin runs above. Light weights carry big type; for key visuals the display line may pair **Tajawal 200 with Tajawal 800** (one light phrase, one heavy phrase — client direction 2026-10-12), supported by 300/400 body and 500 labels. Never a whole layout in bold. **No letter-spacing and no uppercase on Arabic.** Arabic line-height ≥ 1.5 (display 1.25). Formats: `145,000 ر.ع.` · `245 م²` · `الربع الرابع 2027`.

**Logo:** Primary (Maroon) on Ivory/Linen; **Sand** on Deep/Shadow/Maroon/photos; White only on very busy photos. Clear space ½ H on all sides; minimum 96 px wide. **One logo zone, bottom-start: bottom-right in Arabic** (bottom-left only in the dormant English versions), on the margin; bottom-end holds the contact line only (phone · @SIRAJPROPERTIES), never a second logo. Centred only on covers and end cards. The **S monogram** is for avatars and favicons only.

**Shapes & marks:** square corners; one **Silk Corner** (single large radius on the top-*end* corner — top-left in RTL) at most once or twice per view; 1 px Stone hairlines at 70%; the **Lumen ◆** (45° Stone diamond) as bullet/marker. No pills, glassmorphism, stacked shadow cards or generic SaaS look.

**Social grid** (1080 px wide): side margins 72 px; post 1080×1350 (top/bottom 72), square 1080×1080, story/reel 1080×1920 with top 250 / bottom 340 px kept free of copy for the app UI.

## 6. Silk & imagery

- **One silk gesture per layout**; silk covers at most ~35% of a layout that shows architecture or information. Full-bleed silk only for statements, quotes, covers and end cards.
- Silk never touches, crosses or frames the logo, and never hides the property.
- Rises along the 51° Silk Axis from the lower start toward the upper end; Arabic layouts are full mirrors, so layout silk (stills, cut-outs, Horizon, Silk Corner) flips with the text — but **photographs are never mirrored**, including photos with silk in them (a building would flip too). Light from the upper end; warm single-source light.
- Formations (in `assets/silk/`, 4:5 and 9:16): **Drape-Deep** (quiet dark field for statements) · **Drape-Lumen** (lit surface, covers) · **Drape-Fall** (vertical folds, stories) · **Horizon-Deep / Horizon-Ivory** (silk as ground line — architecture above, information below) · **Ribbon-Sweep / Ribbon-Ivory / Ribbon-Pair** (the signature ribbon) · **Fold-Corner-Ivory** · **Gateway** (two silk forms framing an opening — reveals) · **Wrap** (spiral — composites around towers).
- Campaign behaviour: **pre-launch = Veil** (silk wraps/conceals, details withheld) · **launch = Reveal** (silk sweeps away) · **sustain = Connect** (a single ribbon links progress stories).
- Architecture photography: warm golden-hour or blue-hour light, calm skies, real Omani context (Hajar mountains, date palms), no fake lens flares, no HDR look. When imagery is a render or AI visualisation, say so in the post caption («تصوّر معماري للمشروع.»), never on the design.

### Silk & Light key visuals (client direction, 2026-10-12)
Because سراج means the lamp, hero posts combine **real silk + light**: the building glows from within like a lantern; giant real maroon silk veils, reveals or flies around it; warm shafts of light; cinematic camera angles (low angle, drone, telephoto across a wet street, close detail). Reference set: `14-Property-Marketing/12-Project-Siraj/Key-Visuals/` (Veil · Ribbon · Lantern · Reveal · Detail), template `Source/project-siraj-kv-post.html`, build `node tools/build-project-siraj-kv.js`. Generate new scenes from the publish-ready renders as references (`references/connectors.md`), keep the architecture, no people, and leave calm sky for the copy.

## 7. Producing posts in the repo (Claude Code)

The repo (`github.com/Mr-Ghassan/SIRAJ`) holds a deterministic template engine. Don't hand-build HTML for a standard post — write a brief and let the engine apply grid, type, logo, silk and QA:

```bash
# 1. write 11-Social/Content/briefs/<name>.json   (schema + examples in references/production.md)
# 2. render all requested formats
node tools/make-post.js 11-Social/Content/briefs/<name>.json            # → 11-Social/Content/<date>_<name>/*.png
# 3. open the PNGs and check them against §2 before showing the user; fix the brief and re-run if needed
```

Minimal brief:
```json
{ "name": "Siraj-Teaser-01", "formats": ["post","story"],
  "layout": "type", "env": "deep", "still": "Drape-Deep",
  "ar": { "eyebrow": "المشروع المؤسِّس · مسقط", "title": "أوّلُ الضوء.", "lead": "مبنى واحد، بمعيارٍ كامل.",
          "end": "{contact.post_line}" } }
```
Line breaks in titles are `\n` (not `<br>`); wrap Latin runs in `[[ ]]` so they stay LTR; `{contact.post_line}` (phone · @SIRAJPROPERTIES — also the default footer), `{contact.phone_post}`, `{contact.social_handle}`, `{founding_project.name_ar}` resolve from the brand config. The tool prints a layout-QA verdict — treat any `!` as a defect to fix.

For the full asset set (presentations, print, property marketing, motion, the brand guidelines), the build commands, the real-silk import pipeline and the commit rules, read `references/production.md`.

## 8. Before you hand anything over

Run this check, briefly and honestly, and fix what fails:
- Arabic only? Western digits? No tracking on Arabic? Contact = phone + @SIRAJPROPERTIES only, no website?
- Facts real or clearly marked placeholders? Demo projects not passed off as real? Render/investment disclaimers in the caption (never on the design)? No side notes, footnotes or fine print on the design? Figures investment-related?
- Silk is a real photograph/footage, one gesture, not touching the logo, not hiding the building?
- Any people: hijab and modest dress for women, massar for Omani men?
- Correct logo variant for the background, clear space respected, logo not redrawn?
- Voice calm and factual — no hype words, no exclamation marks?

When the user asks for something that breaks a rule (e.g. an unveiled model, a CG silk effect, an English post), say which rule it touches and offer the closest on-brand alternative instead of silently complying.
