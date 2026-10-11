// Build platform outputs from 09-Design-System/tokens/siraj.tokens.json
// Outputs: CSS variables, SCSS, ESM/CJS JS, TypeScript types, Tailwind preset, Swift, Kotlin, flat JSON, font-face CSS.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, '09-Design-System/tokens/siraj.tokens.json');
const OUT = path.join(ROOT, '09-Design-System/tokens/build');
fs.mkdirSync(OUT, { recursive: true });
const T = JSON.parse(fs.readFileSync(SRC, 'utf8'));

// ---- flatten -------------------------------------------------------------
const flat = {};
(function walk(node, trail) {
  if (node && typeof node === 'object' && '$value' in node) { flat[trail.join('.')] = node; return; }
  for (const k of Object.keys(node)) if (!k.startsWith('$')) walk(node[k], [...trail, k]);
})(T, []);
const resolve = (v) => (typeof v === 'string' ? v.replace(/\{([^}]+)\}/g, (_, ref) => resolve(flat[ref].$value)) : v);
const cssName = (key) => '--siraj-' + key.replace(/\./g, '-');
const bez = (a) => `cubic-bezier(${a.join(', ')})`;

function cssValue(key, t) {
  const v = resolve(t.$value);
  if (t.$type === 'cubicBezier') return bez(v);
  if (t.$type === 'fontFamily') return v.map((f) => (f.includes(' ') ? `"${f}"` : f)).join(', ');
  if (t.$type === 'typography' || t.$type === 'spring') return null;
  return String(v);
}

// ---- CSS -----------------------------------------------------------------
const head = `/* SIRAJ Design Tokens v${T.$version} — generated from siraj.tokens.json. Do not edit by hand. */\n`;
let css = head + ':root {\n';
for (const [k, t] of Object.entries(flat)) {
  if (k.startsWith('theme.')) continue;
  const v = cssValue(k, t);
  if (v !== null) css += `  ${cssName(k)}: ${v};\n`;
}
// typography composites -> individual vars
for (const [k, t] of Object.entries(flat)) {
  if (t.$type !== 'typography') continue;
  const v = t.$value; const n = cssName(k);
  css += `  ${n}-size: ${v.fontSize};\n  ${n}-size-mobile: ${t.mobile};\n  ${n}-weight: ${v.fontWeight};\n  ${n}-line: ${v.lineHeight};\n  ${n}-tracking: ${v.letterSpacing === '0' ? '0em' : v.letterSpacing};\n`;
}
// light theme semantic aliases (default)
const themeVars = (name) => Object.entries(flat).filter(([k]) => k.startsWith(`theme.${name}.`))
  .map(([k, t]) => `  --siraj-${k.split('.').pop()}: ${resolve(t.$value)};`).join('\n');
css += themeVars('light') + '\n}\n\n';
css += `[data-theme="dark"], .siraj-dark {\n${themeVars('dark')}\n  color-scheme: dark;\n}\n\n`;
css += `@media (prefers-reduced-motion: reduce) {\n  :root {\n${Object.keys(flat).filter((k) => k.startsWith('motion.duration.')).map((k) => `    ${cssName(k)}: 1ms;`).join('\n')}\n  }\n}\n`;
fs.writeFileSync(path.join(OUT, 'siraj-tokens.css'), css);

// ---- SCSS ----------------------------------------------------------------
let scss = head.replace('/*', '//').replace(' */', '') + '\n';
for (const [k, t] of Object.entries(flat)) {
  const v = cssValue(k, t);
  if (v !== null) scss += `$siraj-${k.replace(/\./g, '-')}: ${v};\n`;
}
fs.writeFileSync(path.join(OUT, '_siraj-tokens.scss'), scss);

