#!/usr/bin/env python3
"""SIRAJ Silk Grade v1.0 — the official photographic colour grade.

One function defines the grade; it is exported as a 33-point .cube LUT (for Lightroom/Photoshop/Resolve/Premiere)
and applied to library images here, so the LUT and the delivered images are identical.

  python3 tools/siraj-grade.py lut                      -> 08-Photography/Grade/SIRAJ_Silk-Grade_v1.0.cube
  python3 tools/siraj-grade.py apply in.png out.jpg     -> graded image
"""
import sys, pathlib
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent

def rgb_to_hsv(c):
    r, g, b = c[..., 0], c[..., 1], c[..., 2]
    mx, mn = c.max(-1), c.min(-1)
    d = mx - mn + 1e-8
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) / 6.0
    s = np.where(mx > 1e-8, (mx - mn) / (mx + 1e-8), 0)
    return np.stack([h % 1.0, s, mx], -1)

def hsv_to_rgb(hsv):
    h, s, v = hsv[..., 0] * 6, hsv[..., 1], hsv[..., 2]
    i = np.floor(h).astype(int) % 6
    f = h - np.floor(h)
    p, q, t = v * (1 - s), v * (1 - s * f), v * (1 - s * (1 - f))
    out = np.zeros(hsv.shape)
    for k, (a, b_, c_) in enumerate([(v, t, p), (q, v, p), (p, v, t), (p, q, v), (t, p, v), (v, p, q)]):
        m = i == k
        out[..., 0][m], out[..., 1][m], out[..., 2][m] = a[m], b_[m], c_[m]
    return out

def smooth(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

def grade(c):
    """c: float array (...,3) in 0..1 sRGB. Returns graded sRGB."""
    hsv = rgb_to_hsv(c)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    # 1. Reds → SIRAJ maroon/wine (hue 348°): pull hue, temper saturation and brightness of saturated reds.
    hd = ((h - 0.0) + 0.5) % 1.0 - 0.5                     # signed distance from pure red
    red_w = (1 - smooth(0.035, 0.09, np.abs(hd))) * smooth(0.25, 0.55, s)
    target = -0.034                                         # 348° expressed as signed offset from 0°
    h = (h + (target - hd) * 0.75 * red_w) % 1.0
    s = s * (1 - 0.18 * red_w)
    v = v * (1 - 0.10 * red_w * smooth(0.3, 0.9, v))
    # 2. Calm skies: desaturate blues/cyans by 25 %.
    blue_w = 1 - smooth(0.06, 0.12, np.abs(((h - 0.58) + 0.5) % 1.0 - 0.5))
    s = s * (1 - 0.25 * blue_w)
    # 3. Global restraint: −6 % saturation (no over-saturated HDR look).
    s = s * 0.94
    out = hsv_to_rgb(np.stack([h, s, v], -1))
    # 4. Tone: soft S-curve, gentle highlight roll-off.
    out = np.clip(out, 0, 1)
    out = out * 0.84 + (out * out * (3 - 2 * out)) * 0.16
    # 5. Split tone: shadows toward SIRAJ Shadow (#170608), highlights toward warm ivory.
    lum = (0.2126 * out[..., 0] + 0.7152 * out[..., 1] + 0.0722 * out[..., 2])[..., None]
    sh = (1 - smooth(0.0, 0.35, lum))
    hi = smooth(0.6, 1.0, lum)
    out = out + sh * 0.035 * (np.array([0x17, 0x06, 0x08]) / 255 * 4 - out * 0.15)
    out = out + hi * 0.04 * (np.array([0xF7, 0xF2, 0xED]) / 255 - out)
    # 6. Black floor (never crushed to pure #000): lift to SIRAJ Shadow.
    floor = np.array([0x0A, 0x04, 0x05]) / 255
    out = floor + out * (1 - floor)
    return np.clip(out, 0, 1)

def write_lut(path, n=33):
    g = np.linspace(0, 1, n)
    b, gg, r = np.meshgrid(g, g, g, indexing='ij')         # .cube order: R fastest
    rgb = np.stack([r, gg, b], -1).reshape(-1, 3)
    out = grade(rgb)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w') as f:
        f.write('TITLE "SIRAJ Silk Grade v1.0"\n# SIRAJ Real Estate Development — official photographic grade. sRGB in / sRGB out.\n')
        f.write(f'LUT_3D_SIZE {n}\nDOMAIN_MIN 0 0 0\nDOMAIN_MAX 1 1 1\n')
        for row in out:
            f.write(f'{row[0]:.6f} {row[1]:.6f} {row[2]:.6f}\n')

def apply(src, dst, max_side=None, quality=90):
    im = Image.open(src).convert('RGB')
    if max_side and max(im.size) > max_side:
        im.thumbnail((max_side, max_side), Image.LANCZOS)
    a = np.asarray(im).astype(np.float64) / 255
    out = (grade(a) * 255 + 0.5).astype(np.uint8)
    pathlib.Path(dst).parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(out).save(dst, quality=quality, subsampling=0) if str(dst).endswith('.jpg') else Image.fromarray(out).save(dst)

if __name__ == '__main__':
    if sys.argv[1] == 'lut':
        write_lut(ROOT / '08-Photography/Grade/SIRAJ_Silk-Grade_v1.0.cube')
        print('lut written')
    elif sys.argv[1] == 'apply':
        apply(sys.argv[2], sys.argv[3])
