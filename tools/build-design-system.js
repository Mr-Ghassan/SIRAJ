#!/usr/bin/env node
// SIRAJ Design System v1.0 — token build.
// Reads  design-system/tokens/siraj-ds.tokens.json  (+ motion-system/tokens/siraj-motion-levels.json)
// Writes design-system/build/
//   siraj-ds.css             CSS custom properties (--siraj-*), Ivory (light) + Deep (dark) via [data-theme]
//   siraj-ds-typography.css  bilingual type classes (.siraj-t-display … .siraj-t-data)
//   siraj-ds.ts / .js / .d.ts typed constant export of every resolved token
//   siraj-ds.json            flat, resolved name → value map
//   contrast.json            WCAG contrast of every text token on every surface, per theme
// Usage: node tools/build-design-system.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DS = path.join(ROOT, 'design-system');
const SRC = path.join(DS, 'tokens', 'siraj-ds.tokens.json');
const MOTION = path.join(ROOT, 'motion-system', 'tokens', 'siraj-motion-levels.json');
const OUT = path.join(DS, 'build');
fs.mkdirSync(OUT, { recursive: true });

const T = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const M = JSON.parse(fs.readFileSync(MOTION, 'utf8'));

// ── reference resolution ─────────────────────────────────────────────────────
function get(objPath) {
  let o = T; for (const k of objPath.split('.')) { o = o && o[k]; }
  if (o === undefined) throw new Error('Unresolved token reference {' + objPath + '}');
  return o && typeof o === 'object' && '$value' in o ? o.$value : o;
}
function resolve(v, depth = 0) {
  if (depth > 8) throw new Error('reference loop');
  if (typeof v === 'string') {
    const m = v.match(/^\{([^}]+)\}$/);
    if (m) return resolve(get(m[1]), depth + 1);
  }
  return v;
}
const kebab = (s) => String(s).replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());

// ── colour maths (WCAG 2.x) ──────────────────────────────────────────────────
function hexToRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
function lum(hex) { return hexToRgb(hex).map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }).reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0); }
function contrast(a, b) { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }

// ── collect flat CSS variables ───────────────────────────────────────────────
const vars = []; // [name, value]
const push = (name, value) => vars.push(['--siraj-' + name, value]);

// colours
for (const [group, set] of Object.entries(T.color)) {
  for (const [k, tok] of Object.entries(set)) { if (k.startsWith('$')) continue; push(`color-${group === 'core' ? '' : group + '-'}${k}`, resolve(tok.$value)); }
}
for (const [k, tok] of Object.entries(T.gradient)) push(`gradient-${k}`, tok.$value);
// fonts
const fam = (arr) => arr.map((f) => (/\s/.test(f) || /^[A-Z]/.test(f)) && !['sans-serif', 'serif'].includes(f) ? `"${f}"` : f).join(', ');
for (const [k, tok] of Object.entries(T.font.family)) push(`font-${k}`, fam(tok.$value));
for (const [k, tok] of Object.entries(T.font.weight)) push(`weight-${k}`, tok.$value);
// space, layout, radius, border, shadow, opacity, z
for (const [k, tok] of Object.entries(T.space)) { if (!k.startsWith('$')) push(`space-${k}`, tok.$value); }
for (const [k, tok] of Object.entries(T.layout)) push(`layout-${k}`, tok.$value);
for (const [k, tok] of Object.entries(T.radius)) push(`radius-${k}`, tok.$value);
for (const [k, tok] of Object.entries(T.border.width)) push(`border-${k}`, tok.$value);
push('rule-opacity', T.border['rule-opacity'].$value);
for (const [k, tok] of Object.entries(T.shadow)) { if (!k.startsWith('$')) push(`shadow-${k}`, tok.$value); }
for (const [k, tok] of Object.entries(T.opacity)) push(`opacity-${k}`, tok.$value);
for (const [k, tok] of Object.entries(T.z)) push(`z-${k}`, tok.$value);
// breakpoints + grids (reference values; media queries use the literal px)
for (const [k, bp] of Object.entries(T.breakpoint)) { push(`bp-${k}`, bp.$value); push(`bp-${k}-min`, bp.min); }
for (const [k, g] of Object.entries(T.grid)) {
  for (const [p, v] of Object.entries(g)) { if (p.startsWith('$') || p === 'use') continue; push(`grid-${k}-${kebab(p)}`, typeof v === 'number' ? v : v); }
}
// motion hooks (shared levels)
const bez = (b) => `cubic-bezier(${b.join(', ')})`;
for (const [k, e] of Object.entries(M.easing)) push(`ease-${k}`, bez(e.bezier));
for (const [k, l] of Object.entries(M.level)) {
  push(`motion-${k}-duration`, l.duration);
  push(`motion-${k}-ease`, `var(--siraj-ease-${l.ease})`);
  push(`motion-${k}-stagger`, l.stagger);
  push(`motion-${k}-translate`, l.translate);
  push(`motion-${k}-scale`, l.scale[0]);
  push(`motion-${k}-blur`, l.blur);
}
// component tokens
function walkComponent(obj, prefix) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) push(`${prefix}-${k}`, resolve(v.$value));
    else if (v && typeof v === 'object') walkComponent(v, `${prefix}-${k}`);
  }
}
walkComponent(T.component, 'c');

