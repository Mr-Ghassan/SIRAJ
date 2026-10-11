# Noor · Official façade posts

Instagram post (4:5) and story (9:16), in Arabic and English. Each shows the official Noor façade zoomed out on Warm Ivory, with one SIRAJ Silk ribbon passing behind the building.

- `Source/SIRAJ_Noor_Facade_Clean_v1.0.jpg`: the official render, cleaned.
  - The architect's placeholder "SIGNAGE" lettering is removed.
  - People are removed (street figures and reflections), following the SIRAJ people rule.
- `Source/SIRAJ_Noor_Facade_Cutout_v1.0.png`: the building cut out (RGBA), with the base at the kerb line.
- `Source/noor-facade-post.html`: the layout (`?fmt=post|story&lang=ar|en`). The silk is rendered live by the SIRAJ Silk Engine.

Rebuild:

```
python3 tools/noor-facade-prep.py <official-render.jpg> 14-Property-Marketing/10-Noor-Facade/Source
node tools/build-noor-facade.js
```

## Hero · Noor in the heart of Muscat

`SIRAJ_Noor_Hero_{Post,Story}_{AR,EN}_v1.0.png`: a low three-quarter hero shot of the building on a Muscat city-centre street at golden hour. A SIRAJ Silk Horizon forms the ground under the building and carries the type.

- `Source/SIRAJ_Noor_Hero_City_4x5_v1.0.jpg` and `Source/SIRAJ_Noor_Hero_City_9x16_v1.0.jpg` are AI-assisted visualisations (ElevenLabs · Nano Banana Pro) generated from the cleaned official façade. They carry the SIRAJ Silk Grade at 35 %, which keeps the official rose-copper true. There are no people in the images.
- The side elevation is interpreted by the visualisation. Replace it with the architect's CGI when it is available.
- Layout: `Source/noor-hero-post.html` (`?fmt=post|story&lang=ar|en`). Build with `node tools/build-noor-hero.js`.

## Message

| | Arabic | English |
|---|---|---|
| Façade post | نور · أوّلُ ضوءٍ لسراج. · مبنى واحد، بمعيارٍ كامل. | Noor · SIRAJ’s first light. · One building. A complete standard. |
| Hero post | في قلب المدينة، يبدأ المعيار. | In the heart of the city, the standard begins. |

Both lines build on the brand core «سراج لا تبدأ بالانتشار، بل تبدأ بمعيار».