// ---- JS / JSON -----------------------------------------------------------
const nested = {};
for (const [k, t] of Object.entries(flat)) {
  const parts = k.split('.'); let o = nested;
  parts.slice(0, -1).forEach((p) => (o = o[p] = o[p] || {}));
  let v = resolve(t.$value);
  if (t.$type === 'typography') v = { ...v, fontFamily: resolve(t.$value.fontFamily), mobileFontSize: t.mobile };
  if (t.$type === 'cubicBezier') v = { css: bez(v), points: v };
  o[parts.at(-1)] = v;
}
nested.version = T.$version;
const json = JSON.stringify(nested, null, 2);
fs.writeFileSync(path.join(OUT, 'siraj-tokens.json'), json + '\n');
fs.writeFileSync(path.join(OUT, 'siraj-tokens.flat.json'), JSON.stringify(Object.fromEntries(Object.entries(flat).map(([k, t]) => [k, resolve(t.$value)])), null, 2) + '\n');
fs.writeFileSync(path.join(OUT, 'siraj-tokens.mjs'), `${head}export const siraj = ${json};\nexport default siraj;\n`);
fs.writeFileSync(path.join(OUT, 'siraj-tokens.cjs'), `${head}module.exports = ${json};\n`);
const dts = (o, ind = '  ') => '{\n' + Object.entries(o).map(([k, v]) => `${ind}${JSON.stringify(k)}: ${typeof v === 'object' && !Array.isArray(v) ? dts(v, ind + '  ') : Array.isArray(v) ? (typeof v[0] === 'number' ? 'number[]' : 'string[]') : typeof v};`).join('\n') + `\n${ind.slice(2)}}`;
fs.writeFileSync(path.join(OUT, 'siraj-tokens.d.ts'), `${head}export declare const siraj: ${dts(nested)};\nexport default siraj;\n`);

// ---- Tailwind preset -----------------------------------------------------
const pick = (prefix) => Object.fromEntries(Object.entries(flat).filter(([k]) => k.startsWith(prefix)).map(([k, t]) => [k.slice(prefix.length), resolve(t.$value)]));
const tw = {
  theme: {
    colors: {
      transparent: 'transparent', current: 'currentColor',
      siraj: { ...pick('color.brand.'), ...Object.fromEntries(Object.entries(pick('color.silk.')).map(([k, v]) => ['silk-' + k, v])) },
      maroon: pick('color.maroon.'), neutral: pick('color.neutral.'), functional: pick('color.functional.'),
    },
    fontFamily: { latin: resolve(flat['font.family.latin'].$value), arabic: resolve(flat['font.family.arabic'].$value), brand: resolve(flat['font.family.brand'].$value) },
    spacing: pick('space.'),
    borderRadius: { none: '0px', xs: '2px', sm: '4px', silk: '96px', full: '999px' },
    screens: Object.fromEntries(Object.entries(pick('breakpoint.')).filter(([k]) => k !== 'xs')),
    extend: {
      backgroundImage: pick('gradient.'),
      boxShadow: pick('shadow.'),
      transitionTimingFunction: Object.fromEntries(Object.entries(pick('motion.easing.')).map(([k, v]) => [k, bez(v)])),
      transitionDuration: Object.fromEntries(Object.entries(pick('motion.duration.')).map(([k, v]) => [k, v])),
      zIndex: Object.fromEntries(Object.entries(pick('z.')).map(([k, v]) => [k, String(v)])),
    },
  },
};
fs.writeFileSync(path.join(OUT, 'tailwind.preset.cjs'), `${head}module.exports = ${JSON.stringify(tw, null, 2)};\n`);