// semantic themes
function themeVars(name) {
  const out = []; const th = T.theme[name];
  for (const [k, tok] of Object.entries(th)) { if (k.startsWith('$') || tok.$type === 'string') continue; out.push([`--siraj-${k}`, resolve(tok.$value)]); }
  return out;
}
const ivory = themeVars('ivory');
const deep = themeVars('deep');

// typography role vars
const BP_MIN = 390; const BP_MAX = 1440;
function fluid(m, d) {
  if (m === d) return `${d}px`;
  const slope = (d - m) / (BP_MAX - BP_MIN);
  return `clamp(${m}px, calc(${m}px + (100vw - ${BP_MIN}px) * ${slope.toFixed(5)}), ${d}px)`;
}
const roles = Object.entries(T.typography).filter(([k]) => !k.startsWith('$'));
function typeVars(lang) {
  const out = [];
  for (const [role, r] of roles) {
    const s = r[lang];
    out.push([`--siraj-type-${role}-family`, `var(--siraj-font-${s.family})`]);
    out.push([`--siraj-type-${role}-size`, fluid(s.mobile, s.desktop)]);
    out.push([`--siraj-type-${role}-weight`, s.weight]);
    out.push([`--siraj-type-${role}-line`, s.lineHeight]);
    out.push([`--siraj-type-${role}-tracking`, s.letterSpacing]);
    out.push([`--siraj-type-${role}-case`, s.textTransform || 'none']);
  }
  return out;
}

// ── write CSS ────────────────────────────────────────────────────────────────
const block = (sel, list, extra = '') => `${sel} {\n${list.map(([n, v]) => `  ${n}: ${v};`).join('\n')}${extra ? '\n' + extra : ''}\n}\n`;
const header = `/* SIRAJ Design System v${T.$version} — generated by tools/build-design-system.js from design-system/tokens/siraj-ds.tokens.json. Do not edit by hand. */\n`;
let css = header;
css += '\n/* Core, scale, layout, motion and component tokens */\n' + block(':root', vars);
css += '\n/* Theme · Ivory (light, default) */\n' + block(':root, [data-theme="light"], [data-theme="ivory"]', ivory, '  color-scheme: light;');
css += '\n/* Theme · Deep (dark) */\n' + block('[data-theme="dark"], [data-theme="deep"]', deep, '  color-scheme: dark;');
css += '\n/* Typography roles · English (LTR) */\n' + block(':root, :lang(en)', typeVars('en'));
css += '\n/* Typography roles · Arabic (RTL) — letter-spacing always 0 */\n' + block(':lang(ar)', typeVars('ar'));
const reduced = Object.keys(M.level).map((k) => [[`--siraj-motion-${k}-duration`, '120ms'], [`--siraj-motion-${k}-translate`, '0px'], [`--siraj-motion-${k}-scale`, '1'], [`--siraj-motion-${k}-blur`, '0px'], [`--siraj-motion-${k}-stagger`, '0ms']]).flat();
css += `\n/* Reduced motion: every level becomes an opacity-only change of 120ms */\n@media (prefers-reduced-motion: reduce) {\n${block('  :root', reduced).replace(/\n {2}/g, '\n    ').replace(/\n}\n$/, '\n  }\n')}}\n`;
fs.writeFileSync(path.join(OUT, 'siraj-ds.css'), css);

