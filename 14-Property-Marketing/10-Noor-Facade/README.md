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
