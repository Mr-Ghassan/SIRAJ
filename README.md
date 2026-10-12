<p align="center"><img src="01-Logos/SVG/SIRAJ_Logo_Primary_v1.0.svg" width="360" alt="SIRAJ"></p>

<h3 align="center">SIRAJ Real Estate Development · سراج للتطوير العقاري</h3>
<p align="center"><b>Brand Identity v1.0 · Official · Production-ready</b></p>
<p align="center"><i>Architecture shaped with the elegance, continuity and controlled movement of silk.</i></p>

---

This repository is the **single source of truth** for the SIRAJ brand. It contains the official visual identity, design system, motion system, production assets and the build tools that generate them.

**Start here**

| | |
|---|---|
| 📕 **Brand Guidelines** | [`20-Brand-Guidelines/SIRAJ_Brand-Guidelines_v1.0.pdf`](20-Brand-Guidelines/) |
| 📦 **Brand Kit (ready to send)** | [`21-Brand-Kit/`](21-Brand-Kit/): Essentials ZIP, Project Siraj posts ZIP |
| 👤 **Profile picture** | [`01-Logos/Dark/SIRAJ_Social-Avatar_Square_v1.0.png`](01-Logos/Dark/SIRAJ_Social-Avatar_Square_v1.0.png) |
| 🧭 **Quick reference** | [`00-Brand-Foundation/DESIGN-LANGUAGE.md`](00-Brand-Foundation/DESIGN-LANGUAGE.md) |
| 💡 **Strategy** | [`00-Brand-Foundation/BRAND-STRATEGY.md`](00-Brand-Foundation/BRAND-STRATEGY.md) |
| 🗂 **Every file** | [`ASSET-INDEX.md`](ASSET-INDEX.md) |
| 📝 **Release notes** | [`CHANGELOG.md`](CHANGELOG.md) |

## Strategy

> **SIRAJ develops considered real estate projects designed to create lasting value.**
> **سراج تطور مشاريع عقارية مدروسة تصنع قيمة تستمر.**
>
> *SIRAJ does not begin with scale. It begins with a standard. · سراج لا تبدأ بالانتشار، بل تبدأ بمعيار.*

The company follows **PROVE → EXPAND → SCALE**. It starts from one strong **Founding Project** in Muscat and grows in circles. Each project is an endorsed brand within the SIRAJ system.

The official strategy is in [`00-Brand-Foundation/STRATEGIC-POSITIONING_AR.md`](00-Brand-Foundation/STRATEGIC-POSITIONING_AR.md), with the English rendering in [`STRATEGIC-POSITIONING_EN.md`](00-Brand-Foundation/STRATEGIC-POSITIONING_EN.md).

## The idea

> **The lamp sets the standard. Silk carries it. Architecture makes it last.**

- **Siraj (سِراج)** means *the lamp*. The two stone diamonds on the I and the J of the wordmark are its flames. In the system they become the **Lumen ◆**, the brand's marker of light.
- **SIRAJ Silk** is deep maroon silk used as a *behaviour*. It reveals, frames, connects and transitions.
- **Architecture** provides the order: the grid, square corners, real buildings and generous space.

The hierarchy on every layout is **architecture first, information second, silk as the signature gesture, and the logo as the final identifier.**

## Core specification

| | |
|---|---|
| **Primary** | SIRAJ Maroon `#602733` |
| **Official palette** | Deep `#2C0F12` · Sand `#D6C0B2` · Architectural Stone `#AA9180` |
| **Light / Dark** | Warm Ivory `#F7F2ED` / SIRAJ Shadow `#170608` |
| **Typefaces** | **Jost** (Latin) · **Tajawal** (Arabic), both SIL OFL |
| **Language** | **Arabic only** for all communications. English is dormant until a freehold project open to foreign ownership (see `DESIGN-LANGUAGE.md` § 0) |
| **Numerals** | Western digits (0–9) in every language |
| **Signature** | SIRAJ Silk · the Lumen ◆ · the Silk Corner |
| **Motion** | FLOW · DRAPE · REVEAL · WRAP · FOLD · GLIDE · SETTLE (no bounce) |

## Repository map

