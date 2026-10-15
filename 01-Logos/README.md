# 01 · Logos — SIRAJ Official Wordmark v1.0

The SIRAJ wordmark is **fixed**. Every file here is generated from the supplied Illustrator master (`Master/Source/SIRAJ_Logo_Master_v1.0.ai`), and the path geometry is unchanged. The only operation applied is a translation to a tight bounding box.

Regenerate everything with `node tools/build-logos.js`.

## Anatomy

| Part | Description |
|---|---|
| **Letters** S · I · R · A · J | Stencil-cut capitals. The **S** carries calligraphic swashes. The **R** and **A** end in tapering curves, the *Silk Blade* that becomes the brand's signature curve. |
| **Lumen ◆** (×2) | 45° stone diamonds (`#AA9180`) crowning the **I** and the **J**: the light of the lamp (*siraj*). Never recolour them in full-colour versions. |
| **Proportion** | W : H = **3.49 : 1** (98.163 × 28.11 source units) |
| **Grid unit X** | The I-stem width, equal to H ÷ 5.7 |

## Clear space and minimum size

- **Clear space:** ½ H on every side (H = wordmark height). Nothing may enter this zone, whether text, edges, folds or other logos.
- **Minimum size:** 96 px wide on screen and 25 mm wide in print. Below this, use the **S monogram** (avatars and favicons only).
- See `Construction/SIRAJ_Logo_Construction_v1.0.png`.

## Colour variants (`SVG/`, `PNG/`, `PDF/`)

| Variant | Letters | Lumen | Use on |
|---|---|---|---|
| **Primary** | Maroon `#602733` | Stone `#AA9180` | Ivory, white, linen (**default**) |
| **Deep** | Deep `#2C0F12` | Stone | Sand, stone and light photography |
| **Sand** (reversed) | Sand `#D6C0B2` | Stone | Maroon, Deep, Shadow, black, G1 gradient, silk (**default dark**) |
| **White** | White | Sand | Dark or mid-tone photography only |
| **Mono Maroon / Deep / Black / White / Sand** | one colour | same | Single-colour production: emboss, foil, engraving, fax, stamps |

Each variant is supplied as tight SVG, `_ClearSpace` SVG, PNG at 512, 1024, 2048 and 4096 px, a 2048 px clear-space PNG, and a vector PDF.

## Lockups (`Lockups/`)

| Lockup | Use |
|---|---|
| **Descriptor**: wordmark over «REAL ESTATE DEVELOPMENT» (Jost Regular, tracked, outlined) | English-only contexts (dormant) |

**Arabic-name lockups withdrawn (decision D1, 2026-10-15).** The Horizontal, Stacked and Arabic-led lockups typeset
«سراج للتطوير العقاري» in Tajawal; they are archived in `99-Archive/Withdrawn/Arabic-Name-Lockups/` and never used. The
official SIRAJ English artwork is the brand mark. The registered Arabic corporate name appears only as normal legal or
administrative text where required (a letterhead footer, a contract, an ID-card return address), never as a logo, next
to the wordmark as a unit, or as a substitute lockup.

## Approved backgrounds (`Light/`, `Dark/`)

- **Light:** Ivory, White, Linen (Primary), and Sand (Deep).
- **Dark:** Maroon, Deep, Shadow, Black, and the G1 gradient (Sand).
- `Dark/SIRAJ_Social-Avatar_*` reproduces the official artboard 03 (the wordmark at 57.2% width on G1).

## Monogram (`SVG/SIRAJ_Monogram-S_*`)

The **S** is lifted from the wordmark without modification. Use it only for app icons, favicons and social avatars where the full wordmark would fall below 96 px. Favicons are in `PNG/Favicon/` (16 to 512 px plus SVG).

## Incorrect use (never)

1. Never redraw, retype or "improve" the letters.
2. Never stretch, condense, skew or rotate the wordmark.
3. Never recolour the Lumen in full-colour versions, remove it, or animate it separately from the logo in a way that detaches it.
4. Never use colours outside the variants above, or gradients inside the letters.
5. Never apply drop shadows, glows, bevels, outlines or 3D extrusion. In the intro, the Lumen glow is a lighting event, not a logo effect.
6. Never place the wordmark on busy image areas without enough contrast. Use White or Sand on a calm area, or move the logo.
7. Never let silk or any graphic cross, overlap or distort the wordmark.
8. Never lock up the wordmark with other words, taglines or icons except the approved Descriptor lockup. Never typeset «سراج» or «سراج للتطوير العقاري» as a logo.
9. Never place it inside a container shape (box, circle or badge), except the approved avatar and monogram tiles.
10. Never set "SIRAJ" in a typeface as a substitute for the logo.