// typography classes
let tcss = header + `/* Bilingual type roles. The role reads the right Arabic or English values from the element's language. */\n`;
for (const [role] of roles) {
  tcss += `.siraj-t-${role} { font-family: var(--siraj-type-${role}-family); font-size: var(--siraj-type-${role}-size); font-weight: var(--siraj-type-${role}-weight); line-height: var(--siraj-type-${role}-line); letter-spacing: var(--siraj-type-${role}-tracking); text-transform: var(--siraj-type-${role}-case); }\n`;
}
tcss += `
.siraj-t-display, .siraj-t-h1, .siraj-t-h2, .siraj-t-h3 { color: var(--siraj-text-strong); margin: 0; text-wrap: balance; }
.siraj-t-lead, .siraj-t-body { text-wrap: pretty; }
.siraj-t-label { color: var(--siraj-text-muted); }
.siraj-t-numbers, .siraj-t-pricing, .siraj-t-data { font-variant-numeric: lining-nums tabular-nums; font-feature-settings: "lnum" 1, "tnum" 1; }
.siraj-t-numbers, .siraj-t-pricing { color: var(--siraj-text-strong); }
.siraj-t-pricing .siraj-unit { font-family: var(--siraj-font-arabic); font-size: 0.45em; font-weight: 400; color: var(--siraj-text-muted); margin-inline-start: 0.35em; }
.siraj-t-pricing .siraj-unit:lang(en) { font-family: var(--siraj-font-latin); letter-spacing: 0.12em; }
/* Arabic display pairing — one light phrase, one heavy phrase (200 ↔ 800) */
.siraj-t-light { font-weight: 200; }
.siraj-t-heavy { font-weight: 800; }
:lang(en) .siraj-t-heavy, .siraj-t-heavy:lang(en) { font-weight: 500; }
:lang(ar) .siraj-t-label, .siraj-t-label:lang(ar) { text-transform: none; letter-spacing: 0; }
:lang(ar) { letter-spacing: 0; }
`;
fs.writeFileSync(path.join(OUT, 'siraj-ds-typography.css'), tcss);