| Folder | Contents |
|---|---|
| [`00-Brand-Foundation`](00-Brand-Foundation) | Strategy, design-language quick reference, `brand.config.json` (company and contact data used by every template) |
| [`01-Logos`](01-Logos) | Original master files, SVG, PNG, PDF, light and dark backgrounds, monochrome, bilingual lockups, monogram, favicons, construction |
| [`02-Colours`](02-Colours) | Palette specification, ASE (RGB and CMYK), GPL, CSV |
| [`03-Typography`](03-Typography) | Jost and Tajawal fonts, `@font-face` CSS, type specimen |
| [`04-Grids`](04-Grids) | 12 grid systems (web, presentation, social, editorial, outdoor) |
| [`05-Graphic-System`](05-Graphic-System) | Silk Blade, Silk Line, vector ribbons, Window, Portal, Cut, Fold, Lumen, CSS masks |
| [`06-SIRAJ-Silk`](06-SIRAJ-Silk) | **SIRAJ Silk Engine** (WebGL), formations, 4K stills, alpha overlays |
| [`07-Icon-System`](07-Icon-System) | 82 proprietary icons in outline and filled styles, sprite, JSON manifest |
| [`08-Photography`](08-Photography) | Art direction, graded image library, **SIRAJ Silk Grade** LUT |
| [`09-Design-System`](09-Design-System) | Design tokens (CSS, SCSS, JS/TS, Tailwind, Swift, Kotlin) and base CSS |
| [`10-UI-Components`](10-UI-Components) | UI component library and example screens (web, dashboard, portal) |
| [`11-Social`](11-Social) | Social media templates and exports (EN and AR) |
| [`12-Print`](12-Print) | Stationery and business documents |
| [`13-Presentations`](13-Presentations) | HTML deck, PDF and editable PPTX |
| [`14-Property-Marketing`](14-Property-Marketing) | Brochure, fact sheets, floor plans, outdoor, signage, mockups, campaign key visuals |
| [`15-Motion-System`](15-Motion-System) | Motion library, web motion layer, components, transitions, sound |
| [`16-Intro`](16-Intro) | Official brand intro (16:9 · 9:16 · 1:1 · alpha · bilingual) |
| [`17-Outro`](17-Outro) | Official modular brand outro |
| [`18-3D`](18-3D) | CGI language and material specification |
| [`19-Templates`](19-Templates) | Email signature and document template kit |
| [`20-Brand-Guidelines`](20-Brand-Guidelines) | The complete brand guidelines (PDF, HTML, page previews) |
| [`21-Brand-Kit`](21-Brand-Kit) | Ready-to-send ZIP packages (`npm run build:kit`) |
| [`99-Archive`](99-Archive) | Superseded material |
| [`tools`](tools) | Build scripts: everything here is reproducible |

## Using the system

**Web**

```html
<link rel="stylesheet" href="09-Design-System/css/siraj.css">            <!-- fonts + tokens + base type -->
<link rel="stylesheet" href="10-UI-Components/siraj-components.css">     <!-- components -->
<link rel="stylesheet" href="15-Motion-System/web/siraj-motion.css">     <!-- motion -->
<script src="15-Motion-System/web/siraj-motion-web.js" defer></script>
```

**Tokens:** use `09-Design-System/tokens/build/*`. Tailwind: `presets: [require('./09-Design-System/tokens/build/tailwind.preset.cjs')]`.

**Silk on the web:** see [`06-SIRAJ-Silk/README.md`](06-SIRAJ-Silk/README.md).

## Building

Requirements: Node ≥ 20, Python 3 (numpy, Pillow, python-pptx), Chromium (Playwright), ffmpeg and ImageMagick.

```bash
npm install
npm run build              # tokens, colours, logos, type, grids, graphics, icons, silk stills, index
npm run build:motion       # intro, outro, transitions, motion components (+ sound versions)
npm run build:guidelines   # brand guidelines PDF + pages
```

Individual targets are `build:tokens`, `build:logos`, `build:ui`, `build:social`, `build:print`, `build:presentations`, `build:property` and the others listed in `package.json`.

**Changing company details:** edit `00-Brand-Foundation/brand.config.json`, then rebuild the affected templates.

## Status and notes

- ✅ **Official v1.0.** The logo geometry is unchanged from the supplied master.
- ✅ Website **sirajproperties.net** and Instagram **@SIRAJPROPERTIES** are confirmed. The phone, address and CR details in `brand.config.json` are still placeholders.
- ⚠️ Photography in `08-Photography/Library` and the campaign visuals are **AI-generated concept imagery** (ElevenLabs/Seedream), used to demonstrate the art direction. Replace them with commissioned photography or CGI before public use.
- ✅ Colour values (HEX, RGB, CMYK, Pantone) are **approved**.
- ✅ **Language policy: Arabic only.** English deliverables are dormant in `99-Archive/English-Dormant/`.
- ✅ The Founding Project is officially named **«سراج · Siraj»** (`14-Property-Marketing/12-Project-Siraj/`).
- 💡 Proposed brand line *«Light, built. · نورٌ يُبنى»* is pending approval.
- 💡 A bespoke Arabic wordmark is recommended for v1.1.

---
<p align="center"><sub>© 2026 SIRAJ Real Estate Development. Fonts: Jost and Tajawal, SIL Open Font License 1.1.</sub></p>
