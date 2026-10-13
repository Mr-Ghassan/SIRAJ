#!/usr/bin/env python3
"""Cut out the «مشروع سراج» silk-ribbon lettering from its chroma-green master (client rule 2026-10-13: the lettering
must show real layers of silk ribbon, not a bevel). Pure numpy key + despill, then the SIRAJ maroon grade.

  python3 tools/project-lettering-ribbon-key.py [master.png]
Writes 01-Logos/Project/SIRAJ_Project-Siraj_Lettering_Ribbon_v1.0.png (4096 px wide, transparent, trimmed)
       and _2048px.png / .webp derivatives.
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '01-Logos/Project/Source/SIRAJ_Project-Siraj_Lettering_Ribbon_Green_Master_v1.0.png')
OUT = os.path.join(ROOT, '01-Logos/Project/SIRAJ_Project-Siraj_Lettering_Ribbon_v1.0')
im = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32) / 255
r, g, b = im[..., 0], im[..., 1], im[..., 2]
# greenness: how much green exceeds the larger of red/blue (satin is red-dominant, the screen is green)
gx = g - np.maximum(r, b)
alpha = np.clip(1 - (gx - 0.04) / 0.22, 0, 1)
a_img = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
alpha = np.asarray(a_img).astype(np.float32) / 255
# despill: clamp green to the red/blue average where it leaks into the satin
g2 = np.minimum(g, (r + b) / 2 + 0.02)
rgb = np.stack([r, g2, b], -1)
# SIRAJ maroon grade: a touch less saturation and a deeper midtone (pink → wine), no yellow
lum = (0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2])[..., None]
rgb = lum + (rgb - lum) * 0.82
rgb = np.clip(rgb, 0, 1) ** 1.12
# residual cast shadows (soft, low-alpha, dark) are tinted SIRAJ Deep so they never read grey-green on ivory
sh = ((alpha < 0.85) & (lum[..., 0] < 0.45))[..., None]
rgb = np.where(sh, np.array([0.17, 0.06, 0.07]), rgb)
alpha = np.where(sh[..., 0], alpha * 0.7, alpha)
rgba = np.dstack([rgb, alpha])
out = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), 'RGBA')
bbox = out.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
pad = int(0.03 * (bbox[3] - bbox[1]))
out = out.crop((max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(out.width, bbox[2] + pad), min(out.height, bbox[3] + pad)))
W = 4096; out = out.resize((W, round(out.height * W / out.width)), Image.LANCZOS)
out.save(OUT + '.png', optimize=True)
out.resize((2048, round(out.height * 2048 / out.width)), Image.LANCZOS).save(OUT + '_2048px.png', optimize=True)
out.resize((2048, round(out.height * 2048 / out.width)), Image.LANCZOS).save(OUT + '.webp', quality=90, method=6)
print('ribbon lettering', out.size, 'aspect', round(out.width / out.height, 4))

# ---- Ivory colourway for dark grounds: same folds and layers, remapped to an ivory-sand satin ------------------
src = np.asarray(Image.open(OUT + '.png').convert('RGBA')).astype(np.float32) / 255
L = 0.2126 * src[..., 0] + 0.7152 * src[..., 1] + 0.0722 * src[..., 2]
m = src[..., 3] > 0.5
lo, hi = np.percentile(L[m], 2), np.percentile(L[m], 99.5)
t = np.clip((L - lo) / (hi - lo), 0, 1) ** 0.85
stops = np.array([[0.0, 0x4A, 0x37, 0x33], [0.35, 0x9C, 0x85, 0x77], [0.7, 0xD6, 0xC0, 0xB2], [1.0, 0xFF, 0xF8, 0xF4]], dtype=np.float32)
col = np.zeros(src.shape[:2] + (3,), np.float32)
for ch in range(3):
    col[..., ch] = np.interp(t, stops[:, 0], stops[:, ch + 1]) / 255
iv = np.dstack([col, src[..., 3]])
ivo = Image.fromarray((iv * 255 + 0.5).astype(np.uint8), 'RGBA')
ivo.save(OUT.replace('_Ribbon_', '_Ribbon-Ivory_') + '.png', optimize=True)
ivo.resize((2048, round(ivo.height * 2048 / ivo.width)), Image.LANCZOS).save(OUT.replace('_Ribbon_', '_Ribbon-Ivory_') + '_2048px.png', optimize=True)
print('ribbon ivory colourway written')