// ── resolved token object (TS / JS / d.ts / flat JSON) ───────────────────────
function resolvedTree(node) {
  if (Array.isArray(node)) return node;
  if (node && typeof node === 'object') {
    if ('$value' in node) return resolve(node.$value);
    const o = {};
    for (const [k, v] of Object.entries(node)) { if (k.startsWith('$')) continue; o[k] = resolvedTree(v); }
    return o;
  }
  return resolve(node);
}
const tree = resolvedTree(T);
tree.typography = Object.fromEntries(roles.map(([k, r]) => [k, { usage: r.usage, ar: r.ar, en: r.en }]));
tree.motion = { easing: Object.fromEntries(Object.entries(M.easing).map(([k, e]) => [k, { bezier: e.bezier, css: bez(e.bezier), use: e.use }])), level: M.level, reducedMotion: M.reducedMotion };
tree.version = T.$version;
const json = JSON.stringify(tree, null, 2);
fs.writeFileSync(path.join(OUT, 'siraj-ds.ts'), `// SIRAJ Design System v${T.$version} — generated. Do not edit.\nexport const tokens = ${json} as const;\nexport type SirajTokens = typeof tokens;\nexport type SirajTheme = keyof typeof tokens.theme;\nexport type SirajTypeRole = keyof typeof tokens.typography;\nexport type SirajMotionLevel = keyof typeof tokens.motion.level;\n/** CSS custom property reference, e.g. cssVar('color-maroon') → var(--siraj-color-maroon) */\nexport const cssVar = (name: string): string => \`var(--siraj-\${name})\`;\nexport default tokens;\n`);
fs.writeFileSync(path.join(OUT, 'siraj-ds.js'), `// SIRAJ Design System v${T.$version} — generated. Do not edit.\nexport const tokens = ${json};\nexport const cssVar = (name) => \`var(--siraj-\${name})\`;\nexport default tokens;\n`);
fs.writeFileSync(path.join(OUT, 'siraj-ds.d.ts'), `// SIRAJ Design System v${T.$version} — generated. Do not edit.\nexport declare const tokens: ${json};\nexport type SirajTokens = typeof tokens;\nexport type SirajTheme = keyof typeof tokens.theme;\nexport type SirajTypeRole = keyof typeof tokens.typography;\nexport type SirajMotionLevel = keyof typeof tokens.motion.level;\nexport declare const cssVar: (name: string) => string;\nexport default tokens;\n`);
const flat = {};
for (const [n, v] of vars) flat[n] = v;
for (const [n, v] of ivory) flat[n + '@ivory'] = v;
for (const [n, v] of deep) flat[n + '@deep'] = v;
fs.writeFileSync(path.join(OUT, 'siraj-ds.json'), JSON.stringify({ version: T.$version, vars: flat }, null, 2) + '\n');

// ── contrast report ──────────────────────────────────────────────────────────
const report = {};
let fail = 0;
for (const [name, list] of [['ivory', ivory], ['deep', deep]]) {
  const m = Object.fromEntries(list.map(([n, v]) => [n.replace('--siraj-', ''), v]));
  const surfaces = ['bg', 'surface', 'surface-alt'];
  const texts = [['text', 4.5], ['text-strong', 4.5], ['text-muted', 4.5], ['accent', 4.5], ['border-strong', 3], ['success', 3], ['warning', 3], ['error', 3], ['info', 3]];
  report[name] = [];
  for (const s of surfaces) for (const [t, min] of texts) {
    const r = contrast(m[t], m[s]);
    const ok = r >= min; if (!ok) fail++;
    report[name].push({ fg: t, bg: s, fgHex: m[t], bgHex: m[s], ratio: Math.round(r * 100) / 100, min, pass: ok });
  }
  const r = contrast(m['on-accent'], m.accent); if (r < 4.5) fail++;
  report[name].push({ fg: 'on-accent', bg: 'accent', fgHex: m['on-accent'], bgHex: m.accent, ratio: Math.round(r * 100) / 100, min: 4.5, pass: r >= 4.5 });
}
fs.writeFileSync(path.join(OUT, 'contrast.json'), JSON.stringify(report, null, 2) + '\n');

console.log(`✓ design-system/build: ${vars.length} core vars, ${ivory.length}+${deep.length} theme vars, ${roles.length} type roles × 2 scripts`);
for (const [th, rows] of Object.entries(report)) {
  const bad = rows.filter((r) => !r.pass);
  console.log(`  ${th}: ${rows.length - bad.length}/${rows.length} contrast pairs pass` + (bad.length ? ' — FAIL: ' + bad.map((b) => `${b.fg}/${b.bg} ${b.ratio}`).join(', ') : ''));
}
if (fail) process.exitCode = 1;
module.exports = { contrast };
