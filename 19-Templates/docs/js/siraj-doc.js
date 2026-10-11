/* =============================================================================
   SIRAJ Document Runtime v1.0
   Shared by 19-Templates/docs and 12-Print/Source templates.

   - Binds {{path|filter}} tokens in text and attributes to window.SIRAJ_CONFIG
     (generated from 00-Brand-Foundation/brand.config.json by tools/build-print.js).
   - Calculates line-item tables (qty × rate, subtotal, VAT, total) in OMR.
   - Numbers pages ([data-page] / [data-pages]).
   - Print sheets (.sheet): trim / bleed / slug geometry, crop marks (?marks).
   - Preview mode (?preview): lays sheets out on a studio backdrop with captions.
   Exposes window.SIRAJ = { config, pageSize(), ready }.
   ========================================================================== */
(function () {
  'use strict';
  var CFG = window.SIRAJ_CONFIG || {};
  var q = new URLSearchParams(location.search);
  var root = document.documentElement;
  var MODE = { preview: q.has('preview'), marks: q.has('marks'), dieline: q.get('dieline') !== '0', name: q.get('name') || '' };
  if (MODE.preview) root.classList.add('is-preview');
  if (MODE.marks) root.classList.add('has-marks');
  if (!MODE.dieline) root.classList.add('no-dieline');

  /* ---------- config binding ------------------------------------------- */
  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, CFG);
  }
  function fmt(n, d) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  var FILTERS = {
    omr: function (v) { return fmt(v, 0); },
    omr3: function (v) { return fmt(v, 3); },
    upper: function (v) { return String(v).toUpperCase(); },
    tel: function (v) { return String(v).replace(/[^+\d]/g, ''); },
    nbsp: function (v) { return String(v).replace(/ /g, ' '); },
    // split an address before its last comma (Latin "," or Arabic "،"): lines -> two lines (pair with
    // white-space: pre-line), first -> everything before, last -> the final part (e.g. the country)
    // "Q4 2027" -> "الربع الرابع 2027"
    qar: function (v) { var o = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع']; return String(v).replace(/Q([1-4])\s*(\d{4})/, function (m, n, y) { return 'الربع ' + o[n] + ' ' + y; }); },
    lines: function (v) { return String(v).replace(/^(.*)[,،]\s*([^,،]+)$/, '$1\n$2'); },
    first: function (v) { return String(v).replace(/^(.*)[,،]\s*([^,،]+)$/, '$1'); },
    last: function (v) { return String(v).replace(/^(.*)[,،]\s*([^,،]+)$/, '$2'); }
  };
  var RE = /\{\{\s*([^}]+?)\s*\}\}/g;
  function resolve(expr) {
    var parts = expr.split('|');
    var v = get(parts[0].trim());
    if (v === undefined) { console.warn('[SIRAJ] missing config value: ' + parts[0]); return '—'; }
    for (var i = 1; i < parts.length; i++) {
      var f = FILTERS[parts[i].trim()];
      if (f) v = f(v);
    }
    return String(v);
  }
  function interpolate(s) { return s.replace(RE, function (_, e) { return resolve(e); }); }

  function bind(scope) {
    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
    var n, list = [];
    while ((n = walker.nextNode())) if (n.nodeValue.indexOf('{{') !== -1) list.push(n);
    list.forEach(function (t) { t.nodeValue = interpolate(t.nodeValue); });
    scope.querySelectorAll('*').forEach(function (el) {
      for (var i = 0; i < el.attributes.length; i++) {
        var a = el.attributes[i];
        if (a.value.indexOf('{{') !== -1) el.setAttribute(a.name, interpolate(a.value));
      }
    });
  }

  /* ---------- line-item calculation ------------------------------------
     <table data-calc data-vat="5">  rows: <tr data-qty="1" data-rate="1250">
       cell receiving the amount: [data-out="amount"]
     Totals anywhere inside the nearest [data-calc-scope] (or document):
       [data-total="subtotal|vat|total|vatable"]                                   */
  function calc() {
    document.querySelectorAll('table[data-calc]').forEach(function (t) {
      var scope = t.closest('[data-calc-scope]') || document;
      var vatRate = parseFloat(t.getAttribute('data-vat') || '0') / 100;
      var sub = 0, vatable = 0;
      t.querySelectorAll('tr[data-rate]').forEach(function (r) {
        var qty = parseFloat(r.getAttribute('data-qty') || '1');
        var amt = Math.round(qty * parseFloat(r.getAttribute('data-rate')) * 1000) / 1000;
        sub += amt;
        if (r.getAttribute('data-vat') !== '0') vatable += amt;
        var rate = r.querySelector('[data-out="rate"]'); if (rate) rate.textContent = fmt(parseFloat(r.getAttribute('data-rate')), 3);
        var out = r.querySelector('[data-out="amount"]'); if (out) out.textContent = fmt(amt, 3);
        var v = r.querySelector('[data-out="vat"]'); if (v) v.textContent = r.getAttribute('data-vat') === '0' ? '0%' : (vatRate * 100) + '%';
      });
      var vat = Math.round(vatable * vatRate * 1000) / 1000;
      var vals = { subtotal: sub, vatable: vatable, vat: vat, total: Math.round((sub + vat) * 1000) / 1000 };
      scope.querySelectorAll('[data-total]').forEach(function (el) {
        var k = el.getAttribute('data-total');
        if (k in vals) el.textContent = fmt(vals[k], 3);
      });
      // instalments: <td data-pct="10"> → 10 % of the total
      scope.querySelectorAll('[data-pct]').forEach(function (el) {
        el.textContent = fmt(Math.round(vals.total * parseFloat(el.getAttribute('data-pct')) * 10) / 1000, 3);
      });
      scope.querySelectorAll('[data-words]').forEach(function (el) {
        el.textContent = omrWords(vals[el.getAttribute('data-words')] || 0);
      });
    });
  }

  /* English amount in words: 35452.5 → "Thirty-five thousand four hundred fifty-two Omani rials and 500 baisa only" */
  function words(n) {
    var a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var t = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    function h(x) {
      var r = [];
      if (x >= 100) { r.push(a[Math.floor(x / 100)] + ' hundred'); x %= 100; }
      if (x >= 20) { r.push(t[Math.floor(x / 10)] + (x % 10 ? '-' + a[x % 10] : '')); } else if (x) r.push(a[x]);
      return r.join(' ');
    }
    if (n === 0) return 'zero';
    var parts = [], units = [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']];
    units.forEach(function (u) { if (n >= u[0]) { parts.push(h(Math.floor(n / u[0])) + ' ' + u[1]); n %= u[0]; } });
    if (n) parts.push(h(n));
    return parts.join(' ');
  }
  function omrWords(v) {
    var rials = Math.floor(v + 1e-9), baisa = Math.round((v - rials) * 1000);
    var s = words(rials) + ' Omani rials' + (baisa ? ' and ' + baisa + ' baisa' : '') + ' only';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* ---------- page numbering ------------------------------------------- */
  function paginate() {
    var pages = document.querySelectorAll('.page, .sheet');
    var total = pages.length;
    pages.forEach(function (p, i) {
      p.querySelectorAll('[data-page]').forEach(function (el) { el.textContent = String(i + 1).padStart(el.getAttribute('data-pad') ? 2 : 1, '0'); });
      p.querySelectorAll('[data-pages]').forEach(function (el) { el.textContent = String(total).padStart(el.getAttribute('data-pad') ? 2 : 1, '0'); });
    });
  }

  /* ---------- print sheets (trim / bleed / slug / crop marks) ----------- */
  var SLUG = 10; // mm of slug around the bleed when ?marks is on
  function sheetGeom(s) {
    var w = parseFloat(s.getAttribute('data-w')), h = parseFloat(s.getAttribute('data-h'));
    var bleed = parseFloat(s.getAttribute('data-bleed') || '3');
    var b = MODE.marks ? bleed : 0, sl = MODE.marks ? parseFloat(s.getAttribute('data-slug') || SLUG) : 0;
    return { w: w, h: h, bleed: bleed, b: b, slug: sl, W: w + 2 * (b + sl), H: h + 2 * (b + sl) };
  }
  function svgEl(tag, attrs) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function setupSheets() {
    document.querySelectorAll('.sheet').forEach(function (s, i, all) {
      var g = sheetGeom(s);
      s.style.setProperty('--w', g.w + 'mm');
      s.style.setProperty('--h', g.h + 'mm');
      s.style.setProperty('--b', g.b + 'mm');
      s.style.setProperty('--slug', g.slug + 'mm');
      s.style.setProperty('--bleed', g.bleed + 'mm');
      if (!MODE.marks) return;
      // crop marks in registration black, 0.25 pt, offset 1 mm beyond the bleed
      var svg = svgEl('svg', { class: 'marks', viewBox: '0 0 ' + g.W + ' ' + g.H, width: g.W + 'mm', height: g.H + 'mm' });
      var o = g.slug + g.b, off = g.b + 1, len = g.slug - 2.5, sw = 0.088;
      var xs = [o, o + g.w], ys = [o, o + g.h];
      xs.forEach(function (x) {
        ys.forEach(function (y) {
          var dy = y === o ? -1 : 1, dx = x === o ? -1 : 1;
          svg.appendChild(svgEl('line', { x1: x, x2: x, y1: y + dy * off, y2: y + dy * (off + len), stroke: '#000', 'stroke-width': sw }));
          svg.appendChild(svgEl('line', { y1: y, y2: y, x1: x + dx * off, x2: x + dx * (off + len), stroke: '#000', 'stroke-width': sw }));
        });
      });
      // fold marks (data-folds="x:110,y:99" in trim mm)
      (s.getAttribute('data-folds') || '').split(',').filter(Boolean).forEach(function (f) {
        var p = f.split(':'), v = parseFloat(p[1]);
        if (p[0] === 'x') [[o - off, o - off - len * 0.6], [o + g.h + off, o + g.h + off + len * 0.6]].forEach(function (yy) {
          svg.appendChild(svgEl('line', { x1: o + v, x2: o + v, y1: yy[0], y2: yy[1], stroke: '#000', 'stroke-width': sw, 'stroke-dasharray': '0.8 0.6' }));
        });
        else [[o - off, o - off - len * 0.6], [o + g.w + off, o + g.w + off + len * 0.6]].forEach(function (xx) {
          svg.appendChild(svgEl('line', { y1: o + v, y2: o + v, x1: xx[0], x2: xx[1], stroke: '#000', 'stroke-width': sw, 'stroke-dasharray': '0.8 0.6' }));
        });
      });
      var info = svgEl('text', { x: o + 2, y: g.H - g.slug / 2 + 0.6, 'font-family': 'Jost, sans-serif', 'font-size': g.w < 120 ? 1.5 : 2.2, fill: '#000' });
      info.textContent = (MODE.name || document.title) + '  ·  ' + (s.getAttribute('data-label') || ('Page ' + (i + 1))) +
        '  ·  Trim ' + g.w + ' × ' + g.h + ' mm  ·  Bleed ' + g.bleed + ' mm  ·  ' + (i + 1) + '/' + all.length;
      svg.appendChild(info);
      s.appendChild(svg);
    });
  }

  function pageSize() {
    var s = document.querySelector('.sheet');
    if (s) { var g = sheetGeom(s); return { width: g.W + 'mm', height: g.H + 'mm', w: g.W, h: g.H }; }
    var p = document.querySelector('.page');
    var w = p ? parseFloat(p.getAttribute('data-w') || '210') : 210, h = p ? parseFloat(p.getAttribute('data-h') || '297') : 297;
    return { width: w + 'mm', height: h + 'mm', w: w, h: h };
  }
  function pageRule() {
    if (document.body.hasAttribute('data-flow')) return; // flow documents own their @page rules
    var ps = pageSize();
    var st = document.createElement('style');
    st.textContent = '@page { size: ' + ps.width + ' ' + ps.height + '; margin: 0; }';
    document.head.appendChild(st);
  }

  /* ---------- preview mode --------------------------------------------- */
  function preview() {
    if (!MODE.preview) return;
    var items = Array.prototype.slice.call(document.querySelectorAll('.sheet, .page'));
    var stage = document.createElement('div');
    stage.className = 'pv-stage';
    var cols = parseInt(document.body.getAttribute('data-preview-cols') || Math.min(items.length, 4), 10);
    stage.style.setProperty('--pv-cols', cols);
    var head = document.createElement('header');
    head.className = 'pv-head';
    head.innerHTML = '<p class="pv-eyebrow"><span class="pv-lumen"></span>' + (document.body.getAttribute('data-preview-eyebrow') || 'SIRAJ · Print') + '</p>' +
      '<h1 class="pv-title">' + (document.body.getAttribute('data-preview-title') || document.title) + '</h1>' +
      (document.body.getAttribute('data-preview-note') ? '<p class="pv-note">' + document.body.getAttribute('data-preview-note') + '</p>' : '');
    var grid = document.createElement('div');
    grid.className = 'pv-grid';
    items.forEach(function (el) {
      var fig = document.createElement('figure');
      fig.className = 'pv-fig' + (el.getAttribute('data-preview-span') ? ' pv-span' : '');
      el.parentNode.insertBefore(fig, el);
      fig.appendChild(el);
      var cap = document.createElement('figcaption');
      cap.textContent = el.getAttribute('data-label') || '';
      fig.appendChild(cap);
      grid.appendChild(fig);
    });
    stage.appendChild(head);
    stage.appendChild(grid);
    // clear the body but keep template <style>/<script> blocks and [data-keep] (e.g. shared SVG <defs>)
    Array.prototype.slice.call(document.body.childNodes).forEach(function (n) {
      if (!(n.nodeType === 1 && (/^(STYLE|SCRIPT|LINK)$/.test(n.tagName) || n.hasAttribute('data-keep')))) document.body.removeChild(n);
    });
    document.body.appendChild(stage);
  }

  function run() {
    // .preview-only pages ("in use" samples) appear in the PNG preview, never in the print PDF
    if (!MODE.preview) document.querySelectorAll('.preview-only').forEach(function (e) { e.remove(); });
    bind(document.body);
    document.title = interpolate(document.title);
    calc();
    paginate();
    setupSheets();
    pageRule();
    preview();
  }

  var ready = new Promise(function (res) {
    function go() {
      run();
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
        // decode images so screenshots/PDFs never catch a blank frame
        var imgs = Array.prototype.slice.call(document.images);
        return Promise.all(imgs.map(function (im) { return im.decode ? im.decode().catch(function () {}) : null; }));
      }).then(function () { root.setAttribute('data-ready', '1'); res(); });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  });

  window.SIRAJ = { config: CFG, pageSize: pageSize, ready: ready, mode: MODE, format: fmt };
})();
