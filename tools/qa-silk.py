#!/usr/bin/env python3
"""SIRAJ Silk QA v1.0 — measures every official silk still for the 2026-10-14 client rules.

  python3 tools/qa-silk.py            (exit code 1 on any failure)

For each maroon formation (16:9 and 9:16), in CIE Lab:
  · no washed sheen: the brightest 0.5 % stays at or below L 76 (a sheen, not a pale wash);
  · no yellow / gold cast: the hue of the brightest 3 % stays in the maroon-rose band (≤ 24°; SIRAJ maroon ≈ 14°);
  · colour in the light: the brightest 3 % keeps chroma ≥ 18 (maroon light, not a white haze).
Ivory formations (Fold-Corner-Ivory, Ribbon-Ivory, Horizon-Ivory) are light by design and only checked for hue
on their maroon fabric. Pressed-silk (no creases) is a visual check recorded in docs/qa/RELEASE_QA_v1.0.md.
"""
import importlib.util, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location('lg', os.path.join(ROOT, 'tools', 'siraj-luxe-grade.py'))
lg = importlib.util.module_from_spec(spec); spec.loader.exec_module(lg)
STILLS = os.path.join(ROOT, '06-SIRAJ-Silk', 'Stills')
IVORY = {'Fold-Corner-Ivory', 'Ribbon-Ivory', 'Horizon-Ivory'}

fails, rows = [], []
for f in sorted(d for d in os.listdir(STILLS) if os.path.isdir(os.path.join(STILLS, d)) and d != 'Alpha'):
    for r in ('16x9', '9x16'):
        p = os.path.join(STILLS, f, f'SIRAJ_Silk_{f}_{r}_v1.0.jpg')
        if not os.path.exists(p):
            fails.append(f'{f} {r}: missing'); continue
        im = Image.open(p).convert('RGB'); im.thumbnail((640, 640))
        lab = lg.rgb2lab(np.asarray(im) / 255.0)
        L, C = lab[..., 0], np.hypot(lab[..., 1], lab[..., 2])
        h = np.degrees(np.arctan2(lab[..., 2], lab[..., 1])) % 360
        if f in IVORY:
            m = (C > 15) & (L < 70)                     # the maroon fabric only
            hue = float(np.median(h[m])) if m.any() else 0.0
            ok = hue <= 24 or hue >= 340
            rows.append((f, r, '—', round(hue, 1), '—', ok))
            if not ok: fails.append(f'{f} {r}: fabric hue {hue:.1f}°')
            continue
        top = L > np.percentile(L, 97)
        l995, hue, chroma = float(np.percentile(L, 99.5)), float(np.median(h[top])), float(C[top].mean())
        ok = l995 <= 76 and (hue <= 24 or hue >= 340) and chroma >= 18
        rows.append((f, r, round(l995, 1), round(hue, 1), round(chroma, 1), ok))
        if not ok: fails.append(f'{f} {r}: L99.5 {l995:.1f}, hue {hue:.1f}°, chroma {chroma:.1f}')

for f, r, l, hue, c, ok in rows:
    print(f"{'✓' if ok else '✗'} {f:18} {r:5} L99.5 {l!s:>5}  hue {hue!s:>5}°  chroma {c!s:>5}")
print(f'silk QA: {len(rows)} stills · failures: {len(fails)}')
for x in fails: print('  ✗', x)
sys.exit(1 if fails else 0)
