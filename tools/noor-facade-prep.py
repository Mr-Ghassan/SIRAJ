#!/usr/bin/env python3
"""Prepare the official Noor façade render for SIRAJ layouts.

1. Removes the architect's placeholder "SIGNAGE" lettering (fascia rebuilt from clean slats).
2. Removes people (street figures and reflections) per the SIRAJ people rule.
3. Cuts the building out of its context (sky keyed, ground and surroundings dropped).

Usage: python3 tools/noor-facade-prep.py <source.jpg> <out_dir>
Writes SIRAJ_Noor_Facade_Clean_v1.0.jpg (full frame, cleaned) and
SIRAJ_Noor_Facade_Cutout_v1.0.png (RGBA, building only, base cut at the kerb line).
"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
assert im.size == (1122, 1402), 'expects the official 1122×1402 render'
a = np.asarray(im).astype(np.float32)
o = a.copy()

def patch(x0, y0, x1, y1, dx, feather=3):
    """Copy the rect shifted horizontally by dx into place, with feathered edges."""
    srcr = a[y0:y1, x0 + dx:x1 + dx]
    h, w = srcr.shape[:2]
    m = np.ones((h, w), np.float32)
    for i in range(feather):
        v = (i + 1) / (feather + 1)
        m[i, :] = np.minimum(m[i, :], v); m[-1 - i, :] = np.minimum(m[-1 - i, :], v)
        m[:, i] = np.minimum(m[:, i], v); m[:, -1 - i] = np.minimum(m[:, -1 - i], v)
    o[y0:y1, x0:x1] = o[y0:y1, x0:x1] * (1 - m[..., None]) + srcr * m[..., None]

# 1 · placeholder signage → clean fascia (clean slats live between x 575 and 780)
FY0, FY1 = 974, 1020
o[FY0:FY1, 196:400] = a[FY0:FY1, 576:780]
o[FY0:FY1, 400:572] = a[FY0:FY1, 590:762]
# fourth sign: copy from the left of it
o[FY0:FY1, 780:892] = a[FY0:FY1, 600:712]
# soften the seam of the signage glow on the slab above / glazing frame below
for y in (FY0, FY1 - 1):
    o[y] = (o[y - 1] + o[y + 1]) / 2 if 0 < y < 1401 else o[y]

# 2 · people (street figure in dishdasha + two reflections in the glazing)
patch(524, 1084, 563, 1163, -47)   # figure in front of glazing → pane to its left
patch(436, 1096, 472, 1152, 48)    # reflected figure
patch(890, 1088, 932, 1162, -48)   # reflected figure with bags
o[1116:1163, 157:206] = a[1070:1117, 157:206]   # parked car in front of the corner pier → pier slats from above
o[1156:1163, 524:566] = a[1156:1163, 464:506]   # feet of the removed figure on the kerb line

clean = Image.fromarray(np.clip(o, 0, 255).astype(np.uint8))
os.makedirs(out, exist_ok=True)
clean.save(os.path.join(out, 'SIRAJ_Noor_Facade_Clean_v1.0.jpg'), quality=95)

# 3 · cut-out
H, W = 1402, 1122
L = np.median(o[:, 15:125], axis=1)                   # per-row sky, left margin (sky to ~940)
R = np.median(o[:, 1005:1115], axis=1)                # per-row sky, right margin (sky to ~970)
t = np.clip((np.arange(W) - 70) / (1060 - 70), 0, 1)
sky = L[:, None, :] + (R - L)[:, None, :] * t[None, :, None]
d = np.sqrt(((o - sky) ** 2).sum(-1))
alpha = np.clip((d - 18) / 24, 0, 1)
alpha[:, :148] = 0; alpha[:, 997:] = 0; alpha[:72] = 0
core = np.zeros((H, W), bool)
core[76:976, 150:516] = True     # white block
core[158:976, 516:962] = True    # rose-copper block (glass reflects sky: never key it)
core[778:976, 516:994] = True    # white lower box
core[940:976, 150:994] = True    # slab
alpha[core] = 1
alpha[976:] = 0
alpha[976:1163, 157:967] = 1     # ground floor (retail), cut at the kerb line
# keep only what is connected to the building
lab, n = ndimage.label(alpha > 0.35)
keep = lab == lab[500, 300]
keep = ndimage.binary_dilation(keep, iterations=2)
alpha = alpha * keep
A = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
rgba = clean.copy(); rgba.putalpha(A)
rgba = rgba.crop((140, 60, 1004, 1164))
rgba.save(os.path.join(out, 'SIRAJ_Noor_Facade_Cutout_v1.0.png'))
print('ok', rgba.size)
