// Convert text into outlined SVG path data using HarfBuzz shaping (correct Arabic joining + kerning).
const fs = require('fs');
const path = require('path');
const FONTS = path.resolve(__dirname, '..', '..', '03-Typography', 'fonts');

const FILES = {
  'jost-200': 'Jost/Jost-ExtraLight.ttf', 'jost-300': 'Jost/Jost-Light.ttf', 'jost-400': 'Jost/Jost-Regular.ttf',
  'jost-500': 'Jost/Jost-Medium.ttf', 'jost-600': 'Jost/Jost-SemiBold.ttf', 'jost-700': 'Jost/Jost-Bold.ttf',
  'kufi-200': 'NotoKufiArabic/NotoKufiArabic-ExtraLight.ttf', 'kufi-300': 'NotoKufiArabic/NotoKufiArabic-Light.ttf',
  'kufi-400': 'NotoKufiArabic/NotoKufiArabic-Regular.ttf', 'kufi-500': 'NotoKufiArabic/NotoKufiArabic-Medium.ttf',
  'kufi-600': 'NotoKufiArabic/NotoKufiArabic-SemiBold.ttf', 'kufi-700': 'NotoKufiArabic/NotoKufiArabic-Bold.ttf',
};

let hbP = null;
const cache = {};
async function load(key) {
  if (!hbP) hbP = require('harfbuzzjs');
  const hb = await hbP;
  if (!cache[key]) {
    const data = fs.readFileSync(path.join(FONTS, FILES[key]));
    const blob = hb.createBlob(data);
    const face = hb.createFace(blob, 0);
    const font = hb.createFont(face);
    cache[key] = { hb, face, font, upem: face.upem };
  }
  return cache[key];
}

// Returns { d, width, ascender, descender } in px for the given font size. Baseline at y = 0.
async function textPath(text, { font = 'jost-400', size = 16, tracking = 0, features = 'kern,liga' } = {}) {
  const { hb, font: f, upem } = await load(font);
  const buf = hb.createBuffer();
  buf.addText(text);
  buf.guessSegmentProperties();
  hb.shape(f, buf, features);
  const glyphs = buf.json();
  buf.destroy();
  const s = size / upem;
  const track = tracking * size; // tracking in em
  let x = 0;
  const parts = [];
  glyphs.forEach((g, i) => {
    const raw = f.glyphToPath(g.g);
    if (raw) {
      const ox = x + g.dx * s;
      const oy = -g.dy * s;
      const d = raw.replace(/([MLCQ])([^MLCQZ]*)/g, (m, cmd, args) => {
        const n = args.split(/[ ,]+/).filter(Boolean).map(Number);
        const out = [];
        for (let k = 0; k < n.length; k += 2) out.push((ox + n[k] * s).toFixed(2) + ',' + (oy - n[k + 1] * s).toFixed(2));
        return cmd + out.join(' ');
      });
      parts.push(d);
    }
    x += g.ax * s + (i < glyphs.length - 1 ? track : 0);
  });
  return { d: parts.join(''), width: x, size };
}

module.exports = { textPath, FILES, FONTS };
