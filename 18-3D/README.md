# 18 · 3D / CGI Language v1.0 (optional extension)

3D is used for campaign key visuals, project films and event content. It extends, and never replaces, architectural photography and project CGI.

## Objects

| Object | Description | Reference |
|---|---|---|
| **Silk Ribbon** | A single maroon satin band, 1:12 to 1:20 width-to-length, with a gentle twist (≤ 2 turns across the frame) | `06-SIRAJ-Silk` preset `ribbon-sweep` |
| **Silk Plane** | A large draped sheet with tension folds converging to one held point | preset `drape-lumen` |
| **Silk Wrap** | A ribbon spiralling a vertical axis at 0.42 H radius, about 2.5 turns | preset `wrap` |
| **Architectural Monolith** | A matte stone slab or tower in Stone `#AA9180` or Ivory, with sharp edges and 1–2 mm bevels | Graphic System: Architectural Cut |
| **SIRAJ Portal / Frame** | A vertical opening with an asymmetric silk-arch crown | Graphic System: Portal |
| **Lumen object** | A 45° faceted stone diamond that emits soft warm light, used **only** as a light source | the Lumen ◆ |

## Materials

| Material | Spec (PBR) |
|---|---|
| **SIRAJ Silk** (hero) | Base `#602733` (linear ≈ 0.115, 0.020, 0.033), Sheen 1.0 tinted `#C79A9C`, Sheen roughness 0.35, Anisotropy 0.6 along the length, Roughness 0.42, Specular 0.35, Subsurface 0.03 (wine) |
| Matte stone | Albedo `#D6C0B2` or `#AA9180`, Roughness 0.85, micro-normal from honed limestone |
| Glass | Bronze-tinted clear, IOR 1.52, transmission tint `#AA9180` at 10% |
| Metal (sparingly) | Brushed bronze `#8A6E5A`, roughness 0.35. Never chrome or gold. |

## Lighting and camera

- One warm key light from the upper end (5200 K area light) and a soft cool fill from the lower start at 15% intensity. Use subtle volumetric haze only in hero films.
- Lenses from 35 to 85 mm. Camera moves use GLIDE (smooth dolly or orbit, ≤ 10° per second). No whip pans, no drone-style rolls.
- Grade with `08-Photography/Grade/SIRAJ_Silk-Grade_v1.0.cube`.

## Do not

Do not use reflective chrome, gold, iridescent or holographic materials, particles or glitter, multiple competing ribbons, cloth that looks like a building material, buildings made of fabric, or physics simulations with chaotic flutter.

## Production note

The real-time reference is the SIRAJ Silk Engine (`06-SIRAJ-Silk/engine/`). For Blender, build the ribbon as a curve with a twisted, tapered profile, then apply a *Principled BSDF* with the sheen and anisotropy above. Animate the curve's evaluation range for the travelling ribbon, exactly as the engine's `range` parameter does.
