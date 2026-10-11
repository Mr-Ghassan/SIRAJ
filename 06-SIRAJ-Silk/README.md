# 06 · SIRAJ Silk — the signature behaviour

> Silk is a **behaviour**, not a texture. It **reveals, frames, connects, guides and transitions**, and then it leaves space for the architecture.

## The SIRAJ Silk Engine (`engine/siraj-silk.js`)

The engine is a proprietary, dependency-free WebGL2 renderer for art-directed maroon silk. It powers the stills, the backgrounds, the web hero option, and every motion piece (intro, outro and transitions).

- **DRAPE** is a full-frame silk surface. It is a height field built from long tension waves, creased folds (a smooth-abs crease) and folds converging on a pinch point, shaded per pixel.
- **RIBBON** is a continuous 3D band on a Catmull–Rom spline. It has a travelling wave, a twist profile, a width taper, and a visible `range` that lets the ribbon *travel* through a frame.
- **Shading** uses wrapped diffuse, plus a Kajiya–Kay anisotropic sheen along the fibre with a second shifted lobe (the satin streak), plus grazing-angle glow. Every value resolves through the **SIRAJ silk ramp** (Shadow, Deep, Silk Dark, Maroon, Midtone, Highlight, Sand), so the output never leaves the palette.
- **Deterministic:** `render(t)` returns the same frame for the same `t`, so stills, video and the web are pixel-consistent.
- **Dithered** output means no banding in video gradients.

```html
<canvas id="c"></canvas>
<script src="06-SIRAJ-Silk/engine/siraj-silk.js"></script>
<script src="06-SIRAJ-Silk/engine/presets.js"></script>
<script>
  const silk = new SirajSilk(document.getElementById('c'), SirajSilkPresets['ribbon-sweep']);
  (function loop(t){ silk.render(t / 1000); requestAnimationFrame(loop); })(0);
</script>
```

To preview a preset, open `engine/stage.html?preset=drape-lumen&w=1600&h=900&t=1.5`.

## Official formations (`engine/presets.js`, stills in `Stills/`)

| Formation | Concept | Use |
|---|---|---|
| **Drape-Lumen** | Full silk surface lit from the upper end | Hero backgrounds, covers, end cards |
| **Drape-Deep** | Quiet, dark drape that can carry type | Quotes, statements, title slides |
| **Drape-Fall** | Folds falling vertically | Portrait formats, hoardings, stories |
| **Ribbon-Sweep** | The single SIRAJ ribbon crossing the frame | Signature gesture |
| **Ribbon-Ivory** | The ribbon in the light environment | Light covers, print |
| **Ribbon-Pair** | Two layered ribbons | Campaign key visuals |
| **Horizon-Ivory / Deep** | Silk becoming the ground line | Architecture above, information below |
| **Fold-Corner-Ivory** | A silk corner entering diagonally | Section dividers, covers |
| **Gateway** | Two silk forms framing an opening | Project reveals, entrances |
| **Wrap** | A spiral ribbon wrapping a vertical axis | Composited around towers |

Each formation is supplied at 16:9 (3840×2160), 9:16, 1:1 and 4:5, as JPG (q92) plus web WebP. Transparent PNG overlays are in `Stills/Alpha/`. Rebuild with `node tools/build-silk.js [preset]`.

## Rules: how much, where, how

1. **One silk gesture per layout.** Silk is the signature, not the wallpaper.
2. **Coverage:** at most **35%** of a layout containing architecture or information. A full-bleed drape is only for covers, dividers, quotes and end cards, where no architecture is shown.
3. **Never hide the property.** Silk can frame, pass in front of the sky or foreground, or wrap around the building, but the architecture stays legible and dominant.
4. **Never touch the logo.** Silk passes before or after the logo is shown, and never over or through it.
5. **Direction:** silk enters from the **lower start** and leaves toward the **upper end** along the 51° Silk Axis. In RTL layouts, mirror the composition.
6. **Light:** the light always comes from the upper end. Use warm, single-source light, with no rim-light tricks and no coloured light.
7. **Material realism:** silk is satin-finish maroon with soft streak highlights. It is never glossy plastic, metallic or iridescent, and never any colour other than the maroon family.
8. **Scale:** silk must look either *architectural* (large, calm, few folds) or *precious* (a single fine ribbon). Avoid mid-scale crumpled fabric.
9. **Physics:** gravity, tension and air are suggested, never chaotic. Show no more than three dominant folds.
10. **Not fashion:** no bodies, no garments, no draped mannequins.

## Silk × Architecture (campaign language)

| Concept | Description | Reference |
|---|---|---|
| **Silk Wrap** | A ribbon spirals around a tower, which stays fully visible | `08-Photography/Library/SIRAJ_Photo_Campaign-Silk-Wrap_v1.0.jpg` · preset `wrap` |
| **Silk Reveal** | Silk glides away from the façade, mid-reveal | `…Campaign-Silk-Reveal…` · transition *Silk Sweep* |
| **Silk Horizon / Foundation** | The building rises from a landscape of silk | `…Campaign-Silk-Foundation…` · preset `horizon-*` |
| **Silk Gateway** | Two silk forms frame an entrance | `…Campaign-Silk-Gateway…` · preset `gateway` |
| **Silk Ribbon** | One ribbon travels across pages, scenes and campaigns | preset `ribbon-sweep` |
| **Architectural Fold** | Silk folds translated into planes | `05-Graphic-System` Fold and Architectural Cut |

When creating new campaign imagery (CGI, photography or AI-assisted), follow the brief template in `08-Photography/README.md`. Always grade with `08-Photography/Grade/SIRAJ_Silk-Grade_v1.0.cube`.
