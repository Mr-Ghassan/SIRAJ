// SIRAJ Design System v1.0 — shared helpers for the documentation site and example screens.
// Used by tools/build-design-system-docs.js. Contact data is read from the brand config (never hard-coded).
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DS = path.join(ROOT, 'design-system');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, '00-Brand-Foundation', 'brand.config.json'), 'utf8'));
const PHONE = cfg.contact.phone;           // raw, for tel: and WhatsApp links
const PHONE_D = cfg.contact.phone_display; // «7771 4404» — every visible phone
const HANDLE = cfg.contact.social_handle;  // SIRAJPROPERTIES — always shown with the Instagram icon, never «@»
const TOKENS = JSON.parse(fs.readFileSync(path.join(DS, 'tokens', 'siraj-ds.tokens.json'), 'utf8'));
const MOTION = JSON.parse(fs.readFileSync(path.join(ROOT, 'motion-system', 'tokens', 'siraj-motion-levels.json'), 'utf8'));
const ICONS = JSON.parse(fs.readFileSync(path.join(ROOT, '07-Icon-System', 'siraj-icons.json'), 'utf8'));
const SPRITE = fs.readFileSync(path.join(ROOT, '07-Icon-System', 'sprite', 'siraj-icons.svg'), 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '').replace('<svg ', '<svg aria-hidden="true" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" ').replace('style="display:none" ', '');
const VERSION = '1.0.0';

