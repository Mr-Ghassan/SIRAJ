/* =============================================================================
   SIRAJ Design System v1.0 — interactions (vanilla, no framework, no deps)
   Tabs · Accordion · Dialog · Drawer · Banner/Alert dismiss · Toggle chips ·
   Search clear · Gallery · Form validation · Motion hooks · Fixed-canvas fit.
   Auto-initialises on DOMContentLoaded; call SirajDS.init(root) for new markup.
   ========================================================================== */
(function () {
  'use strict';
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var isRTL = function (el) { return getComputedStyle(el || document.documentElement).direction === 'rtl'; };
  var params = new URLSearchParams(location.search);
  var STATIC = params.has('static') || params.has('print');

  /* ---- Tabs: roving tabindex, arrows follow reading direction, Home/End ---- */
  function initTabs(root) {
    root.querySelectorAll('[data-siraj-tabs]').forEach(function (box) {
      if (box._sj) return; box._sj = 1;
      var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
      function select(tab, focus) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
          var p = document.getElementById(t.getAttribute('aria-controls'));
          if (p) p.hidden = !on;
        });
        if (focus) tab.focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(t, false); });
        t.addEventListener('keydown', function (e) {
          var next = { ArrowRight: isRTL(box) ? -1 : 1, ArrowLeft: isRTL(box) ? 1 : -1 }[e.key];
          var j = null;
          if (next) j = (i + next + tabs.length) % tabs.length;
          if (e.key === 'Home') j = 0;
          if (e.key === 'End') j = tabs.length - 1;
          if (j !== null) { e.preventDefault(); select(tabs[j], true); }
        });
      });
      select(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0], false);
    });
  }

  /* ---- Accordion ---------------------------------------------------------- */
  function initAccordion(root) {
    root.querySelectorAll('[data-siraj-accordion] .siraj-accordion__trigger').forEach(function (btn) {
      if (btn._sj) return; btn._sj = 1;
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        var acc = btn.closest('[data-siraj-accordion]');
        if (!open && acc.hasAttribute('data-single')) {
          acc.querySelectorAll('.siraj-accordion__trigger[aria-expanded="true"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); var p = document.getElementById(b.getAttribute('aria-controls')); if (p) p.hidden = true; });
        }
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel) panel.hidden = open;
      });
    });
  }

  /* ---- Dialog + Drawer: focus trap, Esc, scrim click, focus restore -------- */
  var stack = [];
  function openOverlay(id, opener) {
    var ov = document.getElementById(id); if (!ov) return;
    ov._opener = opener || document.activeElement;
    ov.hidden = false; ov.classList.add('is-open');
    document.body.classList.add('siraj-scroll-lock');
    stack.push(ov);
    var target = ov.querySelector('[autofocus]') || ov.querySelector(FOCUSABLE);
    setTimeout(function () { (target || ov).focus(); }, 0);
  }
  function closeOverlay(ov) {
    ov = ov || stack[stack.length - 1]; if (!ov) return;
    ov.hidden = true; ov.classList.remove('is-open');
    stack = stack.filter(function (o) { return o !== ov; });
    if (!stack.length) document.body.classList.remove('siraj-scroll-lock');
    if (ov._opener && ov._opener.focus) ov._opener.focus();
  }
  function initOverlays(root) {
    root.querySelectorAll('[data-siraj-open]').forEach(function (b) {
      if (b._sj) return; b._sj = 1;
      b.addEventListener('click', function () { openOverlay(b.getAttribute('data-siraj-open'), b); });
    });
    root.querySelectorAll('.siraj-overlay').forEach(function (ov) {
      if (ov._sj) return; ov._sj = 1;
      ov.addEventListener('click', function (e) { if (e.target === ov) closeOverlay(ov); });
      ov.querySelectorAll('[data-siraj-close]').forEach(function (c) { c.addEventListener('click', function () { closeOverlay(ov); }); });
      ov.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.stopPropagation(); closeOverlay(ov); return; }
        if (e.key !== 'Tab') return;
        var f = Array.prototype.filter.call(ov.querySelectorAll(FOCUSABLE), function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    });
  }

  /* ---- Dismiss, toggles, search clear ------------------------------------- */
  function initSmall(root) {
    root.querySelectorAll('[data-siraj-dismiss]').forEach(function (b) {
      if (b._sj) return; b._sj = 1;
      b.addEventListener('click', function () { var t = b.closest('.siraj-banner, .siraj-alert'); if (t) t.hidden = true; });
    });
    root.querySelectorAll('[data-siraj-toggle]').forEach(function (b) {
      if (b._sj) return; b._sj = 1;
      b.addEventListener('click', function () {
        var group = b.closest('[data-single]');
        var on = b.getAttribute('aria-pressed') === 'true';
        if (group && !on) group.querySelectorAll('[data-siraj-toggle]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', on && !group ? 'false' : 'true');
      });
    });
    root.querySelectorAll('.siraj-search').forEach(function (s) {
      if (s._sj) return; s._sj = 1;
      var input = s.querySelector('input'), clear = s.querySelector('.siraj-search__clear');
      if (!input || !clear) return;
      var sync = function () { clear.hidden = !input.value; };
      input.addEventListener('input', sync); sync();
      clear.addEventListener('click', function () { input.value = ''; sync(); input.focus(); });
    });
  }

  /* ---- Gallery: thumbnails switch the main image; arrows move -------------- */
  function initGallery(root) {
    root.querySelectorAll('[data-siraj-gallery]').forEach(function (g) {
      if (g._sj) return; g._sj = 1;
      var main = g.querySelector('.siraj-gallery__main img');
      var cap = g.querySelector('.siraj-gallery__caption');
      var thumbs = Array.prototype.slice.call(g.querySelectorAll('.siraj-gallery__thumb'));
      thumbs.forEach(function (t, i) {
        t.addEventListener('click', function () {
          thumbs.forEach(function (x) { x.setAttribute('aria-current', x === t ? 'true' : 'false'); });
          var img = t.querySelector('img');
          main.src = t.getAttribute('data-full') || img.src; main.alt = img.alt;
          if (cap) cap.textContent = t.getAttribute('data-caption') || img.alt;
        });
        t.addEventListener('keydown', function (e) {
          var d = { ArrowRight: isRTL(g) ? -1 : 1, ArrowLeft: isRTL(g) ? 1 : -1 }[e.key];
          if (!d) return; e.preventDefault();
          var n = thumbs[(i + d + thumbs.length) % thumbs.length]; n.focus(); n.click();
        });
      });
    });
  }

  /* ---- Forms: validate on blur, clear on input, focus first error on submit -- */
  function validateField(field) {
    var input = field.querySelector('input, select, textarea'); if (!input) return true;
    var v = (input.value || '').trim(); var ok = true;
    if (input.required && !v) ok = false;
    if (ok && v && input.pattern && !(new RegExp('^(?:' + input.pattern + ')$')).test(v)) ok = false;
    if (ok && input.type === 'checkbox' && input.required) ok = input.checked;
    field.classList.toggle('is-invalid', !ok);
    field.classList.toggle('is-valid', ok && !!v && field.hasAttribute('data-show-valid'));
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }
  function initForms(root) {
    root.querySelectorAll('form[data-siraj-validate]').forEach(function (form) {
      if (form._sj) return; form._sj = 1;
      form.setAttribute('novalidate', '');
      form.querySelectorAll('.siraj-field').forEach(function (f) {
        var input = f.querySelector('input, select, textarea'); if (!input) return;
        input.addEventListener('blur', function () { validateField(f); });
        input.addEventListener('input', function () { if (f.classList.contains('is-invalid')) validateField(f); });
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var bad = null;
        form.querySelectorAll('.siraj-field').forEach(function (f) { if (!validateField(f) && !bad) bad = f; });
        var done = form.querySelector('[data-siraj-success]');
        if (bad) { var i = bad.querySelector('input, select, textarea'); if (i) i.focus(); if (done) done.hidden = true; }
        else if (done) { done.hidden = false; done.focus && done.focus(); }
      });
    });
  }

  /* ---- Motion hooks: reveal on entering the viewport ----------------------- */
  function initMotion(root) {
    var els = root.querySelectorAll('[data-siraj-motion]');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (STATIC || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); en.target.classList.remove('is-pending'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) {
      if (el._sj) return; el._sj = 1;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) return; // already visible on load: never hide it
      if (reduce) { el.style.transitionProperty = 'opacity'; }
      el.classList.add('is-pending'); io.observe(el);
    });
  }

  /* ---- Fixed canvases (e.g. 1920×1080 sales-centre display) scale to fit ---- */
  function initFit(root) {
    var boxes = root.querySelectorAll('[data-siraj-fit]');
    if (!boxes.length) return;
    function fit() {
      boxes.forEach(function (b) {
        var w = parseFloat(b.getAttribute('data-siraj-fit')) || 1920;
        var avail = (b.parentElement || document.body).clientWidth;
        b.style.zoom = Math.min(1, avail / w);
      });
    }
    fit(); window.addEventListener('resize', fit);
  }

  /* ---- Public API ----------------------------------------------------------- */
  function init(root) {
    root = root || document;
    initTabs(root); initAccordion(root); initOverlays(root); initSmall(root);
    initGallery(root); initForms(root); initMotion(root); initFit(root);
  }
  window.SirajDS = {
    version: '1.0.0', init: init, open: openOverlay, close: closeOverlay,
    setTheme: function (t, el) { (el || document.documentElement).setAttribute('data-theme', t === 'dark' || t === 'deep' ? 'dark' : 'light'); },
    setLanguage: function (lang) { var h = document.documentElement; h.lang = lang; h.dir = lang === 'ar' ? 'rtl' : 'ltr'; }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(document); });
  else init(document);
})();
