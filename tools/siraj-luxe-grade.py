#!/usr/bin/env python3
"""SIRAJ Luxe Grade v1.0 — less yellow light, a quieter and more luxurious finish (client rule 2026-10-13).

  python3 tools/siraj-luxe-grade.py <in.jpg> [<out.jpg>] [--strength 1.0]     (out defaults to in, in place)

What it does (CIE Lab, pure numpy):
  1. Yellow/amber out of the light: b* (yellow) above neutral is pulled down, most in the midtones-to-highlights
     where lamps, windows and sun sit, and shifted a touch toward rose (a*) so warm light reads ivory-rose, not gold.
     Saturated yellows (sodium/LED amber) are compressed hardest.
  2. Luxury contrast: deeper, cleaner blacks (soft toe), gentle highlight roll-off (no clipping), a hair less chroma
     in the brightest areas so glass and stone read as light, not colour.
  3. Maroon is protected: pixels already in the SIRAJ maroon/rose hue band keep their colour.
The architecture is never altered; this is colour only.
"""
import sys
import numpy as np
from PIL import Image

# ---- sRGB <-> Lab (D65) -------------------------------------------------------------------------------
M = np.array([[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]])
MI = np.linalg.inv(M)
WP = np.array([0.95047, 1.0, 1.08883])


def to_lin(c): return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def to_srgb(c): return np.where(c <= 0.0031308, 12.92 * c, 1.055 * np.power(np.clip(c, 0, None), 1 / 2.4) - 0.055)


def f(t): return np.where(t > (6 / 29) ** 3, np.cbrt(t), t / (3 * (6 / 29) ** 2) + 4 / 29)
def fi(t): return np.where(t > 6 / 29, t ** 3, 3 * (6 / 29) ** 2 * (t - 4 / 29))


def rgb2lab(rgb):
    xyz = to_lin(rgb) @ M.T / WP
    fx, fy, fz = f(xyz[..., 0]), f(xyz[..., 1]), f(xyz[..., 2])
    return np.stack([116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)], -1)


def lab2rgb(lab):
    fy = (lab[..., 0] + 16) / 116
    fx, fz = fy + lab[..., 1] / 500, fy - lab[..., 2] / 200
    xyz = np.stack([fi(fx), fi(fy), fi(fz)], -1) * WP
    return np.clip(to_srgb(np.clip(xyz @ MI.T, 0, 1)), 0, 1)


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def grade(rgb, strength=1.0):
    lab = rgb2lab(rgb)
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    hue = np.degrees(np.arctan2(b, a)) % 360            # 0 = red/magenta, 90 = yellow
    chroma = np.hypot(a, b)
    # maroon / rose band (hue ≈ 350–28°; SIRAJ maroon ≈ 14°) is protected; orange-amber-yellow (≈ 30–120°) is the target
    yellow = smooth(28, 48, hue) * (1 - smooth(105, 130, hue))
    lightw = smooth(25, 70, L)                           # lamps, windows, sky glow, highlights
    k = strength * yellow * (0.35 + 0.65 * lightw)
    # pull b* toward neutral, compress strong ambers harder; nudge toward rose so light stays warm, not cold
    b_new = b - k * np.clip(b, 0, None) * (0.62 + 0.28 * smooth(20, 60, chroma))
    a_new = a + k * np.clip(b, 0, None) * 0.06 - k * np.clip(a, 0, None) * 0.12
    # luxury contrast: soft toe (deeper blacks), highlight roll-off, quieter chroma at the very top
    Ln = L / 100
    toe = Ln - 0.06 * strength * Ln * (1 - Ln) * (1 - smooth(0.15, 0.55, Ln)) * 2.2
    roll = toe - 0.05 * strength * smooth(0.75, 1.0, toe) * (toe - 0.75)
    L_new = np.clip(roll, 0, 1) * 100
    top = 1 - 0.18 * strength * smooth(70, 98, L_new)
    return lab2rgb(np.stack([L_new, a_new * top, b_new * top], -1))


if __name__ == '__main__':
    args = [x for x in sys.argv[1:] if not x.startswith('--')]
    st = float(sys.argv[sys.argv.index('--strength') + 1]) if '--strength' in sys.argv else 1.0
    if '--strength' in sys.argv: args = [x for x in args if x != str(st) and x != sys.argv[sys.argv.index('--strength') + 1]]
    src = args[0]; dst = args[1] if len(args) > 1 else src
    im = Image.open(src)
    alpha = im.getchannel('A') if im.mode == 'RGBA' else None
    rgb = np.asarray(im.convert('RGB')).astype(np.float32) / 255
    out = Image.fromarray((grade(rgb, st) * 255 + 0.5).astype(np.uint8))
    if alpha is not None: out.putalpha(alpha)
    kw = {'quality': 93, 'optimize': True, 'subsampling': 0} if dst.lower().endswith(('.jpg', '.jpeg')) else {}
    if dst.lower().endswith('.webp'): kw = {'quality': 88, 'method': 6}
    out.save(dst, **kw)
    print('luxe-graded', dst)