// ── text helpers ───────────────────────────────────────────────────────────────
// t(): bilingual inline text (docs). ar(): Arabic only (public example screens).
const t = (a, e) => `<span class="i18n" lang="ar">${a}</span><span class="i18n" lang="en">${e === undefined ? a : e}</span>`;
const tb = (a, e, tag = 'div', cls = '') => `<${tag} class="i18n ${cls}" lang="ar">${a}</${tag}><${tag} class="i18n ${cls}" lang="en">${e}</${tag}>`;
const st = (a, e) => `<tspan class="i18n" lang="ar">${a}</tspan><tspan class="i18n" lang="en">${e}</tspan>`; // inside SVG <text>
const AR = { x: (a) => a, st: (a) => a, mode: 'ar' };
const BI = { x: t, st, mode: 'bi' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── icons + logo ──────────────────────────────────────────────────────────────
const ic = (name, cls = '') => {
  if (!ICONS.icons[name.replace(/-filled$/, '')]) throw new Error('unknown icon ' + name);
  return `<svg class="siraj-icon ${cls}" aria-hidden="true" focusable="false"><use href="#sj-${name}"/></svg>`;
};
const logo = (R, cls = '', w) => `<span class="siraj-logo ${cls}"${w ? ` style="--siraj-logo-w:${w}px"` : ''}><img class="siraj-logo--on-light" src="${R}01-Logos/SVG/SIRAJ_Logo_Primary_v1.0.svg" alt="SIRAJ" width="112" height="32"><img class="siraj-logo--on-dark" src="${R}01-Logos/SVG/SIRAJ_Logo_Sand_v1.0.svg" alt="SIRAJ" width="112" height="32"></span>`;
const logoFixed = (R, variant, w = 120) => `<span class="siraj-logo" style="--siraj-logo-w:${w}px"><img src="${R}01-Logos/SVG/SIRAJ_Logo_${variant}_v1.0.svg" alt="SIRAJ" width="${w}" height="${Math.round(w / 3.49)}"></span>`;

// ── imagery (web derivatives of the approved renders + key visuals) ─────────────
const IMG = {
  cornerBlue: { src: 'SIRAJ_Project-Siraj_Corner_Blue-Hour_Clean_v1.0.jpg', dir: 'Clean', ar: 'المشروع · مسقط — منظور الزاوية عند الساعة الزرقاء', en: 'Siraj · Muscat — corner view at blue hour' },
  cornerDay: { src: 'SIRAJ_Project-Siraj_Corner_Cloudy-Day_Clean_v1.0.jpg', dir: 'Clean', ar: 'المشروع · مسقط — منظور الزاوية نهارًا', en: 'Siraj · Muscat — corner view by day' },
  frontBlue: { src: 'SIRAJ_Project-Siraj_Front_Blue-Hour_Clean_v1.0.jpg', dir: 'Clean', ar: 'المشروع · مسقط — الواجهة عند الساعة الزرقاء', en: 'Siraj · Muscat — front elevation at blue hour' },
  frontDay: { src: 'SIRAJ_Project-Siraj_Front_Cloudy-Day_Clean_v1.0.jpg', dir: 'Clean', ar: 'المشروع · مسقط — الواجهة نهارًا', en: 'Siraj · Muscat — front elevation by day' },
  sideBlue: { src: 'SIRAJ_Project-Siraj_Side_Blue-Hour_Clean_v1.0.jpg', dir: 'Clean', ar: 'المشروع · مسقط — الواجهة الجانبية عند الساعة الزرقاء', en: 'Siraj · Muscat — side elevation at blue hour' },
  sideDay: { src: 'SIRAJ_Project-Siraj_Side_Cloudy-Day_Clean_v1.0.jpg', dir: 'Clean', ar: 'المشروع · مسقط — الواجهة الجانبية نهارًا', en: 'Siraj · Muscat — side elevation by day' },
  kvLantern: { src: 'SIRAJ_Project-Siraj_KV_Lantern_4x5_v1.0.jpg', dir: 'KeyVisuals', ar: 'المشروع — المبنى يضيء كالفانوس', en: 'Siraj — the building lit like a lantern' },
  kvVeil: { src: 'SIRAJ_Project-Siraj_KV_Veil_4x5_v1.0.jpg', dir: 'KeyVisuals', ar: 'المشروع — الحرير يغطّي المبنى قبل الكشف', en: 'Siraj — silk veils the building before the reveal' },
  kvReveal: { src: 'SIRAJ_Project-Siraj_KV_Reveal_4x5_v1.0.jpg', dir: 'KeyVisuals', ar: 'المشروع — الحرير ينسحب كاشفًا المبنى', en: 'Siraj — silk sweeps away to reveal the building' },
  kvRibbon: { src: 'SIRAJ_Project-Siraj_KV_Ribbon_4x5_v1.0.jpg', dir: 'KeyVisuals', ar: 'المشروع — شريط حرير يلتفّ حول المبنى', en: 'Siraj — a silk ribbon wraps the building' },
  kvDetail: { src: 'SIRAJ_Project-Siraj_KV_Detail_4x5_v1.0.jpg', dir: 'KeyVisuals', ar: 'المشروع — ضوء يعبر الطوب المثقّب', en: 'Siraj — light through the perforated brick' },
  kvLanternTall: { src: 'SIRAJ_Project-Siraj_KV_Lantern_9x16_v1.0.jpg', dir: 'KeyVisuals', ar: 'المشروع — المبنى يضيء كالفانوس', en: 'Siraj — the building lit like a lantern', tall: true },
  kvRevealTall: { src: 'SIRAJ_Project-Siraj_KV_Reveal_9x16_v1.0.jpg', dir: 'KeyVisuals', ar: 'المشروع — الحرير ينسحب كاشفًا المبنى', en: 'Siraj — silk sweeps away to reveal the building', tall: true },
};
const webName = (k) => 'siraj-' + k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()) + '.jpg';
const imgUrl = (D, k, thumb) => `${D}assets/img/${thumb ? 'thumb-' : ''}${webName(k)}`;
// Silk stills (real photography) — referenced in place from 06-SIRAJ-Silk
const SILK = (R, name, ratio = '4x5') => `${R}06-SIRAJ-Silk/Stills/${name}/SIRAJ_Silk_${name}_${ratio}_web_v1.0.webp`;

function ensureImages() {
  const out = path.join(DS, 'assets', 'img');
  fs.mkdirSync(out, { recursive: true });
  const jobs = [];
  for (const [k, v] of Object.entries(IMG)) {
    const src = path.join(ROOT, '14-Property-Marketing', '12-Project-Siraj', 'Source', v.dir, v.src);
    jobs.push([src, path.join(out, webName(k)), v.tall ? 900 : 1200, 80]);
    if (!v.tall) jobs.push([src, path.join(out, 'thumb-' + webName(k)), 360, 78]);
  }
  const todo = jobs.filter(([, dst]) => !fs.existsSync(dst));
  if (!todo.length) return;
  const py = `import sys,json\nfrom PIL import Image\nfor s,d,w,q in json.loads(sys.argv[1]):\n  im=Image.open(s).convert('RGB'); h=round(im.height*w/im.width)\n  im.resize((w,h),Image.LANCZOS).save(d,'JPEG',quality=q,optimize=True,progressive=True)\n`;
  require('child_process').execFileSync('python3', ['-I', '-c', py, JSON.stringify(todo)], { stdio: 'inherit' });
}

