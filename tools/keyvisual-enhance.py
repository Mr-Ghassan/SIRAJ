#!/usr/bin/env python3
"""Crisp, rich finishing for key visuals (the opposite of a faded look).

Black point to true shadow, gentle S-curve, +vibrance, light unsharp mask, and
maroon kept on brand (no hue shift). Usage: python3 tools/keyvisual-enhance.py in out [strength]
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
k = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
im = Image.open(src).convert('RGB')
a = np.asarray(im).astype(np.float32) / 255

# 1 · levels: set black/white points from the 0.4 / 99.7 percentiles (removes haze)
lo = np.percentile(a, 0.4, axis=(0, 1)).mean() * k
hi = 1 - (1 - np.percentile(a, 99.7, axis=(0, 1)).mean()) * k
a = np.clip((a - lo) / max(hi - lo, 1e-3), 0, 1)
# 2 · S-curve (contrast) around mid-grey
s = 0.22 * k
a = np.clip(0.5 + (a - 0.5) * (1 + s) - s * 4 * (a - 0.5) ** 3, 0, 1)
# 3 · vibrance: boost low-saturation pixels more than saturated ones
mx, mn = a.max(-1, keepdims=True), a.min(-1, keepdims=True)
sat = mx - mn
lum = (a * [0.2126, 0.7152, 0.0722]).sum(-1, keepdims=True)
boost = 1 + 0.28 * k * (1 - sat)
a = np.clip(lum + (a - lum) * boost, 0, 1)

out = Image.fromarray((a * 255 + 0.5).astype(np.uint8))
out = out.filter(ImageFilter.UnsharpMask(radius=1.6, percent=int(55 * k), threshold=2))
out.save(dst, quality=94)
print('enhanced', dst)
