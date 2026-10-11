#!/usr/bin/env python3
"""Import a photographic SIRAJ Silk formation (real silk fabric) into 06-SIRAJ-Silk/Stills.

Since 2026-10-11 every silk background is a photograph of real silk, not a CG render.
The CG engine renders are kept in 99-Archive/Silk-CG-v1.0/.

  python3 tools/silk-photo-import.py <Formation> <landscape.png> <portrait.png> [grade 0-1]

Writes, for the formation, the same files every template already references:
  SIRAJ_Silk_<F>_{16x9,9x16,1x1,4x5}_v1.0.jpg   (3840x2160, 2160x3840, 2160x2160, 2160x2700)
  SIRAJ_Silk_<F>_{…}_web_v1.0.webp             (1920 / 1080 px long edge)
The SIRAJ Silk Grade is blended in at <grade> (default 0.5). It keeps the wine-maroon on palette
and lifts the floor to SIRAJ Shadow without flattening the silk's sheen.
"""
import os, sys, shutil, importlib.util
from PIL import Image, ImageFilter
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F, land, port = sys.argv[1], sys.argv[2], sys.argv[3]
G = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
OUT = os.path.join(ROOT, '06-SIRAJ-Silk', 'Stills', F)
ARCH = os.path.join(ROOT, '99-Archive', 'Silk-CG-v1.0', F)

spec = importlib.util.spec_from_file_location('grade', os.path.join(ROOT, 'tools', 'siraj-grade.py'))
gr = importlib.util.module_from_spec(spec)
sys.argv = [sys.argv[0]]  # siraj-grade parses argv only under __main__
spec.loader.exec_module(gr)


def graded(path):
    im = Image.open(path).convert('RGB')
    a = np.asarray(im).astype(np.float32) / 255
    g = gr.grade(a) if hasattr(gr, 'grade') else a
    out = a * (1 - G) + np.asarray(g, dtype=np.float32) * G
    return Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))


def fit(im, w, h):
    """cover-crop to w:h around the centre, then resize with Lanczos + light sharpening."""
    sw, sh = im.size
    r = w / h
    if sw / sh > r:
        cw = round(sh * r); box = ((sw - cw) // 2, 0, (sw - cw) // 2 + cw, sh)
    else:
        ch = round(sw / r); box = (0, (sh - ch) // 2, sw, (sh - ch) // 2 + ch)
    out = im.crop(box).resize((w, h), Image.LANCZOS)
    return out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=2))


os.makedirs(OUT, exist_ok=True)
if os.path.isdir(OUT) and not os.path.isdir(ARCH):
    os.makedirs(ARCH, exist_ok=True)
    for f in os.listdir(OUT):
        shutil.copy2(os.path.join(OUT, f), os.path.join(ARCH, f))

L, P = graded(land), graded(port)
for ratio, src, (w, h) in [('16x9', L, (3840, 2160)), ('1x1', L, (2160, 2160)), ('9x16', P, (2160, 3840)), ('4x5', P, (2160, 2700))]:
    im = fit(src, w, h)
    im.save(os.path.join(OUT, f'SIRAJ_Silk_{F}_{ratio}_v1.0.jpg'), quality=92, optimize=True)
    s = 1920 / max(w, h) if ratio == '16x9' else 1080 / min(w, h)
    im.resize((round(w * s), round(h * s)), Image.LANCZOS).save(os.path.join(OUT, f'SIRAJ_Silk_{F}_{ratio}_web_v1.0.webp'), quality=86)
print('imported', F)
