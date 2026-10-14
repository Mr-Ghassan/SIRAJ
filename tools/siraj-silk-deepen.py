#!/usr/bin/env python3
"""SIRAJ Silk Deepen v1.0 — keeps pressed-silk stills deep and maroon (client note 2026-10-14: the cover was washed
out by the light on the silk; the earlier cover was more beautiful).

  python3 tools/siraj-silk-deepen.py <in.jpg> [<out.jpg>] [--knee 26] [--max 62] [--chroma 30]

What it does (CIE Lab, shares the colour maths of tools/siraj-luxe-grade.py):
  1. Highlight roll-off: lightness above the knee is compressed smoothly toward a ceiling, so a sheen stays a sheen
     and never turns into a pale pink haze. Shadows and midtones are untouched.
  2. Colour back into the light: the brightest folds regain maroon chroma (SIRAJ maroon hue ≈ 14°), so the light
     reads as light travelling across maroon satin, not as a white wash.
  3. Deeper toe: the darkest folds go a touch deeper for a quiet, luxurious finish.
The folds, the weave and the composition are never altered; this is tone and colour only.
"""
import sys, importlib.util, os
import numpy as np
from PIL import Image

_spec = importlib.util.spec_from_file_location('luxe', os.path.join(os.path.dirname(__file__), 'siraj-luxe-grade.py'))
lg = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(lg)
MAROON_HUE = 14.0


def deepen(rgb, knee=26.0, ceil=62.0, chroma=30.0):
    lab = lg.rgb2lab(rgb)
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    # 1 · highlight roll-off (tanh shoulder above the knee)
    span = ceil - knee
    Ln = np.where(L > knee, knee + span * np.tanh((L - knee) / span), L)
    # 3 · deeper toe
    Ln = Ln * (0.88 + 0.12 * lg.smooth(0, 18, Ln))
    # 2 · maroon chroma back into the light, hue eased toward SIRAJ maroon
    C, h = np.hypot(a, b), np.degrees(np.arctan2(b, a))
    w = lg.smooth(knee + 4, knee + 40, L)
    Cn = C + (np.maximum(C, chroma * (0.75 + 0.25 * lg.smooth(knee, 90, L))) - C) * w
    dh = ((MAROON_HUE - h + 180) % 360) - 180
    hn = np.radians(h + dh * 0.6 * w)
    out = np.stack([Ln, Cn * np.cos(hn), Cn * np.sin(hn)], -1)
    return lg.lab2rgb(out)


def main():
    knee = float(sys.argv[sys.argv.index('--knee') + 1]) if '--knee' in sys.argv else 26.0
    ceil = float(sys.argv[sys.argv.index('--max') + 1]) if '--max' in sys.argv else 62.0
    chroma = float(sys.argv[sys.argv.index('--chroma') + 1]) if '--chroma' in sys.argv else 30.0
    vals = {sys.argv[i + 1] for i, x in enumerate(sys.argv[:-1]) if x.startswith('--')}
    files = [x for x in sys.argv[1:] if not x.startswith('--') and x not in vals]
    src = files[0]; dst = files[1] if len(files) > 1 else src
    im = Image.open(src)
    alpha = im.getchannel('A') if im.mode in ('RGBA', 'LA') else None
    rgb = np.asarray(im.convert('RGB')).astype(np.float64) / 255.0
    out = Image.fromarray((deepen(rgb, knee, ceil, chroma) * 255 + 0.5).astype(np.uint8))
    if alpha is not None: out.putalpha(alpha)
    kw = {'quality': 95, 'subsampling': 0} if dst.lower().endswith(('.jpg', '.jpeg')) else {}
    if dst.lower().endswith('.webp'): kw = {'quality': 90}
    out.save(dst, **kw)
    print('deepened', dst)


if __name__ == '__main__':
    main()
