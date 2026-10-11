# Changelog

## v1.0.0 — 2026-10-11 · SIRAJ Brand Identity v1.0 (Official)

The first complete release of the SIRAJ Real Estate Development identity, design system and motion system.

- **Logo:** official wordmark preserved from the supplied master. Includes 9 colour variants, clear-space and minimum-size rules, 4 bilingual lockups (Tajawal + Jost, HarfBuzz-outlined), the S monogram, favicons, social avatars and the construction sheet.
- **Colour:** 4 official colours, an extended silk and neutral palette, CMYK and Pantone recommendations, WCAG contrast data, ASE/GPL/CSV swatches, and 5 gradients.
- **Typography:** Jost (Latin) and Tajawal (Arabic), following the client direction. Western digits are used everywhere via *SIRAJ Digits*. Includes the type scale and specimen.
- **Grid system:** 12 formats, including the Silk Axis (51°) and the Silk Field.
- **Graphic system:** Silk Blade, Silk Line, vector Silk Ribbon and Wrap, SIRAJ Window (Silk Corner), Portal, Architectural Cut, Silk Fold and Lumen.
- **SIRAJ Silk:** a proprietary WebGL silk engine with 11 formations rendered at 4 aspect ratios, plus alpha overlays.
- **Photography:** art direction, 12 concept images, and the *SIRAJ Silk Grade* LUT.
- **Icons:** 82 icons in outline and filled styles, with sprite, JSON manifest and specification.
- **Design system:** 182 design tokens exported to CSS, SCSS, JS/TS, Tailwind, Swift and Kotlin; base CSS; UI component library; example screens.
- **Applications:** social media system, stationery and business documents, presentation system (HTML, PDF and PPTX), property marketing, outdoor and mockups.
- **Motion:** motion principles and tokens, a deterministic renderer, the official intro (16:9, 9:16, 1:1, alpha and bilingual), the modular outro, 5 signature transitions, a motion component library, and optional sound design.
- **Brand guidelines:** an 80-page document (PDF and HTML), plus governance and the brand checklist.
- **Client confirmations (2026-10-11):** colours approved; website sirajproperties.net and Instagram @SIRAJPROPERTIES; Founding Project named «سراج · Siraj» (official façade posts, hero and 3D Silk Wrap key visuals in `14-Property-Marketing/12-Project-Siraj`); people rule: women only in hijab with modest dress, a mixed Omani and international cast, and Omani men in dishdasha and massar (never kumma or ghutra). The affected imagery was regenerated and all dependent assets were rebuilt.

- **Language policy (2026-10-11): Arabic only.** All communications for SIRAJ and the Founding Project are Arabic. English is dormant, kept in `99-Archive/English-Dormant/`, until a freehold project open to foreign ownership. Added Arabic editions of every motion component, Arabic-default outros, and an Arabic RTL PowerPoint template (`tools/pptx-arabize.py`).

- **Real silk only (2026-10-11).** Every silk background is now a photograph of real silk fabric, never a graphic or a CG render.
  - **Stills:** the 11 formations in `06-SIRAJ-Silk/Stills` (4 ratios plus web) and the 6 alpha cut-outs are real silk photography. Imported with `tools/silk-photo-import.py`; cut-outs made with BiRefNet v2.
  - **Footage:** the intro, outro and Ribbon / Arch transitions use real silk footage, a ribbon filmed on chroma green and keyed to VP9 + alpha (`06-SIRAJ-Silk/Footage`, `tools/silk-footage-key.sh`, `15-Motion-System/lib/siraj-footage.js`).
  - **Transitions:** the Sweep band and Fold flap are photographed silk.
  - **Posts and long formats:** the Project Siraj façade and hero posts use real silk cut-outs, and hoardings and the sales-centre wall carry one continuous real silk ribbon.
  - **Archive:** the CG engine stills are kept for reference only in `99-Archive/Silk-CG-v1.0`. The engine remains as a previs tool (`npm run build:silk-cg` writes only to the archive).

### Open items before public launch
- Confirm the remaining placeholder data (phone, address, CR, VAT) in `brand.config.json` and `12-Print/Source/print.config.json`, then rebuild.
- Approve the proposed brand line «Light, built. · نورٌ يُبنى».
- Replace the AI-generated concept imagery with commissioned project photography and CGI.
- Commission a bespoke Arabic wordmark (recommended v1.1).
