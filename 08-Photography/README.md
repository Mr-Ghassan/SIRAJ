# 08 · Photography & Rendering — Art Direction v1.0

> **Architecture first.** Warm natural light, honest materials, calm composition, cinematic depth.

## Library

`Library/SIRAJ_Photo_<Name>_v1.0.jpg` contains 12 reference images, graded with the SIRAJ Silk Grade. Ungraded masters are in `Library/Ungraded/`.

| Image | Category |
|---|---|
| Residential-Tower-Golden-Hour | Exterior · residential |
| Villa-Community-Dusk | Exterior · villas |
| Apartment-Interior-Sea-View | Interior |
| Mixed-Use-Plaza-Evening | Lifestyle · mixed-use (human scale) |
| Commercial-Facade-Morning | Exterior · commercial |
| Construction-Site-Dawn | Construction |
| Sales-Centre-Interior | Sales experience |
| Aerial-Coastal-Community | Drone · masterplan |
| Campaign-Silk-Wrap · Reveal · Foundation · Gateway | SIRAJ Silk × Architecture campaign |

> **Disclosure:** these images are AI-generated **concept visuals**, used to demonstrate the art direction and the system. They do not depict real SIRAJ projects. Replace them with commissioned photography or project CGI before any public marketing, and never present them as an existing development.

## The SIRAJ Silk Grade (`Grade/SIRAJ_Silk-Grade_v1.0.cube`)

A 33-point 3D LUT (sRGB in and out) for Lightroom, Photoshop, Resolve, Premiere and Final Cut. It does the following:

1. Pulls saturated reds toward **SIRAJ wine-maroon** (hue 348°), with −18% saturation and slightly darker values.
2. Calms skies by reducing blue and cyan saturation by 25%.
3. Applies −6% global saturation, so the result never has an HDR or over-saturated look.
4. Adds a soft S-curve with gentle highlight roll-off.
5. Split-tones shadows toward SIRAJ Shadow and highlights toward Warm Ivory.
6. Lifts the black floor to `#0A0405`, so blacks are never crushed to pure black.

Apply it at 100% and then balance exposure. Script: `python3 tools/siraj-grade.py apply in.jpg out.jpg`.

## People: mandatory modesty rule (official)

> **Women appear only wearing a hijab that fully covers the hair and neck, with loose, modest clothing (abaya or long, loose dress) covering arms to the wrists and legs to the ankles. No uncovered hair, no tight or revealing clothing, and nothing that shows ʿawrah.**
>
> **لا تُستخدم إلا صور نساء محجبات، دون إظهار الشعر أو أي عورة، وبلباس محتشم فضفاض.**

- **Casting is a mix.** SIRAJ is an Omani company serving Omani, GCC and international clients, so people are a natural mix of Omani and international residents, investors and professionals.
- **Omani men wear the dishdasha with the Omani massar (المصر)**, the patterned wrapped turban. They are not shown in the kumma, and never in a Gulf ghutra or shemagh.
- International men wear formal or smart-casual modest clothing (suits, linen jackets, long trousers).
- This applies to photography, CGI, AI-assisted imagery, stock, video, illustrations, scale figures in renders, mockups and event content, including people in the background and small figures.
- Avoid romantic or intimate poses between people, and keep a respectful distance.
- **Third-party renders** (for example architects' CGI) must be checked before use, and non-compliant figures edited out or replaced.

## Direction by subject

| Subject | Composition | Camera | Light | People |
|---|---|---|---|---|
| **Exteriors** | Strong verticals (corrected), building on the third line, sky as negative space | 24–35 mm, eye level or slightly low | Golden hour or blue hour, single warm source | None, or tiny for scale |
| **Interiors** | One-point or two-point perspective, horizon at mid height, view through glazing | 24 mm tilt-shift, tripod | Raking daylight, long shadows, lamps off or warm | None, or a hand or silhouette |
| **Drone** | Masterplan legible, coastline or mountains as context | 45–60° oblique or top-down | Low sun, soft haze | None |
| **Construction** | Precision and progress: crane, frame, orderly site | Wide, tripod | Dawn or early morning | Workers in PPE, distant, dignified |
| **Lifestyle** | Candid, unposed, architecture dominant | 35–50 mm | Evening warm light | A mix of Omani and international residents; Omani men in dishdasha and massar; all women in hijab and modest dress |
| **Investment** | Details: models, materials, plans, keys | 50–90 mm macro | Soft window light | Hands only |

## Colour grading targets

- **Highlights:** warm ivory, never pure white blown-out skies.
- **Shadows:** warm, slightly wine-toned, with detail kept.
- **Skies:** calm desaturated blue, or the warm gradient of golden hour. No HDR drama, no fake clouds.
- **Maroon in frame:** an accent (a cushion, a door, a silk drape), never a colour cast.

## Avoid

Over-saturated HDR, artificial luxury (gold taps, chandeliers everywhere), fake smiles and posed handshakes, obvious stock photography, lens flares, unrealistic skies, hyper-glossy renders, wide-angle distortion, tilted verticals, people looking at the camera, and Western-only casting.

## Brief template for new campaign imagery (CGI or AI-assisted)

```
SUBJECT: <building type>, <location>, <time of day>
ARCHITECTURE: realistic, structurally credible, materials = pale stone / bronze glass / timber
SILK (if any): ONE deep burgundy-maroon silk <ribbon | sheet | two forms> that <wraps | reveals | frames | forms the ground>,
  satin highlights, separate from the building, never covering the façade; ≤ 35 % of frame
LIGHT: single warm source from upper right; soft long shadows
CAMERA: <lens>, verticals corrected, generous negative space top-end for type
PEOPLE: a mix of Omani and international; Omani men in dishdasha + Omani massar turban (not kumma, not ghutra); international men in suits; ALL women in hijab (hair and neck fully covered) and loose modest clothing
AVOID: text, logos, gold, glossy plastic, HDR, lens flare, people posing, uncovered hair, tight or revealing clothing
POST: apply SIRAJ_Silk-Grade_v1.0.cube
```
