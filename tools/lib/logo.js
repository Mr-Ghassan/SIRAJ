// SIRAJ official wordmark — exact geometry from the supplied master (SIRAJ_Logo_Source_01).
// Paths are untouched; only translated so the artwork's bounding box starts at 0,0.
const P = require('./logo-paths.json');

const BOX = { x: 21.787, y: 56.81, w: 98.163, h: 28.11 }; // measured bbox in source units
const RATIO = BOX.w / BOX.h; // ≈ 3.492

const COLORS = {
  primary:  { letter: '#602733', lumen: '#AA9180', label: 'Primary — Maroon', bg: '#F7F2ED' },
  deep:     { letter: '#2C0F12', lumen: '#AA9180', label: 'Deep', bg: '#D6C0B2' },
  sand:     { letter: '#D6C0B2', lumen: '#AA9180', label: 'Reversed — Sand', bg: '#602733' },
  white:    { letter: '#FFFFFF', lumen: '#D6C0B2', label: 'Reversed — White (photography)', bg: '#3B3436' },
  'mono-maroon': { letter: '#602733', lumen: '#602733', label: 'Mono Maroon', bg: '#F7F2ED' },
  'mono-deep':   { letter: '#2C0F12', lumen: '#2C0F12', label: 'Mono Deep', bg: '#EFE7E0' },
  'mono-black':  { letter: '#020202', lumen: '#020202', label: 'Mono Black', bg: '#FFFFFF' },
  'mono-white':  { letter: '#FFFFFF', lumen: '#FFFFFF', label: 'Mono White', bg: '#2C0F12' },
  'mono-sand':   { letter: '#D6C0B2', lumen: '#D6C0B2', label: 'Mono Sand', bg: '#2C0F12' },
};

// Index groups inside logo-paths.json
const GLYPHS = { S: [6, 7, 8], I: [2, 3], R: [4, 5], A: [0, 1], J: [9, 10] };

function paths({ letter, lumen }, only = null) {
  return P.map((p, i) => (only && !only.includes(i) ? '' : `<path d="${p.d}" fill="${p.role === 'lumen' ? lumen : letter}"/>`)).join('');
}

// Group positioned at (x, y) with given height in the parent's units.
function group({ x = 0, y = 0, height = BOX.h, letter = '#602733', lumen = '#AA9180', id = '' } = {}) {
  const s = height / BOX.h;
  return `<g${id ? ` id="${id}"` : ''} transform="translate(${x} ${y}) scale(${+s.toFixed(6)}) translate(${-BOX.x} ${-BOX.y})">${paths({ letter, lumen })}</g>`;
}

// Standalone SVG. pad is expressed in multiples of the wordmark height H.
function svg({ variant = 'primary', pad = 0, bg = null, letter, lumen, title = 'SIRAJ' } = {}) {
  const c = { ...COLORS[variant] };
  if (letter) c.letter = letter;
  if (lumen) c.lumen = lumen;
  const p = pad * BOX.h;
  const W = +(BOX.w + 2 * p).toFixed(3);
  const H = +(BOX.h + 2 * p).toFixed(3);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${(W * 10).toFixed(1)}" height="${(H * 10).toFixed(1)}" role="img" aria-label="${title}">
<title>${title}</title>${bg ? `\n<rect width="100%" height="100%" fill="${bg}"/>` : ''}
<g transform="translate(${+(p - BOX.x).toFixed(3)} ${+(p - BOX.y).toFixed(3)})">${paths(c)}</g>
</svg>
`;
}

// Inline <svg> for HTML templates (sized by CSS height).
function inline({ variant = 'primary', letter, lumen, cls = 'siraj-logo', style = '' } = {}) {
  const c = { ...COLORS[variant] };
  if (letter) c.letter = letter;
  if (lumen) c.lumen = lumen;
  return `<svg class="${cls}" style="${style}" xmlns="http://www.w3.org/2000/svg" viewBox="${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}" role="img" aria-label="SIRAJ">${paths(c)}</svg>`;
}

module.exports = { P, BOX, RATIO, COLORS, GLYPHS, paths, group, svg, inline };
