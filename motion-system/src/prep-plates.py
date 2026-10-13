#!/usr/bin/env python3
"""SIRAJ Motion System v1.0 — prepare motion plates from the publish-ready renders of «سراج».

Source (never edited): 14-Property-Marketing/12-Project-Siraj/Source/Clean/*.jpg (3712×4608, 4:5).
Writes motion-system/assets/plates/:
  SIRAJ_Plate_<View>-<Light>_v1.0.jpg   1920×2384 (4:5), the plates used by components and transitions
  SIRAJ_Plate_Side-Night_Cutout_v1.0.webp  the building of the side blue-hour view cut out (RGBA), used by the
                                            WRAP primitive so real silk footage can pass behind the architecture.
Usage: python3 motion-system/src/prep-plates.py
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, '14-Property-Marketing/12-Project-Siraj/Source/Clean')
OUT = os.path.join(ROOT, 'motion-system/assets/plates')
os.makedirs(OUT, exist_ok=True)
W, H = 1920, 2384
VIEWS = {'Corner': 'Corner', 'Front': 'Front', 'Side': 'Side'}
LIGHT = {'Cloudy-Day': 'Day', 'Blue-Hour': 'Night'}

for v in VIEWS:
    for l, short in LIGHT.items():
        im = Image.open(os.path.join(SRC, f'SIRAJ_Project-Siraj_{v}_{l}_Clean_v1.0.jpg')).convert('RGB')
        im = im.resize((W, H), Image.LANCZOS)
        im.save(os.path.join(OUT, f'SIRAJ_Plate_{v}-{short}_v1.0.jpg'), quality=86, optimize=True, progressive=True)
        print('plate', v, short)

# ---- cut-out of the side blue-hour view (WRAP) ---------------------------------------------------------
# The blue-hour sky and the lilac render of the white volumes are too close in colour to key, so the silhouette
# is the measured architectural polygon (straight edges), plus a keyed strip for the roof planting.
im = Image.open(os.path.join(OUT, 'SIRAJ_Plate_Side-Night_v1.0.jpg')).convert('RGB')
a = np.asarray(im).astype(np.float32)
poly = [(257, 127), (886, 127), (886, 215), (1683, 215), (1683, 1330), (1712, 1330), (1712, 1655), (1663, 1655), (1663, 1990), (257, 1990)]
m = Image.new('L', (W, H), 0)
ImageDraw.Draw(m).polygon(poly, fill=255)
alpha = (np.asarray(m) > 0).astype(np.float32)
# roof planting above the terracotta parapet: key against the sky just above it (per column)
y0, y1, x0, x1 = 135, 216, 886, 1683
sky = np.median(a[100:126, x0:x1], axis=0)                       # (cols, 3)
d = np.sqrt(((a[y0:y1, x0:x1] - sky[None]) ** 2).sum(-1))
alpha[y0:y1, x0:x1] = np.maximum(alpha[y0:y1, x0:x1], np.clip((d - 22) / 18, 0, 1))
A = Image.fromarray((np.clip(alpha, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
rgba = im.copy(); rgba.putalpha(A)
rgba.save(os.path.join(OUT, 'SIRAJ_Plate_Side-Night_Cutout_v1.0.webp'), quality=90, method=5)
print('cutout ok')
