#!/usr/bin/env python3
"""SIRAJ Warmth Match v1.0 — bring one image back into the canonical Silk & Light grade (decision D6, 2026-10-15).

  python3 -I tools/siraj-warmth-match.py <in.jpg> [<out.jpg>] [--strength 1.0]     (out defaults to in, in place)
  python3 -I tools/siraj-warmth-match.py --measure <img> …                           (prints the warmth metrics)

Applied after tools/siraj-luxe-grade.py, colour only (CIE Lab), never geometry:
  - the environment (everything outside the protected maroon / rose band: sky, mountains, city, stone) loses its
    beige-yellow cast: positive b* is pulled toward neutral and a touch toward rose, so dusk reads ivory-rose, not gold;
  - saturated yellow / amber lights (hue 40–110°) are compressed hardest;
  - the silk and the rose interior light (hue −35…38°, chroma > 12) keep their colour (soft-edged mask, no banding);
  - lightness is untouched, so contrast, highlights and composition stay exactly as approved.

Metrics (--measure), computed at 480 px on the long side:
  warm_env  % of pixels outside the rose band with b* > 2 (beige/yellow environment)
  yellow    % of pixels with hue 45–110°, chroma > 5 (yellow / amber light)
  env_b     mean b* outside the rose band (lower = cooler)
"""
import importlib.util
import os
import sys

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location('luxe', os.path.join(HERE, 'siraj-luxe-grade.py'))
_luxe = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_luxe)
rgb2lab, lab2rgb = _luxe.rgb2lab, _luxe.lab2rgb


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def rose_weight(lab):
    """1 inside the protected maroon / rose band, 0 outside, soft edges."""
    a, b = lab[..., 1], lab[..., 2]
    C = np.hypot(a, b)
    h = np.degrees(np.arctan2(b, a))
    in_hue = smoothstep(-45, -35, h) * (1 - smoothstep(32, 44, h))
    return in_hue * smoothstep(8, 16, C)


def match(rgb, strength=1.0):
    lab = rgb2lab(rgb)
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C = np.hypot(a, b)
    h = np.degrees(np.arctan2(b, a))
    keep = rose_weight(lab)
    env = (1 - keep) * smoothstep(4, 14, L)                     # leave the deepest blacks alone
    yellow = smoothstep(36, 46, h) * (1 - smoothstep(105, 118, h)) * smoothstep(4, 10, C)
    pull = env * (0.55 + 0.35 * yellow) * strength                 # 55 % of the warm cast, 90 % on amber lights
    db = np.clip(b, 0, None) * pull
    lab = np.stack([L, a + 0.30 * db, b - db], -1)                 # ivory-rose, not grey
    return np.clip(lab2rgb(lab), 0, 1)


def measure(path):
    im = Image.open(path).convert('RGB')
    im.thumbnail((480, 480))
    lab = rgb2lab(np.asarray(im) / 255.0)
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C = np.hypot(a, b)
    h = np.degrees(np.arctan2(b, a))
    rose = (C > 12) & (h > -35) & (h < 38)
    env = ~rose & (L > 20)
    yl = (h > 45) & (h < 110) & (C > 5) & (L > 20)
    return {'warm_env': round(float((env & (b > 2)).mean() * 100), 1), 'yellow': round(float(yl.mean() * 100), 2),
            'env_b': round(float(b[env].mean()), 1)}


def main(argv):
    if argv and argv[0] == '--measure':
        for p in argv[1:]:
            print(os.path.basename(p), measure(p))
        return
    strength = 1.0
    if '--strength' in argv:
        i = argv.index('--strength')
        strength = float(argv[i + 1])
        argv = argv[:i] + argv[i + 2:]
    src = argv[0]
    dst = argv[1] if len(argv) > 1 else src
    img = Image.open(src)
    rgb = np.asarray(img.convert('RGB')) / 255.0
    out = Image.fromarray((match(rgb, strength) * 255 + 0.5).astype(np.uint8))
    kw = {'quality': 93, 'optimize': True, 'subsampling': 0} if dst.lower().endswith(('.jpg', '.jpeg')) else {}
    out.save(dst, **kw)
    print('warmth-matched', dst, measure(dst))


if __name__ == '__main__':
    main(sys.argv[1:])