// ── SVG generators (abstract demo series — never project data) ─────────────────
function barChart(c, { values = [42, 68, 55, 81, 64, 90], second = null, labels } = {}) {
  const W = 560, H = 240, pad = { l: 36, r: 8, t: 12, b: 32 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const n = values.length; const g = iw / n; const bw = second ? g * 0.28 : g * 0.44;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${c.mode === 'ar' ? 'مخطط أعمدة' : 'Bar chart'}">`;
  for (let i = 0; i <= 4; i++) { const y = pad.t + ih - (ih * i) / 4; s += `<line class="gridline" x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}"/><text x="${pad.l - 8}" y="${y + 4}" text-anchor="end">${i * 25}</text>`; }
  values.forEach((v, i) => {
    const x = pad.l + g * i + (g - (second ? bw * 2 + 4 : bw)) / 2;
    s += `<rect class="s1" x="${x}" y="${pad.t + ih - (ih * v) / 100}" width="${bw}" height="${(ih * v) / 100}"/>`;
    if (second) s += `<rect class="s2" x="${x + bw + 4}" y="${pad.t + ih - (ih * second[i]) / 100}" width="${bw}" height="${(ih * second[i]) / 100}"/>`;
    const lab = labels ? labels[i] : `${c.mode === 'ar' ? 'ف' : 'P'}${i + 1}`;
    s += `<text x="${pad.l + g * i + g / 2}" y="${H - 10}" text-anchor="middle">${lab}</text>`;
  });
  s += `<line class="axis" x1="${pad.l}" x2="${W - pad.r}" y1="${pad.t + ih}" y2="${pad.t + ih}"/></svg>`;
  return s;
}
function lineChart(c, { a = [20, 34, 30, 48, 56, 62, 74, 70, 82], b = [28, 30, 36, 40, 44, 50, 52, 58, 60] } = {}) {
  const W = 560, H = 240, pad = { l: 36, r: 12, t: 12, b: 32 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const X = (i, n) => pad.l + (iw * i) / (n - 1); const Y = (v) => pad.t + ih - (ih * v) / 100;
  const pts = (arr) => arr.map((v, i) => `${X(i, arr.length).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${c.mode === 'ar' ? 'مخطط خطّي' : 'Line chart'}">`;
  for (let i = 0; i <= 4; i++) { const y = pad.t + ih - (ih * i) / 4; s += `<line class="gridline" x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}"/><text x="${pad.l - 8}" y="${y + 4}" text-anchor="end">${i * 25}</text>`; }
  s += `<polygon class="area1" points="${pad.l},${pad.t + ih} ${pts(a)} ${W - pad.r},${pad.t + ih}"/>`;
  s += `<polyline class="line2" points="${pts(b)}"/><polyline class="line1" points="${pts(a)}"/>`;
  a.forEach((v, i) => { if (i % 2 === 0) s += `<text x="${X(i, a.length)}" y="${H - 10}" text-anchor="middle">${c.mode === 'ar' ? 'ف' : 'P'}${i + 1}</text>`; });
  s += `<rect class="dot1" x="${X(a.length - 1, a.length) - 4}" y="${Y(a[a.length - 1]) - 4}" width="8" height="8" transform="rotate(45 ${X(a.length - 1, a.length)} ${Y(a[a.length - 1])})"/>`;
  s += `<line class="axis" x1="${pad.l}" x2="${W - pad.r}" y1="${pad.t + ih}" y2="${pad.t + ih}"/></svg>`;
  return s;
}
function donutChart(c, { parts = [46, 32, 22], center = '' } = {}) {
  const r = 70, C = 2 * Math.PI * r; let off = 0; const cls = ['var(--siraj-color-data-1)', 'var(--siraj-color-data-2)', 'var(--siraj-color-data-5)', 'var(--siraj-color-data-4)'];
  let s = `<svg viewBox="0 0 200 200" role="img" aria-label="${c.mode === 'ar' ? 'مخطط حلقي' : 'Donut chart'}" style="max-width:220px;margin-inline:auto"><circle class="donut-track" cx="100" cy="100" r="${r}" stroke-width="22"/>`;
  parts.forEach((p, i) => { const len = (C * p) / 100 - 2; s += `<circle class="donut-seg" cx="100" cy="100" r="${r}" stroke="${cls[i]}" stroke-width="22" stroke-dasharray="${len.toFixed(1)} ${(C - len).toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" transform="rotate(-90 100 100)"/>`; off += (C * p) / 100; });
  if (center) s += `<text x="100" y="108" text-anchor="middle" style="font-size:26px;font-weight:200;fill:var(--siraj-text-strong)">${center}</text>`;
  return s + '</svg>';
}
function floorPlan(c) {
  const T = c.st;
  return `<svg viewBox="0 0 600 420" role="img" aria-label="${c.mode === 'ar' ? 'مخطط توضيحي' : 'Illustrative plan'}">
  <rect class="room" x="20" y="20" width="240" height="230"/><rect class="room is-active" x="260" y="20" width="320" height="230"/><rect class="room" x="20" y="250" width="400" height="150"/><rect class="room" x="420" y="250" width="160" height="150"/>
  <line class="glaze" x1="300" y1="20" x2="540" y2="20"/><line class="glaze" x1="60" y1="20" x2="220" y2="20"/>
  <path class="wall" d="M20 20H580V400H20Z"/>
  <path class="part" d="M260 20V170M260 214V250M20 250H120M164 250H470M514 250H580M420 250V310M420 354V400"/>
  <path class="swing" d="M260 170A44 44 0 0 1 304 214M120 250A44 44 0 0 0 164 294M470 250A44 44 0 0 1 514 294M420 310A44 44 0 0 1 464 354"/>
  <text x="140" y="130" text-anchor="middle">${T('معيشة', 'Living')}</text><text x="140" y="152" text-anchor="middle" class="dim">— م²</text>
  <text x="420" y="130" text-anchor="middle">${T('غرفة نوم', 'Bedroom')}</text><text x="420" y="152" text-anchor="middle" class="dim">— م²</text>
  <text x="220" y="330" text-anchor="middle">${T('مطبخ وطعام', 'Kitchen · dining')}</text><text x="220" y="352" text-anchor="middle" class="dim">— م²</text>
  <text x="500" y="330" text-anchor="middle">${T('حمّام', 'Bath')}</text><text x="500" y="352" text-anchor="middle" class="dim">— م²</text>
  <g transform="translate(556 372)"><path d="M0 -14L6 0L0 14L-6 0Z" fill="var(--siraj-lumen)"/><text x="0" y="-20" text-anchor="middle" class="dim">N</text></g>
</svg>`;
}
function mapTile(c, { x = 54, y = 48, label } = {}) {
  // Abstract district tile: blocks, roads, a dashed wadi line and the Hajar ridge. No points of interest.
  let blocks = '';
  for (let r = 0; r < 6; r++) for (let q = 0; q < 9; q++) {
    if ((r === 2 && q > 2) || q === 4) continue;
    blocks += `<rect class="blk" x="${q * 96 + 14}" y="${r * 84 + 14}" width="${68 + ((q * 7 + r * 3) % 3) * 6}" height="${56 + ((q + r) % 2) * 6}"/>`;
  }
  return `<div class="siraj-map" role="img" aria-label="${c.mode === 'ar' ? 'خريطة توضيحية لموقع المشروع في مسقط' : 'Illustrative map of the Siraj location in Muscat'}" style="--x:${x}%;--y:${y}%">
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice"><rect width="800" height="480" fill="var(--siraj-surface-alt)"/>
  <path class="ridge" d="M0 0H800V40C700 70 640 30 560 52C480 74 420 36 330 58C240 80 160 40 80 60C40 70 16 64 0 70Z"/>
  <g transform="rotate(-6 400 240)">${blocks}
  <path class="road road--main" d="M-40 252H860"/><path class="road road--main" d="M398 -40V540"/>
  <path class="road road--minor" d="M-40 168H860M-40 336H860M206 -40V540M590 -40V540"/></g>
  <path class="wadi" d="M-10 430C120 400 200 452 330 420C460 388 560 450 820 404"/></svg>
  <div class="siraj-map__pin"><span class="siraj-map__label">${label || c.x('المشروع', 'The project')}</span><span class="siraj-map__diamond"></span></div>
  <div class="siraj-map__note">${c.x('مسقط', 'Muscat')}</div>
</div>`;
}

// ── docs navigation + shells ───────────────────────────────────────────────────
const DOCS_NAV = [
  ['index', 'نظرة عامة', 'Overview', 'grid'],
  ['foundations', 'الأسس والرموز', 'Foundations & tokens', 'layers'],
  ['typography', 'الطباعة', 'Typography', 'documents'],
  ['grid', 'الشبكة والتخطيط', 'Grid & layout', 'floor-plan'],
  ['components', 'المكوّنات', 'Components', 'apartment'],
  ['real-estate', 'مكوّنات العقار', 'Real-estate components', 'building'],
  ['icons', 'الأيقونات', 'Icons', 'star'],
  ['motion', 'خطافات الحركة', 'Motion hooks', 'play'],
  ['templates', 'القوالب', 'Templates', 'brochure'],
  ['examples', 'الشاشات النموذجية', 'Example screens', 'view'],
  ['usage', 'قواعد الاستخدام', 'Usage rules', 'check'],
];
const docHref = (D, key) => key === 'index' ? `${D}index.html` : `${D}docs/${key}.html`;

function head({ title, R, D, extraCss = [], lang = 'ar', theme = 'light' }) {
  return `<!doctype html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}" data-theme="${theme}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="SIRAJ Design System v${VERSION}">
<title>${title}</title>
<link rel="icon" href="${R}01-Logos/SVG/SIRAJ_Monogram-S_Maroon-on-Ivory_v1.0.svg">
<link rel="stylesheet" href="${D}css/siraj-ds.css">
${extraCss.map((h) => `<link rel="stylesheet" href="${h}">`).join('\n')}
</head>`;
}

function docPage({ key, title, lead, eyebrow, body, D, R, toc = [] }) {
  const nav = DOCS_NAV.map(([k, a, e, icon]) => `<a class="siraj-sidebar__link" href="${docHref(D, k)}"${k === key ? ' aria-current="page"' : ''}>${ic(icon)}${t(a, e)}</a>`).join('');
  const tocHtml = toc.length ? `<nav class="doc-toc" aria-label="${title[0]}"><div class="siraj-label siraj-muted">${t('في هذه الصفحة', 'On this page')}</div>${toc.map(([id, a, e]) => `<a href="#${id}">${t(a, e)}</a>`).join('')}</nav>` : '';
  return `${head({ title: `${title[0]} · ${title[1]} — SIRAJ Design System v1.0`, R, D, extraCss: [`${D}docs/assets/docs.css`] })}
<body class="doc">
${SPRITE}
<a class="siraj-skip" href="#main">${t('تخطَّ إلى المحتوى', 'Skip to content')}</a>
<header class="siraj-header doc-top">
  <div class="doc-top__inner">
    <a class="doc-brand" href="${D}index.html">${logo(R, '', 96)}<span class="doc-brand__name">${t('نظام التصميم', 'Design System')} <span class="siraj-num">v1.0</span></span></a>
    <div class="doc-top__actions">
      <button class="siraj-btn siraj-btn--ghost siraj-btn--sm doc-lang" type="button" data-doc-lang aria-label="${'اللغة · Language'}"><span class="i18n" lang="ar">English</span><span class="i18n" lang="en">العربية</span></button>
      <button class="siraj-btn siraj-btn--icon siraj-btn--ghost siraj-btn--sm" type="button" data-doc-theme aria-label="${'الوضع الداكن · Dark mode'}">${ic('sun')}</button>
      <button class="siraj-btn siraj-btn--icon siraj-btn--ghost siraj-btn--sm doc-menu" type="button" data-siraj-open="doc-drawer" aria-label="${'القائمة · Menu'}">${ic('menu')}</button>
    </div>
  </div>
</header>
<div class="doc-shell">
  <aside class="siraj-sidebar doc-side" aria-label="Docs"><div class="siraj-sidebar__group"><div class="siraj-sidebar__title siraj-label">${t('نظام تصميم SIRAJ', 'SIRAJ Design System')}</div>${nav}</div></aside>
  <main id="main" class="doc-main">
    <div class="doc-hero">
      ${eyebrow ? `<div class="siraj-eyebrow"><span class="siraj-lumen"></span>${t(eyebrow[0], eyebrow[1])}</div>` : ''}
      <h1 class="siraj-t-h1">${t(title[0], title[1])}</h1>
      ${lead ? `<p class="siraj-t-lead doc-lead">${t(lead[0], lead[1])}</p>` : ''}
      ${tocHtml}
    </div>
    ${body}
    <footer class="doc-foot">
      <div class="doc-foot__row">${logo(R, '', 104)}<div class="siraj-contact-line"><a href="tel:${PHONE}"><span class="siraj-ltr">${PHONE_D}</span></a><span class="siraj-lumen"></span><a href="https://instagram.com/sirajproperties"><span class="siraj-ig">${ic('instagram')}<span class="siraj-ltr">${HANDLE}</span></span></a></div></div>
      <div class="siraj-small siraj-muted">${t('نظام تصميم SIRAJ · الإصدار 1.0.0', 'SIRAJ Design System · version 1.0.0')}</div>
    </footer>
  </main>
</div>
<div class="siraj-overlay siraj-overlay--drawer" id="doc-drawer" hidden>
  <div class="siraj-drawer" role="dialog" aria-modal="true" aria-labelledby="doc-drawer-title">
    <div class="siraj-drawer__head"><h2 class="siraj-drawer__title" id="doc-drawer-title">${t('نظام التصميم', 'Design System')}</h2><button class="siraj-btn siraj-btn--icon siraj-btn--ghost" type="button" data-siraj-close aria-label="${'إغلاق · Close'}">${ic('close')}</button></div>
    <div class="siraj-drawer__body" style="padding-inline:0">${nav}</div>
  </div>
</div>
<script src="${D}components/siraj-ds.js"></script>
<script src="${D}docs/assets/docs.js"></script>
</body>
</html>
`;
}

// Section + specimen helpers for docs pages
const section = (id, a, e, intro, inner) => `<section class="doc-sec" id="${id}"><div class="doc-sec__head"><h2 class="siraj-t-h2">${t(a, e)}</h2>${intro ? `<p class="doc-intro">${t(intro[0], intro[1])}</p>` : ''}</div>${inner}</section>`;
const spec = (nameA, nameE, inner, { note, tag, stage = '', wide = false } = {}) => `<figure class="doc-spec${wide ? ' doc-spec--wide' : ''}"><figcaption class="doc-spec__bar"><span class="doc-spec__name">${t(nameA, nameE)}</span>${tag ? `<span class="siraj-tag">${t(tag[0], tag[1])}</span>` : ''}</figcaption><div class="doc-spec__stage ${stage}">${inner}</div>${note ? `<div class="doc-spec__note">${t(note[0], note[1])}</div>` : ''}</figure>`;
const DEMO_LABEL = ['بيانات عرض للمكوّن', 'Component demo data'];

// Example-screen shell (public-facing: Arabic only)
function examplePage({ title, R, D, body, theme = 'light', bodyClass = '', extraCss = [] }) {
  return `${head({ title: `${title} — SIRAJ`, R, D, theme, extraCss: [`${D}examples/examples.css`, ...extraCss] })}
<body class="ex ${bodyClass}">
${SPRITE}
${body}
<script src="${D}components/siraj-ds.js"></script>
</body>
</html>
`;
}

module.exports = { ROOT, DS, cfg, PHONE, PHONE_D, HANDLE, TOKENS, MOTION, ICONS, VERSION, t, tb, st, AR, BI, esc, ic, logo, logoFixed, IMG, imgUrl, SILK, ensureImages, barChart, lineChart, donutChart, floorPlan, mapTile, DOCS_NAV, docHref, head, docPage, section, spec, DEMO_LABEL, examplePage };
