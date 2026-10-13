/* =============================================================================
   SIRAJ Presentation System v1.0 — deck.js
   1. Viewing shell: fit-to-width scroll view · P = present · ←/→ navigate · G = grid overlay
   2. Footer band (section + page number + wordmark) generated from data attributes
   3. Drawings rendered from editable data:  <svg data-chart='{…}'>, data-draw="map|site|plan"
   ========================================================================== */
(function () {
  'use strict';
  const doc = document.documentElement;
  const RTL = doc.dir === 'rtl';
  const LANG = RTL ? 'ar' : 'en';
  const params = new URLSearchParams(location.search);
  if (params.has('export')) doc.classList.add('export');
  if (params.has('grid')) doc.classList.add('show-grid');

  // Brand palette (mirrors design tokens — data colours 1–6 first)
  const C = {
    d1: '#602733', d2: '#AA9180', d3: '#3B3436', d4: '#C79A9C', d5: '#8E837D', d6: '#2C0F12',
    maroon: '#602733', deep: '#2C0F12', stone: '#AA9180', sand: '#D6C0B2', ivory: '#F7F2ED', linen: '#EFE7E0',
    graphite: '#3B3436', ash: '#6B625E', ink: '#140E10', hi: '#C79A9C', warm: '#8E837D', road: '#E3D8CF', water: '#E2D2C7'
  };
  const FONT = RTL ? "'SIRAJ Digits','Tajawal','Jost',sans-serif" : "'Jost','SIRAJ Digits','Tajawal',sans-serif";
  const NUMFONT = "'Jost','SIRAJ Digits',sans-serif";
  const fmt = (n, d = 0) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const r2 = (n) => Math.round(n * 100) / 100;
  const lumen = (x, y, s, fill = C.stone, extra = '') => `<rect x="${r2(x - s / 2)}" y="${r2(y - s / 2)}" width="${s}" height="${s}" fill="${fill}" transform="rotate(45 ${r2(x)} ${r2(y)})" ${extra}/>`;
  // SVG text is laid out with a physical (LTR) base so anchors stay predictable; Arabic runs are
  // wrapped in a right-to-left embedding (RLE … PDF) so mixed Arabic + numbers read correctly.
  const esc = (s) => { const t = String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); return RTL && /[\u0600-\u06FF]/.test(t) ? '\u202B' + t + '\u202C' : t; };
  const cap = (s) => (RTL ? s : String(s).toUpperCase());
  const capStyle = RTL ? '' : 'letter-spacing="0.16em"';

  // RTL: isolate "40%"-style figures so percentages read identically in Arabic and English
  if (RTL) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => { if (/\d%/.test(n.nodeValue) && !n.parentElement.closest('svg')) n.nodeValue = n.nodeValue.replace(/(\d[\d,.]*%)/g, '\u2066$1\u2069'); });
  }

  // ---------------------------------------------------------------- footer band
  const LOGO = { light: '../../01-Logos/SVG/SIRAJ_Logo_Primary_v1.0.svg', dark: '../../01-Logos/SVG/SIRAJ_Logo_Sand_v1.0.svg' };
  const slides = Array.from(document.querySelectorAll('.slide'));
  slides.forEach((s, i) => {
    s.id = s.id || 's' + (i + 1);
    // grid overlay
    const g = document.createElement('div');
    g.className = 'grid-overlay';
    let h = '';
    for (let c = 0; c < 12; c++) h += `<i style="left:calc(120px + ${c} * (var(--col) + 32px));width:var(--col)"></i>`;
    h += '<b style="top:96px"></b><b style="top:984px"></b><b style="top:1008px"></b><b style="top:1056px"></b>';
    g.innerHTML = h;
    s.appendChild(g);
    if (s.dataset.foot === 'none') return;
    const dark = s.matches('.slide--dark,.slide--deep,.slide--maroon') || s.dataset.foot === 'dark';
    const f = document.createElement('footer');
    f.className = 'foot' + (dark ? ' foot--on-dark' : '') + (s.dataset.footFrom === '8' ? ' foot--from-8' : '');
    const sec = s.dataset.section ? `<span class="sec"><span class="lumen"></span>${esc(s.dataset.section)}</span>` : '<span></span>';
    const mark = s.dataset.footMark === 'none' ? '' : `<img class="mark" src="${dark ? LOGO.dark : LOGO.light}" alt="SIRAJ">`;
    f.innerHTML = `${sec}<span class="end"><span class="pg num">${String(i + 1).padStart(2, '0')}</span>${mark}</span>`;
    s.appendChild(f);
  });

  // ---------------------------------------------------------------- viewing shell
  let cur = 0;
  function fit() {
    if (doc.classList.contains('export')) return;
    const deck = document.querySelector('.deck');
    if (doc.classList.contains('present')) {
      deck.style.setProperty('--z', Math.min(innerWidth / 1920, innerHeight / 1080));
    } else {
      deck.style.setProperty('--z', Math.min(1, (innerWidth - 48) / 1920));
    }
  }
  function show(i) {
    cur = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, k) => s.classList.toggle('is-current', k === cur));
    if (!doc.classList.contains('present')) slides[cur].scrollIntoView({ block: 'center' });
  }
  addEventListener('resize', fit);
  addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    const fwd = RTL ? 'arrowleft' : 'arrowright', back = RTL ? 'arrowright' : 'arrowleft';
    if (k === 'g') doc.classList.toggle('show-grid');
    else if (k === 'p') { doc.classList.toggle('present'); fit(); show(cur); }
    else if (k === 'escape') { doc.classList.remove('present'); fit(); }
    else if ([fwd, 'pagedown', ' '].includes(k)) { e.preventDefault(); show(cur + 1); }
    else if ([back, 'pageup'].includes(k)) { e.preventDefault(); show(cur - 1); }
    else if (k === 'home') show(0);
    else if (k === 'end') show(slides.length - 1);
  });
  fit();
  slides[0] && slides[0].classList.add('is-current');

  // =============================================================================
  // Charts — hairline gridlines, light Jost numerals, direct labels, Lumen marks key points.
  // =============================================================================
  const X = (W) => (x) => (RTL ? W - x : x);              // mirror for RTL
  const anchor = (a) => (RTL ? ({ start: 'end', end: 'start', middle: 'middle' })[a] : a);

  function barChart(o) {
    const W = o.w || 824, H = o.h || 480;
    const pad = { l: 64, r: 8, t: 64, b: 64 };
    const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
    const max = o.yMax, step = o.yStep;
    const x = X(W);
    const y = (v) => pad.t + ph - (v / max) * ph;
    let s = '';
    for (let v = 0; v <= max; v += step) {
      const yy = r2(y(v));
      s += `<line x1="${x(pad.l)}" x2="${x(W - pad.r)}" y1="${yy}" y2="${yy}" stroke="${v === 0 ? C.graphite : C.stone}" stroke-opacity="${v === 0 ? 1 : 0.55}" stroke-width="1"/>`;
      if (v > 0) s += `<text x="${x(pad.l - 18)}" y="${yy + 6}" text-anchor="${anchor('end')}" font-family="${NUMFONT}" font-weight="300" font-size="18" fill="${C.ash}">${v}</text>`;
    }
    const n = o.values.length, band = pw / n, bw = Math.min(64, band * 0.5);
    o.values.forEach((v, i) => {
      const cx = pad.l + band * (i + 0.5);
      const hl = o.highlight === i;
      const top = y(v);
      const fill = hl ? C.maroon : (o.color || C.stone);
      const bx = RTL ? W - cx - bw / 2 : cx - bw / 2;
      s += `<rect x="${r2(bx)}" y="${r2(top)}" width="${r2(bw)}" height="${r2(y(0) - top)}" fill="${fill}"/>`;
      s += `<text x="${r2(x(cx))}" y="${r2(top - 16)}" text-anchor="middle" font-family="${NUMFONT}" font-weight="${hl ? 400 : 300}" font-size="24" fill="${hl ? C.ink : C.graphite}">${fmt(v)}</text>`;
      if (hl) s += lumen(x(cx), top - 60, 11);
      s += `<text x="${r2(x(cx))}" y="${r2(y(0) + 38)}" text-anchor="middle" font-family="${FONT}" font-weight="400" font-size="${RTL ? 19 : 17}" ${capStyle} fill="${C.ash}">${esc(cap(o.labels[i]))}</text>`;
    });
    return { W, H, s };
  }

  function lineChart(o) {
    const W = o.w || 824, H = o.h || 480;
    const pad = { l: 72, r: o.padR || 230, t: 40, b: 64 };
    const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
    const x = X(W);
    const n = o.labels.length;
    const px = (i) => pad.l + (pw * i) / (n - 1);
    const py = (v) => pad.t + ph - ((v - o.yMin) / (o.yMax - o.yMin)) * ph;
    let s = '';
    for (let v = o.yMin; v <= o.yMax; v += o.yStep) {
      const yy = r2(py(v));
      s += `<line x1="${x(pad.l)}" x2="${x(W - pad.r + 24)}" y1="${yy}" y2="${yy}" stroke="${v === o.yMin ? C.graphite : C.stone}" stroke-opacity="${v === o.yMin ? 1 : 0.55}"/>`;
      if (v > o.yMin || o.showMin) s += `<text x="${x(pad.l - 18)}" y="${yy + 6}" text-anchor="${anchor('end')}" font-family="${NUMFONT}" font-weight="300" font-size="18" fill="${C.ash}">${fmt(v)}</text>`;
    }
    o.labels.forEach((l, i) => {
      s += `<text x="${r2(x(px(i)))}" y="${r2(py(o.yMin) + 38)}" text-anchor="middle" font-family="${NUMFONT}" font-weight="400" font-size="18" ${RTL ? '' : 'letter-spacing="0.08em"'} fill="${C.ash}">${esc(l)}</text>`;
    });
    o.series.forEach((se, k) => {
      const pts = se.values.map((v, i) => `${r2(x(px(i)))},${r2(py(v))}`).join(' ');
      s += `<polyline points="${pts}" fill="none" stroke="${se.color}" stroke-width="${k === 0 ? 3 : 2}" stroke-linejoin="round" stroke-linecap="round"/>`;
      se.values.forEach((v, i) => { s += `<circle cx="${r2(x(px(i)))}" cy="${r2(py(v))}" r="${k === 0 ? 5 : 4}" fill="${C.ivory}" stroke="${se.color}" stroke-width="2"/>`; });
      const last = se.values[se.values.length - 1];
      const lx = x(px(n - 1) + 24), ly = py(last) + (se.dy || 0);
      s += `<text x="${r2(lx)}" y="${r2(ly - 2)}" text-anchor="${anchor('start')}" font-family="${NUMFONT}" font-weight="300" font-size="26" fill="${C.ink}">${fmt(last)}</text>`;
      s += `<text x="${r2(lx)}" y="${r2(ly + 24)}" text-anchor="${anchor('start')}" font-family="${FONT}" font-weight="400" font-size="${RTL ? 18 : 16}" fill="${C.ash}">${esc(se.name)}</text>`;
    });
    if (o.marker) {
      const m = o.marker, mx = x(px(m.i)), my = py(m.v);
      const base = py(m.from);
      s += `<line x1="${r2(mx)}" x2="${r2(mx)}" y1="${r2(base - 8)}" y2="${r2(my + 12)}" stroke="${C.maroon}" stroke-width="1" stroke-dasharray="3 4"/>`;
      s += lumen(mx, my, 16, C.stone);
      const tx = x(px(m.i) + 24);
      s += `<text x="${r2(tx)}" y="${r2(my + 2)}" text-anchor="${anchor('start')}" font-family="${NUMFONT}" font-weight="400" font-size="26" fill="${C.maroon}">${fmt(m.v)}</text>`;
      s += `<text x="${r2(tx)}" y="${r2(my + 26)}" text-anchor="${anchor('start')}" font-family="${FONT}" font-weight="500" font-size="${RTL ? 18 : 14}" ${capStyle} fill="${C.maroon}">${esc(cap(m.label))}</text>`;
      if (m.delta) s += `<text x="${r2(x(px(m.i) - 14))}" y="${r2((my + base) / 2 + 8)}" text-anchor="${anchor('end')}" font-family="${NUMFONT}" font-weight="400" font-size="18" fill="${C.maroon}">${esc(m.delta)}</text>`;
    }
    return { W, H, s };
  }

  // 100 % stacked horizontal bars — the brand's alternative to a donut.
  // Row label column at the start, direct category labels above the first row, share below each segment.
  function stackChart(o) {
    const W = o.w || 1680, rowH = o.rowH || 72, gap = 4;
    const LW = o.labelW || 285;                    // label column (2 grid columns + gutter)
    const BW = W - LW;
    const top = 56, rowGap = o.rowGap || 112;
    const cols = o.colors || [C.d1, C.d2, C.d3, C.d4, C.d5, C.d6];
    const dark = [true, false, true, false, true, true];
    const bx = (x, w) => (RTL ? BW - x - w : LW + x);   // bar-space → svg x (RTL: bars on the left)
    const lx = RTL ? W : 0, la = RTL ? 'end' : 'start';
    let s = '', y = top;
    o.rows.forEach((row, ri) => {
      const total = row.values.reduce((a, b) => a + b, 0);
      const usable = BW - gap * (row.values.length - 1);
      s += `<text x="${lx}" y="${y + 18}" text-anchor="${la}" font-family="${FONT}" font-weight="500" font-size="${RTL ? 19 : 15}" ${capStyle} fill="${C.ash}">${esc(cap(row.label))}</text>`;
      s += `<text x="${lx}" y="${y + rowH - 4}" text-anchor="${la}" font-family="${NUMFONT}" font-weight="300" font-size="34" fill="${C.ink}">${esc(row.total || '')}</text>`;
      let acc = 0;
      row.values.forEach((v, i) => {
        const w = (v / total) * usable;
        const rx = bx(acc, w);
        acc += w + gap;
        s += `<rect x="${r2(rx)}" y="${y}" width="${r2(w)}" height="${rowH}" fill="${cols[i]}"/>`;
        const txt = row.display ? row.display[i] : fmt(v);
        const fill = dark[i] ? C.ivory : C.ink;
        const inStart = RTL ? rx + w - 16 : rx + 16;
        if (w > 44) s += `<text x="${r2(inStart)}" y="${y + rowH / 2 + 10}" text-anchor="${la}" font-family="${NUMFONT}" font-weight="300" font-size="${w > 150 ? 28 : 24}" fill="${fill}">${esc(txt)}</text>`;
        const pct = row.pct ? row.pct[i] : Math.round((v / total) * 100);
        const narrowEnd = i === row.values.length - 1 && w < 120;
        const px = narrowEnd ? (RTL ? rx : rx + w) : (RTL ? rx + w : rx);
        const pa = narrowEnd ? (RTL ? 'start' : 'end') : la;
        s += `<text x="${r2(px)}" y="${y + rowH + 30}" text-anchor="${pa}" font-family="${NUMFONT}" font-weight="400" font-size="18" fill="${C.ash}">${pct}%</text>`;
        if (ri === 0 && o.cats) {
          const lastNarrow = i === row.values.length - 1 && w < 260;
          const cx = lastNarrow ? (RTL ? rx : rx + w) : (RTL ? rx + w : rx);
          const ca = lastNarrow ? (RTL ? 'start' : 'end') : la;
          s += `<text x="${r2(cx)}" y="${y - 22}" text-anchor="${ca}" font-family="${FONT}" font-weight="400" font-size="${RTL ? 24 : 22}" fill="${C.ink}">${esc(o.cats[i])}</text>`;
        }
      });
      y += rowH + rowGap;
    });
    return { W, H: y - rowGap + 44, s };
  }

  // =============================================================================
  // Location map — stylised Muscat coast (lon/lat projected, ~34 px per km)
  // =============================================================================
  function drawMap(o) {
    const W = o.w || 1110, H = o.h || 860;
    const K = 3434, KL = 3774;                       // px per degree lon / lat
    const ref = { lon: 58.43, lat: 23.592, x: 560, y: o.refY || 470 };
    const P = (lon, lat) => [r2(ref.x + (lon - ref.lon) * K), r2(ref.y - (lat - ref.lat) * KL)];
    const line = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + P(p[0], p[1]).join(',')).join(' ');
    const smooth = (pts) => {
      const q = pts.map((p) => P(p[0], p[1]));
      let d = `M${q[0][0]},${q[0][1]}`;
      for (let i = 0; i < q.length - 1; i++) {
        const p0 = q[i - 1] || q[i], p1 = q[i], p2 = q[i + 1], p3 = q[i + 2] || p2;
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C${r2(c1[0])},${r2(c1[1])} ${r2(c2[0])},${r2(c2[1])} ${p2[0]},${p2[1]}`;
      }
      return d;
    };
    const coast = [[58.20, 23.668], [58.25, 23.648], [58.30, 23.632], [58.35, 23.622], [58.39, 23.614], [58.42, 23.609], [58.445, 23.608], [58.465, 23.614], [58.482, 23.625], [58.50, 23.632], [58.52, 23.629], [58.54, 23.622], [58.56, 23.623], [58.58, 23.629], [58.62, 23.625]];
    const coastD = smooth(coast);
    let s = '';
    // sea: fine horizontal hatch, clipped above the coast
    s += `<defs><clipPath id="mapclip"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath>`;
    s += `<clipPath id="sea">${'<path d="' + coastD + ` L${W + 40},-40 L-40,-40 Z"/>`}</clipPath></defs>`;
    s += `<g clip-path="url(#mapclip)">`;
    s += `<rect width="${W}" height="${H}" fill="${C.ivory}"/>`;
    s += `<g clip-path="url(#sea)"><rect width="${W}" height="${H}" fill="${C.linen}"/>`;
    for (let yy = 6; yy < H; yy += 12) s += `<line x1="0" x2="${W}" y1="${yy}" y2="${yy}" stroke="${C.stone}" stroke-opacity=".22" stroke-width="1"/>`;
    s += `</g>`;
    // mountains: topographic contours (Hajar foothills + Qurum / Muttrah heights)
    const contour = (cx, cy, rx, ry, n, rot, seed) => {
      let out = '';
      for (let k = 0; k < n; k++) {
        const f = 1 - k / n;
        let d = '';
        for (let a = 0; a <= 64; a++) {
          const t = (a / 64) * Math.PI * 2;
          const wob = 1 + 0.10 * Math.sin(3 * t + seed) + 0.06 * Math.sin(5 * t + seed * 2) + 0.04 * Math.cos(7 * t + k);
          const px = rx * f * wob * Math.cos(t), py = ry * f * wob * Math.sin(t);
          const xr = px * Math.cos(rot) - py * Math.sin(rot), yr = px * Math.sin(rot) + py * Math.cos(rot);
          d += (a ? 'L' : 'M') + r2(cx + xr) + ',' + r2(cy + yr);
        }
        out += `<path d="${d}Z" fill="none" stroke="${C.stone}" stroke-opacity="${0.35 + 0.25 * (k / n)}" stroke-width="1"/>`;
      }
      return out;
    };
    s += contour(...P(58.507, 23.592), 84, 46, 5, -0.35, 1.2);
    s += contour(...P(58.578, 23.596), 100, 60, 6, 0.2, 2.4);
    s += contour(...P(58.33, 23.528), 250, 72, 7, -0.05, 0.7);
    s += contour(...P(58.50, 23.535), 230, 66, 7, 0.08, 3.1);
    // coastline
    s += `<path d="${coastD}" fill="none" stroke="${C.maroon}" stroke-width="2"/>`;
    // roads
    const sqs = [[58.24, 23.600], [58.29, 23.597], [58.34, 23.592], [58.39, 23.588], [58.43, 23.589], [58.46, 23.594], [58.49, 23.603], [58.515, 23.607], [58.545, 23.608], [58.57, 23.615]];
    const exw = [[58.24, 23.570], [58.30, 23.566], [58.36, 23.562], [58.42, 23.561], [58.47, 23.563], [58.51, 23.567], [58.535, 23.575]];
    s += `<path d="${smooth(exw)}" fill="none" stroke="${C.stone}" stroke-width="2" stroke-dasharray="10 6"/>`;
    s += `<path d="${smooth(sqs)}" fill="none" stroke="${C.graphite}" stroke-width="3"/>`;
    // distance rings around Noor
    const N = P(58.43, 23.594);
    [2, 5].forEach((km) => {
      const rr = km * 34;
      s += `<circle cx="${N[0]}" cy="${N[1]}" r="${rr}" fill="none" stroke="${C.maroon}" stroke-opacity=".45" stroke-width="1" stroke-dasharray="2 6"/>`;
      s += `<text x="${N[0]}" y="${r2(N[1] + rr + 22)}" text-anchor="middle" font-family="${NUMFONT}" font-size="15" font-weight="500" letter-spacing="0.12em" fill="${C.maroon}" fill-opacity=".8">${km} KM</text>`;
    });
    // labels: water + districts
    s += `<text x="${P(58.33, 23.70)[0]}" y="${P(58.33, 23.70)[1]}" font-family="${NUMFONT}" font-style="italic" font-weight="300" font-size="30" letter-spacing="0.3em" fill="${C.ash}">GULF OF OMAN</text>`;
    const dist = [['SEEB', 58.30, 23.618], ['AL GHUBRAH', 58.335, 23.612], ['QURUM', 58.492, 23.584], ['RUWI', 58.548, 23.592], ['BAWSHAR', 58.39, 23.552]];
    dist.forEach(([t, lo, la]) => { const p = P(lo, la); s += `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" font-family="${NUMFONT}" font-size="14" font-weight="500" letter-spacing="0.24em" fill="${C.warm}">${t}</text>`; });
    s += `<text x="${P(58.298, 23.5965)[0]}" y="${P(58.298, 23.5965)[1] + 30}" font-family="${NUMFONT}" font-size="13" font-weight="500" letter-spacing="0.14em" fill="${C.graphite}">SULTAN QABOOS STREET</text>`;
    s += `<text x="${P(58.285, 23.567)[0]}" y="${P(58.285, 23.567)[1] + 28}" font-family="${NUMFONT}" font-size="13" font-weight="500" letter-spacing="0.14em" fill="${C.ash}">MUSCAT EXPRESSWAY</text>`;
    // landmarks (pins = Lumen heads)
    const lm = o.landmarks || [];
    lm.forEach((m) => {
      const p = P(m.lon, m.lat);
      s += `<line x1="${p[0]}" y1="${p[1]}" x2="${p[0]}" y2="${p[1] - 26}" stroke="${C.graphite}" stroke-width="1"/>`;
      s += lumen(p[0], p[1] - 30, 12, C.maroon);
      s += `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="${C.graphite}"/>`;
      const a = m.side === 'l' ? 'end' : 'start', dx = m.side === 'l' ? -16 : 16, dy = m.dy || 0;
      s += `<text x="${p[0] + dx}" y="${p[1] - 32 + dy}" text-anchor="${a}" font-family="${NUMFONT}" font-size="18" font-weight="400" fill="${C.ink}">${esc(m.n)}</text>`;
      s += `<text x="${p[0] + dx}" y="${p[1] - 10 + dy}" text-anchor="${a}" font-family="${NUMFONT}" font-size="15" font-weight="300" fill="${C.ash}">${esc(m.t)}</text>`;
    });
    // Noor — halo + large Lumen
    s += `<circle cx="${N[0]}" cy="${N[1]}" r="46" fill="url(#halo)"/>`;
    s = s.replace('</defs>', `<radialGradient id="halo"><stop offset="0" stop-color="${C.stone}" stop-opacity=".55"/><stop offset="1" stop-color="${C.stone}" stop-opacity="0"/></radialGradient></defs>`);
    s += lumen(N[0], N[1], 22, C.maroon);
    s += lumen(N[0], N[1], 8, C.sand);
    const cl = [N[0] - 40, N[1] - 210];
    s += `<polyline points="${N[0] - 6},${N[1] - 16} ${cl[0]},${cl[1] + 8} ${cl[0] - 18},${cl[1] + 8}" fill="none" stroke="${C.maroon}" stroke-width="1"/>`;
    s += `<text x="${cl[0] - 28}" y="${cl[1] + 2}" text-anchor="end" font-family="${NUMFONT}" font-size="20" font-weight="500" letter-spacing="0.16em" fill="${C.maroon}">NOOR RESIDENCES</text>`;
    s += `<text x="${cl[0] - 28}" y="${cl[1] + 28}" text-anchor="end" font-family="${NUMFONT}" font-size="17" font-weight="300" fill="${C.graphite}">Al Khuwair · Sultan Qaboos Street</text>`;
    // off-map pointer (Al Mouj, west)
    if (o.offmap) o.offmap.forEach((m) => {
      const yy = m.y;
      s += `<line x1="16" x2="64" y1="${yy}" y2="${yy}" stroke="${C.graphite}"/><path d="M16,${yy} l10,-6 M16,${yy} l10,6" stroke="${C.graphite}" fill="none"/>`;
      s += `<text x="76" y="${yy - 4}" font-family="${NUMFONT}" font-size="18" fill="${C.ink}">${esc(m.n)}</text><text x="76" y="${yy + 18}" font-family="${NUMFONT}" font-size="15" font-weight="300" fill="${C.ash}">${esc(m.t)}</text>`;
    });
    // north arrow + scale bar
    const nx = W - 56, ny = H - 120;
    s += `<g transform="translate(${nx},${ny})"><line x1="0" y1="28" x2="0" y2="-28" stroke="${C.graphite}"/><path d="M0,-34 L-7,-18 L0,-22 L7,-18 Z" fill="${C.graphite}"/><text y="52" text-anchor="middle" font-family="${NUMFONT}" font-size="14" font-weight="500" fill="${C.graphite}">N</text></g>`;
    const sx = W - 56 - 170, sy = H - 34;
    s += `<g transform="translate(${sx},${sy})"><rect width="68" height="5" fill="${C.graphite}"/><rect x="68" width="102" height="5" fill="none" stroke="${C.graphite}"/>`;
    s += `<text y="-10" font-family="${NUMFONT}" font-size="13" fill="${C.ash}">0</text><text x="68" y="-10" text-anchor="middle" font-family="${NUMFONT}" font-size="13" fill="${C.ash}">2</text><text x="170" y="-10" text-anchor="middle" font-family="${NUMFONT}" font-size="13" fill="${C.ash}">5 km</text></g>`;
    s += `</g>`;
    return { W, H, s };
  }

  // =============================================================================
  // Masterplan — stylised site plan (metres → px)
  // =============================================================================
  function drawSite(o) {
    const W = o.w || 1110, H = o.h || 860;
    const k = o.scale || 9.6, ox = o.ox || 120, oy = o.oy || 60;  // px per metre, origin
    const m = (v) => r2(v * k);
    const R = (x, y, w, h, attrs) => `<rect x="${r2(ox + x * k)}" y="${r2(oy + y * k)}" width="${m(w)}" height="${m(h)}" ${attrs}/>`;
    const pt = (x, y) => `${r2(ox + x * k)},${r2(oy + y * k)}`;
    let s = `<defs><pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(51)"><line x1="0" y1="0" x2="0" y2="10" stroke="${C.stone}" stroke-width="1" stroke-opacity=".7"/></pattern>`;
    s += `<pattern id="hatch2" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-39)"><line x1="0" y1="0" x2="0" y2="7" stroke="${C.graphite}" stroke-width="1" stroke-opacity=".35"/></pattern></defs>`;
    // context: roads around the plot
    s += `<rect width="${W}" height="${H}" fill="${C.ivory}"/>`;
    s += `<clipPath id="siteclip"><rect width="${W}" height="${H}"/></clipPath><g clip-path="url(#siteclip)">`;
    s += R(-30, 78, 140, 16, `fill="${C.road}"`);           // Sultan Qaboos St service road
    s += R(80, -30, 10, 108, `fill="${C.road}"`);           // east way
    s += R(-30, -8, 110, 8, `fill="${C.road}"`);            // north way
    s += `<line x1="0" x2="${W}" y1="${r2(oy + 86 * k)}" y2="${r2(oy + 86 * k)}" stroke="${C.ivory}" stroke-width="2" stroke-dasharray="14 12"/>`;
    // neighbouring blocks
    s += R(-30, 4, 24, 34, `fill="url(#hatch2)"`) + R(-30, 44, 24, 30, `fill="url(#hatch2)"`) + R(94, 4, 30, 34, `fill="url(#hatch2)"`) + R(94, 44, 30, 30, `fill="url(#hatch2)"`) + R(-30, -40, 108, 28, `fill="url(#hatch2)"`) + R(94, -40, 30, 40, `fill="url(#hatch2)"`);
    // plot
    s += R(0, 4, 76, 68, `fill="${C.ivory}" stroke="${C.maroon}" stroke-width="1.5" stroke-dasharray="8 6"`);
    // garden (landscape) with a silk-line path
    s += R(4, 8, 22, 36, `fill="${C.linen}"`);
    s += `<path d="M${pt(6, 42)} C${pt(14, 34)} ${pt(8, 22)} ${pt(16, 16)} S${pt(22, 10)} ${pt(25, 9)}" fill="none" stroke="${C.stone}" stroke-width="3" stroke-linecap="round"/>`;
    const trees = [[8, 12, 2.4], [12, 26, 3], [20, 30, 2.6], [7, 34, 2.2], [21, 20, 2.2], [18, 39, 2], [10, 19, 1.8], [23, 13, 1.6], [71, 9, 2.2], [71, 16, 1.8], [64, 67, 2], [71, 67, 2], [27, 66, 1.8], [30, 70, 1.4]];
    trees.forEach(([x, y, r]) => { s += `<circle cx="${r2(ox + x * k)}" cy="${r2(oy + y * k)}" r="${m(r)}" fill="${C.ivory}" stroke="${C.stone}" stroke-width="1.2"/><circle cx="${r2(ox + x * k)}" cy="${r2(oy + y * k)}" r="1.5" fill="${C.stone}"/>`; });
    // play area
    s += R(6, 46, 14, 10, `fill="url(#hatch)" stroke="${C.stone}"`);
    // podium edge + tower footprint with one silk corner (top-end)
    s += R(28, 8, 38, 38, `fill="${C.linen}" stroke="${C.graphite}" stroke-width="1" stroke-dasharray="2 4"`);
    const tx = 32, ty = 12, tw = 30, th = 28, rc = 9;
    s += `<path d="M${pt(tx, ty)} H${r2(ox + (tx + tw - rc) * k)} C${pt(tx + tw - rc * 0.25, ty)} ${pt(tx + tw, ty + rc * 0.45)} ${pt(tx + tw, ty + rc)} V${r2(oy + (ty + th) * k)} H${r2(ox + tx * k)} Z" fill="${C.maroon}"/>`;
    // core + structural grid inside tower
    s += R(43, 21, 8, 10, `fill="none" stroke="${C.sand}" stroke-opacity=".7"`);
    // pool deck & pool (silk-corner echo)
    s += R(30, 50, 32, 14, `fill="${C.linen}"`);
    s += `<path d="M${pt(33, 53)} H${r2(ox + 54 * k)} C${pt(57, 53)} ${pt(59, 55)} ${pt(59, 58)} V${r2(oy + 61 * k)} H${r2(ox + 33 * k)} Z" fill="${C.water}" stroke="${C.stone}" stroke-width="1"/>`;
    for (let i = 0; i < 3; i++) s += `<path d="M${pt(36, 56 + i * 1.5)} q${m(3)},-${m(0.6)} ${m(6)},0 t${m(6)},0 t${m(6)},0" fill="none" stroke="${C.ivory}" stroke-width="1.2" stroke-opacity=".9"/>`;
    // arrival court: drop-off loop from the south road
    const cx = 14, cy = 64;
    s += `<path d="M${pt(8, 76)} L${pt(8, 66)} A${m(6)},${m(6)} 0 1 1 ${pt(20, 66)} L${pt(20, 76)}" fill="none" stroke="${C.road}" stroke-width="${m(4)}"/>`;
    s += `<circle cx="${r2(ox + cx * k)}" cy="${r2(oy + 65 * k)}" r="${m(2.6)}" fill="${C.water}" stroke="${C.stone}"/>`;
    s += `<path d="M${pt(20, 62)} L${pt(30, 46)}" stroke="${C.stone}" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    // car park ramp (east)
    s += R(68, 30, 6, 30, `fill="url(#hatch2)" stroke="${C.graphite}" stroke-width="1"`);
    s += `<path d="M${pt(71, 56)} L${pt(71, 36)}" stroke="${C.graphite}" stroke-width="1.5"/><path d="M${pt(69.6, 38)} L${pt(71, 35)} L${pt(72.4, 38)}" fill="none" stroke="${C.graphite}" stroke-width="1.5"/>`;
    // retail / café pavilion on the frontage
    s += R(36, 66, 22, 5, `fill="${C.deep}" fill-opacity=".85"`);
    // entrances
    const arrow = (x, y, dir) => {
      const [a, b] = dir === 'up' ? [[x, y + 4], [x, y]] : [[x + 4, y], [x, y]];
      return `<line x1="${r2(ox + a[0] * k)}" y1="${r2(oy + a[1] * k)}" x2="${r2(ox + b[0] * k)}" y2="${r2(oy + b[1] * k)}" stroke="${C.maroon}" stroke-width="2"/>` + lumen(ox + b[0] * k, oy + b[1] * k, 9, C.maroon);
    };
    s += arrow(14, 77, 'up') + arrow(71, 77, 'up') + arrow(47, 77, 'up');
    // numbered keys
    const keys = o.keys || [];
    keys.forEach((kk) => {
      const x = ox + kk.x * k, y = oy + kk.y * k;
      s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="16" fill="${kk.dark ? C.ivory : C.maroon}"/>`;
      s += `<text x="${r2(x)}" y="${r2(y + 6)}" text-anchor="middle" font-family="${NUMFONT}" font-size="17" font-weight="500" fill="${kk.dark ? C.maroon : C.ivory}">${kk.n}</text>`;
    });
    // road names
    s += `<text x="${r2(ox + 38 * k)}" y="${r2(oy + 82 * k + 5)}" text-anchor="middle" font-family="${NUMFONT}" font-size="14" font-weight="500" letter-spacing="0.2em" fill="${C.graphite}">SULTAN QABOOS STREET · SERVICE ROAD</text>`;
    s += `<text transform="translate(${r2(ox + 85 * k + 5)},${r2(oy + 40 * k)}) rotate(90)" text-anchor="middle" font-family="${NUMFONT}" font-size="13" font-weight="500" letter-spacing="0.2em" fill="${C.ash}">WAY 3021</text>`;
    s += `<text x="${r2(ox + 30 * k)}" y="${r2(oy - 4 * k + 5)}" text-anchor="middle" font-family="${NUMFONT}" font-size="13" font-weight="500" letter-spacing="0.2em" fill="${C.ash}">WAY 3019</text>`;
    s += `</g>`;
    // north + scale
    const nx = W - 28, ny = 52;
    s += `<g transform="translate(${nx},${ny})"><line x1="0" y1="26" x2="0" y2="-26" stroke="${C.graphite}"/><path d="M0,-32 L-7,-16 L0,-20 L7,-16 Z" fill="${C.graphite}"/><text y="50" text-anchor="middle" font-family="${NUMFONT}" font-size="14" font-weight="500" fill="${C.graphite}">N</text></g>`;
    const sx = W - 40 - m(20), sy = H - 14;
    s += `<g transform="translate(${r2(sx)},${sy})"><rect width="${m(10)}" height="5" fill="${C.graphite}"/><rect x="${m(10)}" width="${m(10)}" height="5" fill="none" stroke="${C.graphite}"/><text y="-10" font-family="${NUMFONT}" font-size="13" fill="${C.ash}">0</text><text x="${m(10)}" y="-10" text-anchor="middle" font-family="${NUMFONT}" font-size="13" fill="${C.ash}">10</text><text x="${m(20)}" y="-10" text-anchor="middle" font-family="${NUMFONT}" font-size="13" fill="${C.ash}">20 m</text></g>`;
    return { W, H, s };
  }

  // =============================================================================
  // Floor plan — Type B two-bedroom (metres → px). Labels in EN / AR.
  // =============================================================================
  const PLAN_T = {
    en: { living: 'Living & dining', kitchen: 'Kitchen', master: 'Master bedroom', bed2: 'Bedroom 2', ensuite: 'Ensuite', dress: 'Dressing', bath: 'Bath', laundry: 'Laundry', entry: 'Entry', balcony: 'Balcony', m: 'm', m2: 'm²' },
    ar: { living: 'المعيشة والطعام', kitchen: 'المطبخ', master: 'غرفة النوم الرئيسية', bed2: 'غرفة النوم 2', ensuite: 'حمّام خاص', dress: 'الملابس', bath: 'حمّام', laundry: 'غسيل', entry: 'المدخل', balcony: 'الشرفة', m: 'م', m2: 'م²' }
  };
  function drawPlan(o) {
    const T = PLAN_T[LANG];
    const W = o.w || 1110, H = o.h || 860;
    const k = o.scale || 60, ox = o.ox || 150, oy = o.oy || 110;
    const X0 = (x) => r2(ox + x * k), Y0 = (y) => r2(oy + y * k);
    const L = (x1, y1, x2, y2, a) => `<line x1="${X0(x1)}" y1="${Y0(y1)}" x2="${X0(x2)}" y2="${Y0(y2)}" ${a}/>`;
    const RR = (x, y, w, h, a) => `<rect x="${X0(x)}" y="${Y0(y)}" width="${r2(w * k)}" height="${r2(h * k)}" ${a}/>`;
    const ext = `stroke="${C.ink}" stroke-width="${r2(0.24 * k)}" stroke-linecap="square"`;
    const int = `stroke="${C.graphite}" stroke-width="${r2(0.12 * k)}" stroke-linecap="square"`;
    const fur = `fill="none" stroke="${C.warm}" stroke-width="1.2"`;
    const thin = `stroke="${C.graphite}" stroke-width="1.2" fill="none"`;
    let s = `<rect width="${W}" height="${H}" fill="none"/>`;
    // floor tint for wet rooms & balcony
    s += RR(0, 0, 2.2, 4.2, `fill="${C.linen}"`) + RR(11.6, 0, 2.4, 3.6, `fill="${C.linen}"`);
    s += RR(3.4, 8.7, 7.8, 1.8, `fill="${C.linen}"`);
    s += `<g opacity=".9">`;
    for (let x = 3.4 + 0.6; x < 11.2; x += 0.6) s += L(x, 8.85, x, 10.5, `stroke="${C.stone}" stroke-opacity=".5" stroke-width="1"`);
    s += `</g>`;
    s += L(3.4, 10.5, 11.2, 10.5, `stroke="${C.graphite}" stroke-width="3"`) + L(3.4, 8.7, 3.4, 10.5, `stroke="${C.graphite}" stroke-width="3"`) + L(11.2, 8.7, 11.2, 10.5, `stroke="${C.graphite}" stroke-width="3"`);
    // ---- furniture (thin, warm grey)
    // bedroom 2
    s += RR(0.15, 5.6, 2.0, 1.6, fur) + RR(0.25, 5.72, 0.42, 0.62, fur) + RR(0.25, 6.46, 0.42, 0.62, fur) + L(0.8, 5.6, 0.8, 7.2, `stroke="${C.warm}" stroke-width="1.2"`);
    s += RR(0.15, 4.32, 2.05, 0.6, fur) + L(0.15, 4.32, 2.2, 4.92, `stroke="${C.warm}" stroke-width=".8"`);
    // living: sofa, armchairs, coffee table, media unit, dining table
    s += RR(3.55, 5.3, 0.9, 2.6, fur) + RR(3.55, 5.3, 0.25, 2.6, fur);
    s += RR(4.95, 5.95, 0.8, 1.3, fur);
    s += RR(4.75, 5.15, 4.2, 3.2, `fill="none" stroke="${C.stone}" stroke-width="1" stroke-dasharray="2 4"`);
    s += RR(9.25, 5.6, 0.3, 2.2, fur);
    s += RR(5.3, 3.6, 2.4, 1.0, fur);
    [[5.6, 3.25], [6.35, 3.25], [7.1, 3.25], [5.6, 4.75], [6.35, 4.75], [7.1, 4.75]].forEach(([x, y]) => { s += RR(x, y, 0.5, 0.4, fur); });
    // kitchen: counter + island + hob + sink
    s += RR(4.7, 0.06, 4.8, 0.62, fur) + RR(5.8, 1.6, 2.6, 0.75, fur);
    [[6.0, 0.37], [6.45, 0.37]].forEach(([x, y]) => { s += `<circle cx="${X0(x)}" cy="${Y0(y)}" r="${r2(0.16 * k)}" ${fur}/>`; });
    s += RR(7.6, 0.16, 0.9, 0.42, fur);
    // laundry
    s += RR(0.1, 0.1, 0.62, 0.62, fur) + `<circle cx="${X0(0.41)}" cy="${Y0(0.41)}" r="${r2(0.22 * k)}" ${fur}/>` + RR(0.82, 0.1, 0.62, 0.62, fur) + `<circle cx="${X0(1.13)}" cy="${Y0(0.41)}" r="${r2(0.22 * k)}" ${fur}/>`;
    // bath 2: shower, wc, basin
    s += RR(0.08, 1.7, 1.0, 1.0, fur) + L(0.08, 1.7, 1.08, 2.7, `stroke="${C.warm}" stroke-width=".8"`);
    s += `<ellipse cx="${X0(1.85)}" cy="${Y0(3.76)}" rx="${r2(0.2 * k)}" ry="${r2(0.28 * k)}" ${fur}/>` + RR(1.62, 4.0, 0.46, 0.12, fur);
    s += RR(1.55, 1.75, 0.55, 0.8, fur);
    // master bedroom: bed, nightstands, wardrobe
    s += RR(11.9, 5.2, 2.0, 1.8, fur) + RR(13.3, 5.32, 0.48, 0.72, fur) + RR(13.3, 6.16, 0.48, 0.72, fur) + L(13.2, 5.2, 13.2, 7.0, `stroke="${C.warm}" stroke-width="1.2"`);
    s += RR(13.45, 4.65, 0.45, 0.45, fur) + RR(13.45, 7.1, 0.45, 0.45, fur);
    // dressing
    s += RR(9.72, 0.1, 0.45, 3.4, fur) + L(9.72, 0.1, 10.17, 3.5, `stroke="${C.warm}" stroke-width=".6"`);
    // ensuite: tub, vanity, wc
    s += RR(11.7, 0.1, 2.2, 0.8, fur) + RR(11.8, 0.2, 2.0, 0.6, `fill="none" stroke="${C.warm}" stroke-width=".8"`);
    s += RR(13.45, 1.3, 0.45, 1.5, fur) + `<ellipse cx="${X0(12.0)}" cy="${Y0(2.75)}" rx="${r2(0.2 * k)}" ry="${r2(0.3 * k)}" ${fur}/>`;
    // balcony furniture
    s += `<circle cx="${X0(8.2)}" cy="${Y0(9.6)}" r="${r2(0.4 * k)}" ${fur}/>` + RR(7.0, 9.35, 0.5, 0.5, fur) + RR(8.9, 9.35, 0.5, 0.5, fur);
    // ---- walls
    [[0, 0, 2.6, 0], [3.6, 0, 14, 0], [14, 0, 14, 8.7], [0, 0, 0, 8.7], [0, 8.7, 0.6, 8.7], [2.8, 8.7, 3.8, 8.7], [9.2, 8.7, 10.2, 8.7], [13.4, 8.7, 14, 8.7]].forEach((w) => { s += L(...w, ext); });
    [[0, 1.6, 2.2, 1.6], [2.2, 0, 2.2, 0.4], [2.2, 1.2, 2.2, 2.7], [2.2, 3.5, 2.2, 4.2], [0, 4.2, 2.35, 4.2], [3.25, 4.2, 3.4, 4.2], [3.4, 4.2, 3.4, 8.7], [4.6, 0, 4.6, 1.8], [9.6, 0, 9.6, 4.1], [9.6, 5.0, 9.6, 8.7], [11.6, 0, 11.6, 3.6], [9.6, 3.6, 10.0, 3.6], [10.9, 3.6, 12.4, 3.6], [13.2, 3.6, 14, 3.6]].forEach((w) => { s += L(...w, int); });
    // glazing (double line) in façade openings
    [[0.6, 2.8], [3.8, 9.2], [10.2, 13.4]].forEach(([a, b]) => {
      s += L(a, 8.64, b, 8.64, `stroke="${C.graphite}" stroke-width="1.2"`) + L(a, 8.76, b, 8.76, `stroke="${C.graphite}" stroke-width="1.2"`);
    });
    s += L(6.5, 8.6, 6.5, 8.8, `stroke="${C.graphite}" stroke-width="1.2"`);
    // doors: leaf + swing arc
    const door = (hx, hy, lx, ly, ax, ay, sweep) => L(hx, hy, lx, ly, `stroke="${C.graphite}" stroke-width="2"`) + `<path d="M${X0(ax)},${Y0(ay)} A${r2(Math.hypot(lx - hx, ly - hy) * k)},${r2(Math.hypot(lx - hx, ly - hy) * k)} 0 0 ${sweep} ${X0(lx)},${Y0(ly)}" ${thin} stroke-width="1" stroke-dasharray="3 3"/>`;
    s += door(2.6, 0, 2.6, 1.0, 3.6, 0, 1);
    s += door(2.2, 0.4, 1.4, 0.4, 2.2, 1.2, 1);
    s += door(2.2, 3.5, 1.4, 3.5, 2.2, 2.7, 0);
    s += door(3.25, 4.2, 3.25, 5.1, 2.35, 4.2, 0);
    s += door(9.6, 4.1, 10.5, 4.1, 9.6, 5.0, 0);
    s += door(13.2, 3.6, 13.2, 2.8, 12.4, 3.6, 1);
    // entry marker
    s += lumen(ox + 3.1 * k, oy - 0.62 * k, 12, C.maroon);
    // ---- room labels
    const lab = (x, y, name, area, big, sm) => {
      const fs = RTL ? (big ? 21 : sm ? 16 : 18) : (big ? 15 : sm ? 12 : 13);
      const ls = RTL ? '' : `letter-spacing="${sm ? 0.1 : 0.14}em"`;
      return `<text x="${X0(x)}" y="${Y0(y)}" text-anchor="middle" font-family="${FONT}" font-weight="500" font-size="${fs}" ${ls} fill="${C.ink}">${esc(cap(name))}</text>` +
        `<text x="${X0(x)}" y="${r2(Y0(y) + (big ? 30 : sm ? 21 : 25))}" text-anchor="middle" font-family="${NUMFONT}" font-weight="300" font-size="${big ? 24 : sm ? 17 : 20}" fill="${C.graphite}">${esc(area + ' ' + T.m2)}</text>`;
    };
    s += lab(7.35, 6.55, T.living, '35.3', true);
    s += lab(7.1, 1.15, T.kitchen, '15.0');
    s += lab(11.55, 7.95, T.master, '22.4', true);
    s += lab(1.7, 7.95, T.bed2, '15.3');
    s += lab(12.5, 1.75, T.ensuite, '8.6');
    s += lab(10.88, 1.85, T.dress, '7.2', false, true);
    s += lab(0.78, 3.05, T.bath, '5.7', false, true);
    s += lab(0.98, 1.0, T.laundry, '3.5', false, true);
    s += lab(3.55, 2.55, T.entry, '8.6');
    s += lab(5.55, 9.6, T.balcony, '14.0');
    // ---- dimensions
    const dimH = (x1, x2, y, label) => {
      const yy = Y0(y);
      return `<line x1="${X0(x1)}" x2="${X0(x2)}" y1="${yy}" y2="${yy}" stroke="${C.maroon}" stroke-width="1"/>` +
        [x1, x2].map((x) => `<line x1="${X0(x) - 6}" y1="${yy + 6}" x2="${X0(x) + 6}" y2="${yy - 6}" stroke="${C.maroon}" stroke-width="1.5"/><line x1="${X0(x)}" x2="${X0(x)}" y1="${yy - 10}" y2="${yy + 10}" stroke="${C.maroon}" stroke-width="1"/>`).join('') +
        `<text x="${r2((X0(x1) + X0(x2)) / 2)}" y="${yy - 12}" text-anchor="middle" font-family="${NUMFONT}" font-size="18" font-weight="400" fill="${C.maroon}">${esc(label)}</text>`;
    };
    const dimV = (y1, y2, x, label) => {
      const xx = X0(x);
      return `<line y1="${Y0(y1)}" y2="${Y0(y2)}" x1="${xx}" x2="${xx}" stroke="${C.maroon}" stroke-width="1"/>` +
        [y1, y2].map((y) => `<line x1="${xx - 6}" y1="${Y0(y) + 6}" x2="${xx + 6}" y2="${Y0(y) - 6}" stroke="${C.maroon}" stroke-width="1.5"/><line y1="${Y0(y)}" y2="${Y0(y)}" x1="${xx - 10}" x2="${xx + 10}" stroke="${C.maroon}" stroke-width="1"/>`).join('') +
        `<text transform="translate(${xx - 12},${r2((Y0(y1) + Y0(y2)) / 2)}) rotate(-90)" text-anchor="middle" font-family="${NUMFONT}" font-size="18" font-weight="400" fill="${C.maroon}">${esc(label)}</text>`;
    };
    s += dimH(0, 14, -1.15, `14.00 ${T.m}`);
    s += dimH(0, 3.4, 11.35, '3.40') + dimH(3.4, 9.6, 11.35, '6.20') + dimH(9.6, 14, 11.35, '4.40');
    s += dimV(0, 8.7, -0.95, `8.70 ${T.m}`);
    s += dimV(8.7, 10.5, 12.0, '1.80');
    // north + scale (metres)
    const nx = X0(15.6), ny = Y0(9.6);
    s += `<g transform="translate(${nx},${ny})"><line x1="0" y1="-26" x2="0" y2="26" stroke="${C.graphite}"/><path d="M0,32 L-7,16 L0,20 L7,16 Z" fill="${C.graphite}"/><text y="-38" text-anchor="middle" font-family="${NUMFONT}" font-size="14" font-weight="500" fill="${C.graphite}">N</text></g>`;
    const sx = X0(11), sy = Y0(12.3);
    s += `<g transform="translate(${sx},${sy})"><rect width="${k}" height="5" fill="${C.graphite}"/><rect x="${k}" width="${k}" height="5" fill="none" stroke="${C.graphite}"/><rect x="${2 * k}" width="${k}" height="5" fill="${C.graphite}"/><text y="-10" font-family="${NUMFONT}" font-size="13" fill="${C.ash}">0</text><text x="${3 * k}" y="-10" text-anchor="middle" font-family="${NUMFONT}" font-size="13" fill="${C.ash}">${esc('3 ' + T.m)}</text></g>`;
    return { W, H, s };
  }

  // ---------------------------------------------------------------- mount
  const R = { bar: barChart, line: lineChart, stack: stackChart, map: drawMap, site: drawSite, plan: drawPlan };
  document.querySelectorAll('svg[data-chart], svg[data-draw]').forEach((el) => {
    let o = {};
    try { o = JSON.parse(el.getAttribute('data-chart') || el.getAttribute('data-opts') || '{}'); } catch (e) { console.error('Bad chart JSON', el, e); return; }
    const type = el.dataset.draw || o.type;
    if (!R[type]) return;
    if (el.getAttribute('width')) o.w = o.w || +el.getAttribute('width');
    if (el.getAttribute('height')) o.h = o.h || +el.getAttribute('height');
    const out = R[type](o);
    el.setAttribute('viewBox', `0 0 ${out.W} ${out.H}`);
    el.setAttribute('width', out.W);
    el.setAttribute('height', out.H);
    el.innerHTML = out.s;
  });
  doc.classList.add('ready');
})();
