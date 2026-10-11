/* =============================================================================
   SIRAJ UI Components v1.0 — behaviour for interactive demos
   Vanilla, no dependencies. Progressive: every component renders without JS.
   Hooks (data attributes):
     [data-sj-theme-toggle]          toggles <html data-theme="light|dark">
     [data-sj-dir-toggle]            toggles dir/lang on <html> or on [data-sj-dir-scope]
     [data-sj-tabs]                  tablist with .sj-tab[aria-controls]
     .sj-accordion__trigger          aria-expanded toggling
     [data-sj-dialog-open="id"]      opens <dialog id>; [data-sj-close] closes
     [data-sj-drawer-open="id"]      opens .sj-drawer#id (+ shared .sj-scrim)
     .sj-dropdown                    custom listbox
     .sj-segmented                   single-choice buttons (aria-pressed)
     [data-sj-toast]                 spawns a toast (data-sj-toast="Title|Text")
     table[data-sj-sortable]         sortable columns via .sj-sort buttons
   ========================================================================== */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function isRTL(el) { return getComputedStyle(el || root).direction === 'rtl'; }

  /* ---- Theme -------------------------------------------------------------- */
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    $all('[data-sj-theme-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', String(t === 'dark')); });
    doc.dispatchEvent(new CustomEvent('sj:theme', { detail: t }));
  }
  var savedTheme = store.get('sj-theme');
  if (savedTheme && root.hasAttribute('data-sj-remember')) setTheme(savedTheme);
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sj-theme-toggle]');
    if (!b) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next); store.set('sj-theme', next);
  });

  /* ---- Direction ---------------------------------------------------------- */
  function setDir(dir) {
    var scopes = $all('[data-sj-dir-scope]');
    var targets = scopes.length ? scopes : [root];
    targets.forEach(function (t) {
      t.setAttribute('dir', dir);
      t.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    });
    $all('[data-sj-dir-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', String(dir === 'rtl')); });
    doc.dispatchEvent(new CustomEvent('sj:dir', { detail: dir }));
  }
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sj-dir-toggle]');
    if (!b) return;
    var cur = b.getAttribute('aria-pressed') === 'true' ? 'rtl' : 'ltr';
    setDir(cur === 'rtl' ? 'ltr' : 'rtl');
  });
  window.SIRAJ = { setTheme: setTheme, setDir: setDir };

  /* ---- Tabs --------------------------------------------------------------- */
  function selectTab(tab, focus) {
    var list = tab.closest('[role="tablist"]');
    $all('[role="tab"]', list).forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var p = t.getAttribute('aria-controls') && doc.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
  }
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[role="tab"]');
    if (t && t.closest('[data-sj-tabs]')) selectTab(t);
  });
  doc.addEventListener('keydown', function (e) {
    var t = e.target.closest && e.target.closest('[role="tab"]');
    if (!t || !t.closest('[data-sj-tabs]')) return;
    var tabs = $all('[role="tab"]', t.closest('[role="tablist"]'));
    var i = tabs.indexOf(t), fwd = isRTL(t) ? 'ArrowLeft' : 'ArrowRight', back = isRTL(t) ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === fwd) { e.preventDefault(); selectTab(tabs[(i + 1) % tabs.length], true); }
    if (e.key === back) { e.preventDefault(); selectTab(tabs[(i - 1 + tabs.length) % tabs.length], true); }
    if (e.key === 'Home') { e.preventDefault(); selectTab(tabs[0], true); }
    if (e.key === 'End') { e.preventDefault(); selectTab(tabs[tabs.length - 1], true); }
  });

  /* ---- Accordion ---------------------------------------------------------- */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('.sj-accordion__trigger');
    if (!b) return;
    var open = b.getAttribute('aria-expanded') === 'true';
    var acc = b.closest('.sj-accordion');
    if (acc && acc.hasAttribute('data-sj-single') && !open) {
      $all('.sj-accordion__trigger[aria-expanded="true"]', acc).forEach(function (o) { o.setAttribute('aria-expanded', 'false'); });
    }
    b.setAttribute('aria-expanded', String(!open));
  });

  /* ---- Dialog ------------------------------------------------------------- */
  doc.addEventListener('click', function (e) {
    var o = e.target.closest('[data-sj-dialog-open]');
    if (o) {
      var d = doc.getElementById(o.getAttribute('data-sj-dialog-open'));
      if (d && d.showModal) d.showModal();
      return;
    }
    var c = e.target.closest('[data-sj-close]');
    if (c) {
      var dlg = c.closest('dialog');
      if (dlg) { dlg.close(); return; }
      var dr = c.closest('.sj-drawer');
      if (dr) closeDrawer(dr);
      var tst = c.closest('.sj-toast');
      if (tst) dismissToast(tst);
      var ban = c.closest('.sj-banner');
      if (ban && !ban.hasAttribute('data-sj-persist')) ban.remove();
    }
    if (e.target.tagName === 'DIALOG' && e.target.classList.contains('sj-dialog')) {
      var r = e.target.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close();
    }
  });

  /* ---- Drawer ------------------------------------------------------------- */
  var lastFocus = null;
  function scrim() {
    var s = doc.querySelector('.sj-scrim[data-sj-auto]');
    if (!s) {
      s = doc.createElement('div');
      s.className = 'sj-scrim'; s.setAttribute('data-sj-auto', '');
      s.addEventListener('click', function () { $all('.sj-drawer.is-open').forEach(closeDrawer); });
      doc.body.appendChild(s);
    }
    return s;
  }
  function openDrawer(d) {
    lastFocus = doc.activeElement;
    d.classList.add('is-open'); d.setAttribute('aria-hidden', 'false');
    scrim().classList.add('is-open'); doc.body.classList.add('sj-lock');
    var f = d.querySelector('button, a, input, select, textarea'); if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeDrawer(d) {
    d.classList.remove('is-open'); d.setAttribute('aria-hidden', 'true');
    scrim().classList.remove('is-open'); doc.body.classList.remove('sj-lock');
    if (lastFocus) lastFocus.focus();
  }
  doc.addEventListener('click', function (e) {
    var o = e.target.closest('[data-sj-drawer-open]');
    if (!o) return;
    var d = doc.getElementById(o.getAttribute('data-sj-drawer-open'));
    if (d) { e.preventDefault(); openDrawer(d); }
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    $all('.sj-drawer.is-open').forEach(closeDrawer);
    $all('.sj-dropdown.is-open').forEach(closeDropdown);
  });

  /* ---- Dropdown (listbox) ------------------------------------------------- */
  function closeDropdown(dd) { dd.classList.remove('is-open'); var t = dd.querySelector('.sj-dropdown__trigger'); if (t) t.setAttribute('aria-expanded', 'false'); }
  function openDropdown(dd) {
    $all('.sj-dropdown.is-open').forEach(closeDropdown);
    dd.classList.add('is-open');
    dd.querySelector('.sj-dropdown__trigger').setAttribute('aria-expanded', 'true');
    var sel = dd.querySelector('[aria-selected="true"]') || dd.querySelector('[role="option"]');
    $all('[role="option"]', dd).forEach(function (o) { o.classList.toggle('is-active', o === sel); });
  }
  function choose(dd, opt) {
    $all('[role="option"]', dd).forEach(function (o) { o.setAttribute('aria-selected', String(o === opt)); });
    var v = dd.querySelector('.sj-dropdown__value'); if (v) v.textContent = opt.getAttribute('data-label') || opt.textContent.trim();
    closeDropdown(dd); dd.querySelector('.sj-dropdown__trigger').focus();
  }
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('.sj-dropdown__trigger');
    if (t) { var dd = t.closest('.sj-dropdown'); dd.classList.contains('is-open') ? closeDropdown(dd) : openDropdown(dd); return; }
    var opt = e.target.closest('.sj-dropdown [role="option"]');
    if (opt) { choose(opt.closest('.sj-dropdown'), opt); return; }
    $all('.sj-dropdown.is-open').forEach(function (d) { if (!d.contains(e.target)) closeDropdown(d); });
  });
  doc.addEventListener('keydown', function (e) {
    var dd = e.target.closest && e.target.closest('.sj-dropdown');
    if (!dd) return;
    var opts = $all('[role="option"]', dd), act = dd.querySelector('.is-active'), i = opts.indexOf(act);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!dd.classList.contains('is-open')) { openDropdown(dd); return; }
      var n = opts[(i + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length];
      opts.forEach(function (o) { o.classList.toggle('is-active', o === n); });
    }
    if ((e.key === 'Enter' || e.key === ' ') && dd.classList.contains('is-open') && act) { e.preventDefault(); choose(dd, act); }
  });

  /* ---- Segmented control & toggle tags ------------------------------------ */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('.sj-segmented button');
    if (b) {
      $all('button', b.closest('.sj-segmented')).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      return;
    }
    var tag = e.target.closest('.sj-tag[aria-pressed]');
    if (tag) tag.setAttribute('aria-pressed', String(tag.getAttribute('aria-pressed') !== 'true'));
  });

  /* ---- Toast -------------------------------------------------------------- */
  function region() {
    var r = doc.querySelector('.sj-toast-region');
    if (!r) { r = doc.createElement('div'); r.className = 'sj-toast-region'; r.setAttribute('role', 'status'); r.setAttribute('aria-live', 'polite'); doc.body.appendChild(r); }
    return r;
  }
  function dismissToast(t) { t.classList.add('is-leaving'); setTimeout(function () { t.remove(); }, 400); }
  function toast(title, text, opts) {
    opts = opts || {};
    var t = doc.createElement('div');
    t.className = 'sj-toast';
    var icon = opts.icon || 'check';
    var sprite = opts.sprite || (doc.querySelector('[data-sj-sprite]') ? doc.querySelector('[data-sj-sprite]').getAttribute('data-sj-sprite') : '');
    t.innerHTML = (sprite ? '<svg class="sj-icon" aria-hidden="true"><use href="' + sprite + '#sj-' + icon + '"/></svg>' : '') +
      '<div class="sj-toast__body"><p class="sj-toast__title"></p>' + (text ? '<p class="sj-toast__text"></p>' : '') + '</div>' +
      '<button class="sj-toast__close" type="button" data-sj-close aria-label="Dismiss">' + (sprite ? '<svg class="sj-icon sj-icon--sm" aria-hidden="true"><use href="' + sprite + '#sj-close"/></svg>' : '×') + '</button>' +
      '<span class="sj-toast__timer"></span>';
    t.querySelector('.sj-toast__title').textContent = title;
    if (text) t.querySelector('.sj-toast__text').textContent = text;
    region().appendChild(t);
    setTimeout(function () { if (t.isConnected) dismissToast(t); }, opts.duration || 6000);
    return t;
  }
  window.SIRAJ.toast = toast;
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sj-toast]');
    if (!b) return;
    var parts = b.getAttribute('data-sj-toast').split('|');
    toast(parts[0], parts[1], { icon: b.getAttribute('data-sj-toast-icon') || 'check' });
  });

  /* ---- Sortable table ----------------------------------------------------- */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('table[data-sj-sortable] .sj-sort');
    if (!b) return;
    var th = b.closest('th'), table = th.closest('table'), idx = Array.prototype.indexOf.call(th.parentNode.children, th);
    var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $all('thead th[aria-sort]', table).forEach(function (h) { h.setAttribute('aria-sort', 'none'); });
    th.setAttribute('aria-sort', dir);
    var body = table.tBodies[0], rows = Array.prototype.slice.call(body.rows);
    rows.sort(function (a, b2) {
      var x = a.cells[idx], y = b2.cells[idx];
      var vx = x.getAttribute('data-value') || x.textContent.trim(), vy = y.getAttribute('data-value') || y.textContent.trim();
      var nx = parseFloat(vx), ny = parseFloat(vy);
      var c = (!isNaN(nx) && !isNaN(ny)) ? nx - ny : vx.localeCompare(vy);
      return dir === 'ascending' ? c : -c;
    });
    rows.forEach(function (r) { body.appendChild(r); });
  });

  /* ---- Sticky nav state --------------------------------------------------- */
  var stickies = $all('[data-sj-nav-scroll]');
  if (stickies.length) {
    var onScroll = function () { stickies.forEach(function (n) { n.classList.toggle('is-scrolled', window.scrollY > 24); }); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
})();
