/* =============================================================================
   SIRAJ Social Media System v1.0 — template engine
   Every template HTML holds a JSON data block (<script type="application/json" id="data">)
   and loads brand-data.js (generated from 00-Brand-Foundation/brand.config.json), social.css and this file.

   URL parameters:  ?format=post|square|story|reel|carousel|li|x  &lang=en|ar  &slide=1..n  &guide=1
   Text tokens:     {contact.phone}  {noor.en}  {n:noor.from_price_omr}  {sum:noor.units+harir.units}
   ========================================================================== */
(function () {
  'use strict';
  const B = window.SIRAJ_BRAND || {};
  const ROOT = window.SIRAJ_ROOT || '../../';            // content pages (tools/make-post.js) live one level deeper
  // a library name (Residential-Tower-Golden-Hour) or any repo-relative image path (14-Property-Marketing/…/x.jpg)
  const PHOTO = (n) => (/[\/.]/.test(n) ? `${ROOT}${n}` : `${ROOT}08-Photography/Library/SIRAJ_Photo_${n}_v1.0.jpg`);
  const STILL = (n, r) => `${ROOT}06-SIRAJ-Silk/Stills/${n}/SIRAJ_Silk_${n}_${r}_v1.0.jpg`;
  const ALPHA = (n, r) => `${ROOT}06-SIRAJ-Silk/Stills/Alpha/SIRAJ_Silk_${n}-Alpha_${r}_v1.0.png`;
  const LOGO = (v) => `${ROOT}01-Logos/SVG/SIRAJ_Logo_${v}_v1.0.svg`;
  const LOCKUP = (v) => `${ROOT}01-Logos/Lockups/SIRAJ_Lockup_${v}_v1.0.svg`;
  const GFX = (n) => `${ROOT}05-Graphic-System/SVG/SIRAJ_${n}_v1.0.svg`;
  const LOGO_RATIO = 28.11 / 98.163;
  const BLADE = '<svg class="blade" viewBox="0 0 135 96" xmlns="http://www.w3.org/2000/svg"><g transform="scale(10) translate(-61.67 -75.34)"><path d="M61.67,75.34c0,0,9.58,2.13,13.49,9.58H71.6C71.6,84.92,70.01,79.78,61.67,75.34z" fill="currentColor"/></g></svg>';

  const q = new URLSearchParams(location.search);
  const FORMAT = q.get('format') || 'post';
  const LANG = q.get('lang') || 'en';
  const SLIDE = parseInt(q.get('slide') || '1', 10);
  const GUIDE = q.get('guide') === '1';
  const RATIO = { post: '4x5', carousel: '4x5', square: '1x1', story: '9x16', reel: '9x16', li: '16x9', x: '16x9' };
  const LANDSCAPE = FORMAT === 'li' || FORMAT === 'x';

  // ---------------------------------------------------------------- helpers
  const isObj = (o) => o && typeof o === 'object' && !Array.isArray(o);
  function merge(a, b) {
    const out = { ...a };
    for (const k of Object.keys(b || {})) out[k] = isObj(a?.[k]) && isObj(b[k]) ? merge(a[k], b[k]) : b[k];
    return out;
  }
  function get(path) {
    const parts = path.split('.');
    let o = parts[0] in (B.demo_projects || {}) ? B.demo_projects : B;
    for (const p of parts) o = o == null ? undefined : o[p];
    return o;
  }
  // "Q4 2027" → "الربع الرابع 2027" in Arabic (brand date convention)
  const QAR = { 1: 'الأول', 2: 'الثاني', 3: 'الثالث', 4: 'الرابع' };
  const quarter = (v) => (LANG === 'ar' ? String(v).replace(/Q([1-4])\s*(\d{4})/, (m, a, y) => `الربع ${QAR[a]} ${y}`) : v);
  const fmtN = (n) => Number(n).toLocaleString('en-US');
  function t(s) {
    if (s == null) return '';
    return String(s).replace(/\{(n:|sum:|q:)?([a-z0-9_.+]+)\}/gi, (m, fn, p) => {
      if (fn === 'sum:') return fmtN(p.split('+').reduce((a, x) => a + Number(get(x) || 0), 0));
      const v = get(p);
      if (v == null) return m;
      if (fn === 'q:') return quarter(v);
      return fn === 'n:' ? fmtN(v) : v;
    });
  }
  // Light inline markup: *text* → <em>, [[x]] → LTR isolate (for handles, phone numbers in Arabic)
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const rich = (s) => esc(t(s)).replace(/\[\[(.+?)\]\]/g, '<span class="ltr">$1</span>').replace(/\n/g, '<br>');
  const px = (el, v) => parseFloat(getComputedStyle(el).getPropertyValue(v));
  const two = (n) => String(n).padStart(2, '0');

  // ---------------------------------------------------------------- resolve data
  const RAW = JSON.parse(document.getElementById('data').textContent);
  let D = { ...RAW };
  delete D.formats; delete D.slides;
  const TOTAL = (RAW.slides || []).length;
  if (RAW.slides) D = merge(D, RAW.slides[SLIDE - 1] || {});
  if (RAW.formats && RAW.formats[FORMAT]) D = merge(D, RAW.formats[FORMAT]);
  if (RAW.slides && RAW.slides[SLIDE - 1]?.formats?.[FORMAT]) D = merge(D, RAW.slides[SLIDE - 1].formats[FORMAT]);
  const C = merge(D.common || {}, D[LANG] || {});
  if (D.footLockup && D.footLockup[LANG]) D.footLockup = D.footLockup[LANG]; // { en: {...}, ar: {...} }

  // ---------------------------------------------------------------- blocks
  const BLOCKS = {
    facts: (b) => `<div class="facts">${b.items.map((x) => `<span>${rich(x)}</span>`).join('<i class="lm"></i>')}</div>`,
    stats: (b) => `<div class="stats" style="--cols:${b.cols || 2}">${b.items.map((s) => {
      const u = s.u ? `<small>${rich(s.u)}</small>` : '';
      const v = s.pre ? `${u}${rich(s.v)}` : `${rich(s.v)}${u}`;
      return `<div class="stat"><div class="v${s.sm ? ' sm' : ''}${s.pre ? ' pre' : ''}">${v}</div><div class="l">${rich(s.l)}</div></div>`;
    }).join('')}</div>`,
    progress: (b) => {
      const v = Number(b.value);
      return `<div class="progress"><div class="pg-head"><div class="pg-num">${v}<small>%</small></div><div class="pg-label">${rich(b.label)}</div></div>
        <div class="pg-bar"><div class="pg-fill" style="width:${v}%"></div><div class="pg-mark" style="inset-inline-start:${v}%"></div></div>
        ${b.scale ? `<div class="pg-scale"><span>${rich(b.scale[0])}</span><span>${rich(b.scale[1])}</span></div>` : ''}</div>`;
    },
    details: (b) => `<div class="details" style="${b.kcol ? `--kcol:${b.kcol}` : ''}">${b.rows.map(([k, v]) => `<div class="row"><div class="k">${rich(k)}</div><div class="v">${rich(v)}</div></div>`).join('')}</div>`,
    list: (b) => `<ul class="list">${b.items.map((x, i) => `<li>${b.numbered ? `<span class="n">${two(i + 1)}</span>` : '<i class="lm"></i>'}<span>${rich(x)}</span></li>`).join('')}</ul>`,
    quote: (b) => `${BLADE.replace('class="blade"', 'class="quote-mark" style="color:var(--stone)"')}<blockquote class="quote">${rich(b.text)}</blockquote>${b.cite ? `<div class="cite">${rich(b.cite)}</div>` : ''}`,
    partners: (b) => `<div class="partners"><img class="p-logo" src="${LOGO(b.logo || 'Primary')}" alt="SIRAJ"><span class="x">×</span><div class="slot">${rich(b.slot || 'Partner logo')}</div></div>`,
    index: (b) => `<div class="index"><div class="ix-n">${rich(b.n)}${b.of ? `<small>/${rich(b.of)}</small>` : ''}</div>${b.label ? `<div class="ix-l">${rich(b.label)}</div>` : ''}</div>`,
    hr: (b) => `<div class="hr${b.short ? ' short' : ''}"></div>`,
    spacer: () => '<div class="spacer"></div>',
    lockup: (b) => `<img class="lockup" src="${LOCKUP(b.v)}" style="width:${b.w || 360}px;height:auto" alt="SIRAJ">`,
    text: (b) => `<p class="${b.cls || 'body'}">${rich(b.text)}</p>`,
  };

  function contentHTML() {
    let h = '';
    if (C.eyebrow) h += `<div class="eyebrow"><i class="lm"></i><span>${rich(C.eyebrow)}</span></div>`;
    if (C.title) h += `<h1 class="${D.display ? 'display' : 'title'}">${rich(C.title)}</h1>`;
    for (const l of [].concat(C.lead || [])) h += `<p class="lead">${rich(l)}</p>`;
    for (const b of C.blocks || []) h += BLOCKS[b.type](b);
    return h;
  }

  // ---------------------------------------------------------------- shapes
  function silkCornerPath(w, h, rtl, k = 0.4) {
    const r = Math.min(w, h) * k, rx = Math.min(r * (D.cornerStretch || 1.25), w * 0.45);
    let pts = [[0, 0], [w - rx, 0], [w - rx * 0.25, 0], [w, r * 0.45], [w, r], [w, h], [0, h]];
    if (rtl) pts = pts.map(([x, y]) => [w - x, y]);
    const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    return `path('M${f(pts[0])} L${f(pts[1])} C${f(pts[2])} ${f(pts[3])} ${f(pts[4])} L${f(pts[5])} L${f(pts[6])} Z')`;
  }
  function portalPath(w, h, rtl) {
    const a = Math.min(h, w * 1.5); // arch proportions follow width
    let P = [[0, h], [0, 0.099 * a], [0, 0.018 * a], [0.28 * w, 0], [0.55 * w, 0], [0.86 * w, 0], [w, 0.1116 * a], [w, 0.189 * a], [w, h]];
    if (rtl) P = P.map(([x, y]) => [w - x, y]);
    const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    return `path('M${f(P[0])} L${f(P[1])} C${f(P[2])} ${f(P[3])} ${f(P[4])} C${f(P[5])} ${f(P[6])} ${f(P[7])} L${f(P[8])} Z')`;
  }

  // ---------------------------------------------------------------- build
  const rtl = LANG === 'ar';
  const env = D.env || 'ivory';
  const layout = D.layout || 'type';
  const cv = document.createElement('div');
  cv.className = `canvas f-${FORMAT} env-${env} l-${layout}`;
  cv.lang = LANG; cv.dir = rtl ? 'rtl' : 'ltr';
  document.body.appendChild(cv);
  const V = (n) => px(cv, n);
  const W = V('--W'), H = V('--H'), M = V('--m'), TOP = V('--top'), BOT = V('--bot'), LOGO_W = V('--logo');
  const LOGO_H = LOGO_W * LOGO_RATIO;
  const S4 = V('--s4'), S5 = V('--s5');
  const LZ = D.footLockup ? (D.footLockup.w * ((D.footLockup.vb || [126.27, 74.21])[1] - 28.1) / (D.footLockup.vb || [126.27, 74.21])[0]) : LOGO_H;
  const FOOT_TOP = H - BOT - LZ; // top edge of logo zone
  const FOOT_GAP = D.footGap != null ? D.footGap * S5 : S5;

  let html = '';
  // backgrounds
  if (D.still) html += `<img class="bg-still${D.stillMirror ? ' mirror' : ''}" src="${STILL(D.still, D.stillRatio || RATIO[FORMAT])}" style="${D.stillPos ? `object-position:${D.stillPos}` : ''}">`;
  if (layout === 'hero' && D.photo) html += `<img class="bg-photo" src="${PHOTO(D.photo)}" style="object-position:${D.pos || '50% 50%'};${D.photoScale ? `transform:scale(${D.photoScale});transform-origin:${D.pos || '50% 50%'}` : ''}">`;
  if (D.overlay === 'horizon') html += `<div class="horizon-fill"></div><img class="horizon" src="${ALPHA('Horizon', H > W ? '9x16' : '16x9')}">`;
  if (D.overlay === 'scrim' || D.topScrim) html += '<div class="scrim"></div>';
  if (D.tint) html += `<div class="scrim" style="background:${D.tint}"></div>`;
  // elements (authored in LTR coordinates, mirrored for RTL)
  if (D.elements) {
    html += `<div class="el-layer mirror" style="position:absolute;inset:0;${rtl ? '' : 'transform:none'}">`;
    for (const e of D.elements) {
      if (e.type === 'blade') html += `<div class="element" style="color:${e.color || 'var(--maroon)'};${e.style}">${BLADE}</div>`;
      else if (e.type === 'lumen') html += `<i class="element lm" style="${e.style}"></i>`;
      else if (e.type === 'rule') html += `<div class="element" style="height:1px;background:var(--rule);${e.style}"></div>`;
      else if (e.type === 'img') html += `<img class="element" src="${ROOT}${e.src}" style="${e.style}">`;
      else html += `<img class="element" src="${GFX(e.type)}" style="${e.style}">`;
    }
    html += '</div>';
  }
  // media window
  const media = D.media || {};
  if ((layout === 'window' || layout === 'split') && D.photo) {
    html += `<div class="media"><img src="${PHOTO(D.photo)}" style="object-position:${D.pos || '50% 50%'}">${C.tag ? `<div class="media-tag"><i class="lm" style="background:#fff;width:.5em;height:.5em"></i>${rich(C.tag)}</div>` : ''}</div>`;
  }
  html += `<div class="content">${contentHTML()}</div>`;
  if (C.aside) html += `<div class="aside" style="position:absolute;${D.asideStyle || ''}">${C.aside.map((b) => BLOCKS[b.type](b)).join('')}</div>`;
  // footer
  const logoV = D.logo || ({ ivory: 'Primary', linen: 'Primary', deep: 'Sand', shadow: 'Sand', maroon: 'Sand', photo: D.overlay === 'horizon' ? 'Sand' : 'White' })[env];
  let end = '';
  if (C.note) end = `<div class="foot-note">${rich(C.note)}</div>`;
  else if (TOTAL && D.counter !== false) end = `<div class="foot-end counter" dir="ltr"><b>${two(SLIDE)}</b>&nbsp;/&nbsp;${two(TOTAL)}${SLIDE < TOTAL ? ` <i class="lm"></i>` : ''}</div>`;
  else if (C.end !== '') end = `<div class="foot-end${C.endLower !== false ? ' lower' : ''}">${rich(C.end || '{contact.post_line}')}</div>`;
  if (D.noLogo) html += `<div class="foot">${end ? '<span></span>' + end : ''}</div>`;
  else if (D.footLockup) {
    // Lockup SVGs carry 14.05-unit clear space inside their viewBox; pull it back so the mark sits on the margin.
    const L = D.footLockup, vb = L.vb || [126.27, 74.21], w = L.w, h = w * vb[1] / vb[0];
    html += `<div class="foot"><img class="logo lockup" src="${LOCKUP(L.v)}" alt="SIRAJ" style="width:${w}px;margin-inline-start:${-14.05 / vb[0] * w}px;margin-bottom:${-14.05 / vb[1] * h}px">${end}</div>`;
  } else html += `<div class="foot"><img class="logo" src="${LOGO(logoV)}" alt="SIRAJ">${end}</div>`;
  cv.innerHTML = html;

  const $ = (s) => cv.querySelector(s);
  const content = $('.content');
  const foot = $('.foot');
  const cw = D.cw ? (W - 2 * M) * D.cw : W - 2 * M;

  function place() {
    const S = content.style;
    if (layout === 'hero') {
      S.insetInlineStart = M + 'px'; S.width = cw + 'px';
      S.bottom = (H - FOOT_TOP + FOOT_GAP) + 'px';
    } else if (layout === 'window') {
      const md = $('.media');
      const mTop = media.top != null ? media.top : (FORMAT === 'story' || FORMAT === 'reel' ? M : TOP); // imagery may sit under the story UI, text may not
      const mStart = media.start != null ? media.start : M, mEnd = media.end != null ? media.end : M;
      md.style.insetInlineStart = mStart + 'px'; md.style.insetInlineEnd = mEnd + 'px';
      S.insetInlineStart = M + 'px'; S.width = cw + 'px';
      if (media.placement === 'bottom') {
        S.top = (D.contentTop != null ? D.contentTop : TOP) + 'px';
        const cb = content.offsetTop + content.offsetHeight;
        const mt = cb + (media.gap != null ? media.gap : S5);
        md.style.top = mt + 'px';
        md.style.height = Math.max(120, FOOT_TOP - FOOT_GAP - mt) + 'px';
      } else {
        const mh = media.h <= 1 ? media.h * H : media.h;
        md.style.top = mTop + 'px'; md.style.height = mh + 'px';
        S.top = (mTop + mh + (media.gap != null ? media.gap : S5)) + 'px';
      }
    } else if (layout === 'split') {
      const md = $('.media');
      const mw = (media.w || 0.46) * W;
      const inset = media.inset != null ? media.inset : M;
      md.style.top = inset + 'px'; md.style.bottom = inset + 'px';
      md.style.insetInlineEnd = (media.end != null ? media.end : inset) + 'px'; md.style.width = mw + 'px';
      const colW = W - M - mw - (media.end != null ? media.end : inset) - (media.gutter || S5);
      S.insetInlineStart = M + 'px'; S.width = colW + 'px';
      if (D.anchor === 'bottom') S.bottom = (H - FOOT_TOP + FOOT_GAP) + 'px';
      else S.top = TOP + 'px';
      foot.style.insetInlineEnd = (W - M - colW) + 'px';
    } else { // type
      S.insetInlineStart = M + 'px'; S.width = cw + 'px';
      const a = D.anchor || 'top';
      if (a === 'bottom') S.bottom = (H - FOOT_TOP + FOOT_GAP) + 'px';
      else if (a === 'center') {
        const avail = FOOT_TOP - FOOT_GAP - TOP;
        S.top = (TOP + Math.max(0, (avail - content.offsetHeight) / 2) + (D.centerShift || 0)) + 'px';
      } else S.top = (D.contentTop != null ? D.contentTop : TOP) + 'px';
    }
  }

  function shapes() {
    const md = $('.media');
    if (!md) return;
    const w = md.offsetWidth, h = md.offsetHeight;
    const shape = media.shape || 'corner';
    if (shape === 'corner') md.style.clipPath = silkCornerPath(w, h, rtl, media.k || 0.4);
    if (shape === 'portal') md.style.clipPath = portalPath(w, h, rtl);
  }

  function overlays() {
    const ct = content.offsetTop;
    if (D.overlay === 'horizon') {
      const img = $('.horizon');
      const portrait = H > W;
      const sc = D.horizonScale || 1;
      const iw = W * sc, ih = portrait ? iw * 16 / 9 : iw * 9 / 16;
      const edge = ct - (D.horizonGap != null ? D.horizonGap : S5 * 1.1);
      const itop = edge - (D.horizonEdge || 0.80) * ih;   // the real-silk dunes rise well above the copy, so eyebrow and title always sit on fabric
      Object.assign(img.style, { width: iw + 'px', height: ih + 'px', left: (W - iw) / 2 + 'px', top: itop + 'px' });
      $('.horizon-fill').style.top = (itop + ih - 140) + 'px';
    }
    const sc = cv.querySelector('.scrim');
    if (D.overlay === 'scrim' && sc) {
      const a = D.scrimStrength || 0.9;
      const s0 = Math.max(0, ct - (D.scrimReach || 520));
      sc.style.background = `linear-gradient(to bottom, rgba(23,6,8,0) ${s0}px, rgba(23,6,8,${(a * 0.62).toFixed(2)}) ${ct - 40}px, rgba(23,6,8,${a}) ${H}px)` +
        (D.topScrim ? `, linear-gradient(to bottom, rgba(23,6,8,.42) 0, rgba(23,6,8,0) ${TOP + 160}px)` : '');
    } else if (D.topScrim && sc) {
      sc.style.background = `linear-gradient(to bottom, rgba(23,6,8,.42) 0, rgba(23,6,8,0) ${TOP + 160}px)`;
    }
  }

  // Shrink the headline until the content clears the logo zone (and the top safe line).
  function fit() {
    const title = content.querySelector('.title, .display, .quote');
    const limitBottom = (layout === 'split' ? FOOT_TOP - S4 : FOOT_TOP - S4);
    for (let i = 0; i < 10; i++) {
      place();
      const top = content.offsetTop, bottom = top + content.offsetHeight;
      const ok = bottom <= limitBottom + 0.5 && top >= TOP - 0.5;
      if (ok || !title) break;
      const fs = parseFloat(getComputedStyle(title).fontSize);
      title.style.fontSize = (fs * 0.95) + 'px';
    }
  }

  function qa() {
    const issues = [];
    const cr = cv.getBoundingClientRect();
    const top = content.offsetTop, bottom = top + content.offsetHeight;
    if (bottom > FOOT_TOP - S4 + 1) issues.push(`content bottom ${bottom} overlaps logo zone ${FOOT_TOP}`);
    if (top < TOP - 1) issues.push(`content top ${top} above safe top ${TOP}`);
    cv.querySelectorAll('.content *, .foot *').forEach((el) => {
      if (el.classList.contains('lm') || el.classList.contains('lockup')) return; // rotated Lumen tips / lockup clear space are optical overshoot
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      if (r.left < cr.left + M - 2 || r.right > cr.right - M + 2) issues.push(`${el.className || el.tagName} outside margins (${Math.round(r.left)}–${Math.round(r.right)})`);
      if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible') issues.push(`${el.className} clipped`);
    });
    if (FORMAT === 'reel') {
      const r = content.getBoundingClientRect(), f = foot.getBoundingClientRect();
      if (r.top < 240 || f.bottom > 1680) issues.push('reel content outside 1080×1440 centre crop');
    }
    cv.querySelectorAll('img').forEach((im) => { if (!im.complete || !im.naturalWidth) issues.push('missing image ' + im.getAttribute('src')); });
    return issues;
  }

  function guide() {
    if (!GUIDE) return;
    const g = document.createElement('div');
    g.innerHTML = `<div class="guide-shade" style="top:0;height:240px"></div><div class="guide-shade" style="bottom:0;height:240px"></div>
      <div class="guide" style="top:240px"></div><div class="guide" style="top:1680px"></div>
      <div class="guide-label" style="top:200px">Full-screen only · outside grid crop</div><div class="guide-label" style="top:262px;opacity:.9">Grid crop 1080 × 1440 · 3:4</div>
      <div class="guide-label" style="top:1708px">Full-screen only · outside grid crop</div>`;
    g.style.cssText = 'position:absolute;inset:0;pointer-events:none';
    cv.appendChild(g);
  }

  async function run() {
    await document.fonts.ready;
    await Promise.all([...cv.querySelectorAll('img')].map((im) => (im.complete ? Promise.resolve() : new Promise((r) => { im.onload = im.onerror = r; }))));
    await Promise.all([...cv.querySelectorAll('img')].map((im) => im.decode().catch(() => {})));
    fit(); place(); shapes(); overlays(); guide();
    window.__qa = qa();
    document.body.dataset.ready = '1';
  }
  run();
})();