// ---- Swift ---------------------------------------------------------------
const hexRGB = (h) => [1, 3, 5].map((i) => (parseInt(h.slice(i, i + 2), 16) / 255).toFixed(4));
const camel = (s) => s.replace(/[-.](\w)/g, (_, c) => c.toUpperCase()).replace(/^(\d)/, '_$1');
let swift = `// SIRAJ Design Tokens v${T.$version} — generated. Do not edit.\nimport SwiftUI\n\npublic enum SirajColor {\n`;
for (const [k, t] of Object.entries(flat)) if (t.$type === 'color' && k.startsWith('color.')) { const [r, g, b] = hexRGB(resolve(t.$value)); swift += `    public static let ${camel(k.slice(6))} = Color(red: ${r}, green: ${g}, blue: ${b})\n`; }
swift += `}\n\npublic enum SirajSpace {\n`;
for (const [k, t] of Object.entries(flat)) if (k.startsWith('space.')) swift += `    public static let s${k.slice(6)}: CGFloat = ${parseFloat(t.$value)}\n`;
swift += `}\n\npublic enum SirajMotion {\n`;
for (const [k, t] of Object.entries(flat)) if (k.startsWith('motion.duration.')) swift += `    public static let ${camel(k.slice(16))}: Double = ${parseFloat(t.$value) / 1000}\n`;
for (const [k, t] of Object.entries(flat)) if (k.startsWith('motion.easing.')) { const v = t.$value; swift += `    public static let ease${camel('-' + k.slice(14))} = Animation.timingCurve(${v.join(', ')}, duration: 0.36)\n`; }
for (const [k, t] of Object.entries(flat)) if (k.startsWith('motion.spring.')) { const v = t.$value; swift += `    public static let spring${camel('-' + k.slice(14))} = Animation.interpolatingSpring(mass: ${v.mass}, stiffness: ${v.stiffness}, damping: ${v.damping})\n`; }
swift += `}\n`;
fs.writeFileSync(path.join(OUT, 'SirajTokens.swift'), swift);

// ---- Kotlin (Jetpack Compose) --------------------------------------------
let kt = `// SIRAJ Design Tokens v${T.$version} — generated. Do not edit.\npackage brand.siraj.tokens\n\nimport androidx.compose.ui.graphics.Color\nimport androidx.compose.ui.unit.dp\nimport androidx.compose.animation.core.CubicBezierEasing\n\nobject SirajColor {\n`;
for (const [k, t] of Object.entries(flat)) if (t.$type === 'color' && k.startsWith('color.')) kt += `    val ${camel(k.slice(6))} = Color(0xFF${resolve(t.$value).slice(1).toUpperCase()})\n`;
kt += `}\n\nobject SirajSpace {\n`;
for (const [k, t] of Object.entries(flat)) if (k.startsWith('space.')) kt += `    val s${k.slice(6)} = ${parseFloat(t.$value)}.dp\n`;
kt += `}\n\nobject SirajMotion {\n`;
for (const [k, t] of Object.entries(flat)) if (k.startsWith('motion.duration.')) kt += `    const val ${camel(k.slice(16))}Ms = ${parseFloat(t.$value)}\n`;
for (const [k, t] of Object.entries(flat)) if (k.startsWith('motion.easing.')) kt += `    val ease${camel('-' + k.slice(14))} = CubicBezierEasing(${t.$value.map((n) => n + 'f').join(', ')})\n`;
kt += `}\n`;
fs.writeFileSync(path.join(OUT, 'SirajTokens.kt'), kt);

// ---- Font face CSS (relative to repo root /03-Typography) ----------------
const W = { ExtraLight: 200, Light: 300, Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 };
let ff = `/* SIRAJ brand fonts — Jost (Latin) + Noto Kufi Arabic (Arabic). SIL OFL 1.1. */\n`;
for (const [fam, dir, file] of [['Jost', 'Jost', 'Jost'], ['Noto Kufi Arabic', 'NotoKufiArabic', 'NotoKufiArabic']]) {
  for (const [n, w] of Object.entries(W)) {
    ff += `@font-face { font-family: "${fam}"; src: url("fonts/${dir}/${file}-${n}.ttf") format("truetype"); font-weight: ${w}; font-style: normal; font-display: swap;${fam === 'Jost' ? ' unicode-range: U+0000-05FF, U+0700-FFFF;' : ''} }\n`;
  }
}
ff += `@font-face { font-family: "Jost"; src: url("fonts/Jost/Jost-LightItalic.ttf") format("truetype"); font-weight: 300; font-style: italic; font-display: swap; }\n`;
ff += `@font-face { font-family: "Jost"; src: url("fonts/Jost/Jost-RegularItalic.ttf") format("truetype"); font-weight: 400; font-style: italic; font-display: swap; }\n`;
fs.writeFileSync(path.join(ROOT, '03-Typography/siraj-fonts.css'), ff);

console.log('tokens:', Object.keys(flat).length, 'built →', path.relative(ROOT, OUT));
