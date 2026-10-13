#!/usr/bin/env python3
"""SIRAJ · Project lettering «مشروع سراج» v1.0 — the silk-script name of the project (client rule 2026-10-13).

The SIRAJ brand mark is the English wordmark; «سراج» is never typeset in Tajawal as a name. When the project is
meant, it is written «مشروع سراج» in this calligraphic lettering (client choice: Ruqaa ink script, refined).

Typeface: Aref Ruqaa Ink (SIL OFL 1.1, 03-Typography/fonts/Lettering). The text is shaped with HarfBuzz and the
glyph outlines are written as SVG paths, so the spelling is always exact and the files are pure vectors.
Finish ("silk"): a multi-band satin sheen along the 51° SIRAJ silk axis, a soft inner highlight that reads as a
satin bevel, and a very soft shadow. Dark variants shine ivory-rose (never gold or yellow).

  python3 tools/build-project-lettering.py

Writes 01-Logos/Project/SIRAJ_Project-Siraj_Lettering_<Variant>_v1.0.svg (+ _2048px.png via Chromium):
  Silk-Dark   satin sheen sand → ivory → sand, for Deep / Shadow / Maroon / photographs
  Silk-Light  satin sheen deep → maroon → rose → maroon, for Ivory / Linen / white
  Sand · Ivory · Maroon · Deep   solid single-colour versions
"""
import os, subprocess, json
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(ROOT, '03-Typography/fonts/Lettering/ArefRuqaaInk-Regular.ttf')
OUT = os.path.join(ROOT, '01-Logos/Project')
TEXT = 'مشروع سراج'
WGHT = 500

blob = hb.Blob.from_file_path(FONT)
face = hb.Face(blob)
font = hb.Font(face)
buf = hb.Buffer()
buf.add_str(TEXT)
buf.guess_segment_properties()
hb.shape(font, buf, {'kern': True, 'liga': True})

tt = TTFont(FONT)
gs = tt.getGlyphSet()
order = tt.getGlyphOrder()

paths, x = [], 0
bp = BoundsPen(gs)
for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
    name = order[info.codepoint]
    dx, dy = x + pos.x_offset, pos.y_offset
    pen = SVGPathPen(gs)
    gs[name].draw(TransformPen(pen, (1, 0, 0, -1, dx, -dy)))      # y-up font units → y-down SVG
    d = pen.getCommands()
    if d: paths.append(d)
    gs[name].draw(TransformPen(bp, (1, 0, 0, -1, dx, -dy)))
    x += pos.x_advance * (0.45 if name in ('space', 'uni0020') else 1)   # tighter word space: the two words read as one mark
x0, y0, x1, y1 = bp.bounds
pad = 0.06 * (y1 - y0)
vb = (x0 - pad, y0 - pad, (x1 - x0) + 2 * pad, (y1 - y0) + 2 * pad)
D = ' '.join(paths)

GRAD = {
    # satin: two soft sheens sliding along the stroke, deep folds between them
    'Silk-Dark': [('0', '#9C8577'), ('0.18', '#D6C0B2'), ('0.3', '#F4E9E3'), ('0.4', '#C9B2A6'), ('0.58', '#E6D3C6'), ('0.68', '#FFF8F4'), ('0.8', '#D6C0B2'), ('1', '#A8907F')],
    'Silk-Light': [('0', '#2C0F12'), ('0.2', '#602733'), ('0.32', '#A35A68'), ('0.42', '#5A2230'), ('0.6', '#722F3D'), ('0.7', '#C79A9C'), ('0.8', '#602733'), ('1', '#3A141A')],
}
SOLID = {'Sand': '#D6C0B2', 'Ivory': '#F7F2ED', 'Maroon': '#602733', 'Deep': '#2C0F12'}
os.makedirs(OUT, exist_ok=True)
made = []
for name in list(GRAD) + list(SOLID):
    if name in GRAD:
        stops = ''.join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in GRAD[name])
        # the sheen runs along the 51° SIRAJ silk axis, like light sliding along a satin ribbon
        dark = name == 'Silk-Dark'
        hi = '#FFFFFF' if dark else '#E9C9C6'
        sh = '#000000' if dark else '#2C0F12'
        u = vb[3]
        defs = (f'<defs><linearGradient id="silk" gradientUnits="userSpaceOnUse" x1="{vb[0]}" y1="{vb[1] + vb[3]}" x2="{vb[0] + vb[2]}" y2="{vb[1]}">{stops}</linearGradient>'
                f'<linearGradient id="bevel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{hi}" stop-opacity="{0.55 if dark else 0.45}"/><stop offset="0.45" stop-color="{hi}" stop-opacity="0"/></linearGradient>'
                f'<clipPath id="glyphs"><path d="{D}"/></clipPath>'
                f'<filter id="soft" x="-5%" y="-10%" width="110%" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="{u * 0.012:.1f}"/><feOffset dy="{u * 0.012:.1f}"/><feComponentTransfer><feFuncA type="linear" slope="{0.35 if dark else 0.18}"/></feComponentTransfer><feFlood flood-color="{sh}"/><feComposite operator="in" in2="SourceAlpha"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>')
        body = (f'<g filter="url(#soft)"><path fill="url(#silk)" d="{D}"/></g>'
                f'<g clip-path="url(#glyphs)"><path fill="url(#bevel)" d="{D}" transform="translate(0 {u * 0.018:.1f})" opacity=".9" style="mix-blend-mode:screen"/></g>')
    else:
        defs, body = '', f'<path fill="{SOLID[name]}" d="{D}"/>'
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]:.1f} {vb[1]:.1f} {vb[2]:.1f} {vb[3]:.1f}" '
           f'width="{vb[2]:.0f}" height="{vb[3]:.0f}" role="img" aria-label="مشروع سراج">'
           f'<title>مشروع سراج · SIRAJ project lettering v1.0</title>{defs}{body}</svg>\n')
    f = os.path.join(OUT, f'SIRAJ_Project-Siraj_Lettering_{name}_v1.0.svg')
    open(f, 'w').write(svg)
    made.append(f)

# PNG renders (2048 px wide, transparent) through Chromium for exact SVG rasterisation
js = """
const R=require(process.argv[1]);const files=JSON.parse(process.argv[2]);const asp=+process.argv[3];
(async()=>{const b=await R.browser();for(const f of files){const h=Math.ceil(2048/asp);const p=await b.newPage({viewport:{width:2048,height:h}});
const fs=require('fs');const t=f.replace('.svg','.tmp.html');fs.writeFileSync(t,`<html><body style="margin:0;background:transparent"><img src="${require('path').basename(f)}" style="width:2048px;height:${h}px;display:block"></body></html>`);
await p.goto('file://'+t,{waitUntil:'load'});fs.unlinkSync(t);
await p.screenshot({path:f.replace('.svg','_2048px.png'),omitBackground:true,clip:{x:0,y:0,width:2048,height:h}});await p.close();}await R.close();})();
"""
subprocess.run(['node', '-e', js, os.path.join(ROOT, 'tools/lib/render.js'), json.dumps(made), str(vb[2] / vb[3])], check=True, cwd=ROOT)
meta = {'text': TEXT, 'font': 'Aref Ruqaa Ink (SIL OFL 1.1)', 'viewBox': [round(v, 1) for v in vb],
        'aspect': round(vb[2] / vb[3], 4), 'variants': [os.path.basename(m) for m in made]}
json.dump(meta, open(os.path.join(OUT, 'SIRAJ_Project-Siraj_Lettering.json'), 'w'), ensure_ascii=False, indent=2)
print('lettering:', len(made), 'variants · aspect', meta['aspect'])
