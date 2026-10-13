// SIRAJ Design System v1.0 — component markup recipes.
// Every function takes a context c = { x(ar,en), st(ar,en), mode, R, D }.
// Docs pass bilingual text (Arabic + English); public example screens pass Arabic only.
// Unconfirmed facts (price, area, unit counts, dates, yields) always render as a data slot «—».
const L = require('./lib');
const { ic, logo, imgUrl, IMG, PHONE, PHONE_D, HANDLE, SILK } = L;
const SLOT = '<span class="siraj-slot">—</span>';
const ltr = (s) => `<span class="siraj-ltr">${s}</span>`;
// Instagram = icon + handle, never «@» (client rule 2026-10-13)
// «مشروع سراج» silk-script lettering — the project name is never typed (client rule 2026-10-13)
const LETT = (c, dark = false, h = 64) => `<img class="siraj-lettering" alt="مشروع سراج" src="${c.R}01-Logos/Project/SIRAJ_Project-Siraj_Lettering_${dark ? 'Ribbon-Ivory' : 'Ribbon'}_v1.0_2048px.png" style="height:${h}px" width="${Math.round(h * 3.0476)}" height="${h}">`;
const IGH = () => `<span class="siraj-ig">${ic('instagram')}${ltr(HANDLE)}</span>`;
const alt = (c, k) => (c.mode === 'ar' ? IMG[k].ar : `${IMG[k].ar} · ${IMG[k].en}`);
const img = (c, k, { thumb = false, cls = '', lazy = false, w = 1200, h = 1490 } = {}) => `<img class="${cls}" src="${imgUrl(c.D, k, thumb)}" alt="${alt(c, k)}" width="${thumb ? 360 : w}" height="${thumb ? 447 : h}"${lazy ? ' loading="lazy"' : ''}>`;

// ── navigation ────────────────────────────────────────────────────────────────
const SITE_NAV = [['home', 'الرئيسية', 'Home'], ['project', 'المشروع', 'The project'], ['about', 'عن الشركة', 'About'], ['contact', 'تواصل', 'Contact']];
function nav(c, active = 'home', vertical = false) {
  return `<nav class="siraj-nav${vertical ? ' siraj-nav--vertical' : ''}" aria-label="${c.mode === 'ar' ? 'التنقّل الرئيسي' : 'Main'}"><ul class="siraj-nav__list">${SITE_NAV.map(([k, a, e]) => `<li><a class="siraj-nav__link" href="#${k}"${k === active ? ' aria-current="page"' : ''}>${c.x(a, e)}</a></li>`).join('')}</ul></nav>`;
}
function header(c, { active = 'home', menuId = '', cta = true } = {}) {
  return `<header class="siraj-header"><div class="siraj-container siraj-header__inner">
    <a href="#home" aria-label="${c.mode === 'ar' ? 'SIRAJ — الرئيسية' : 'SIRAJ — Home'}">${logo(c.R)}</a>
    <div class="siraj-header__nav">${nav(c, active)}</div>
    <div class="siraj-header__actions">
      <a class="siraj-btn siraj-btn--icon siraj-btn--ghost" href="tel:${PHONE}" aria-label="${c.mode === 'ar' ? 'اتصل بنا' : 'Call us'}">${ic('call')}</a>
      ${cta ? `<a class="siraj-btn siraj-btn--secondary siraj-btn--sm" href="#contact">${c.x('سجّل اهتمامك', 'Register interest')}</a>` : ''}
      <button class="siraj-btn siraj-btn--icon siraj-btn--ghost siraj-header__menu" type="button"${menuId ? ` data-siraj-open="${menuId}"` : ''} aria-label="${c.mode === 'ar' ? 'القائمة' : 'Menu'}">${ic('menu')}</button>
    </div>
  </div></header>`;
}
function menuDrawer(c, id, active = 'home') {
  return `<div class="siraj-overlay siraj-overlay--drawer" id="${id}" hidden><div class="siraj-drawer" role="dialog" aria-modal="true" aria-labelledby="${id}-t">
    <div class="siraj-drawer__head"><h2 class="siraj-drawer__title" id="${id}-t">${c.x('القائمة', 'Menu')}</h2><button class="siraj-btn siraj-btn--icon siraj-btn--ghost" type="button" data-siraj-close aria-label="${c.mode === 'ar' ? 'إغلاق' : 'Close'}">${ic('close')}</button></div>
    <div class="siraj-drawer__body">${nav(c, active, true)}</div>
    <div class="siraj-drawer__foot"><a class="siraj-btn siraj-btn--primary" href="tel:${PHONE}">${ic('call')}${ltr(PHONE_D)}</a></div>
  </div></div>`;
}
function contactLine(c) {
  return `<div class="siraj-contact-line"><a href="tel:${PHONE}">${ltr(PHONE_D)}</a><span class="siraj-lumen"></span><a href="https://instagram.com/sirajproperties">${IGH()}</a></div>`;
}
function footer(c) {
  return `<footer class="siraj-footer" data-theme="dark"><div class="siraj-container">
    <div class="siraj-footer__top">
      <p class="siraj-footer__lead">${c.x('مساكن تتشكّل بالضوء والسكينة.', 'Homes shaped by light and calm.')}</p>
      <div><div class="siraj-footer__title siraj-label">${c.x('المشروع', 'The project')}</div><div class="siraj-footer__links"><a href="#project">${c.x('عن المشروع', 'The project')}</a><a href="#gallery">${c.x('معرض الصور', 'Gallery')}</a><a href="#brochure">${c.x('كتيّب المشروع', 'Brochure')}</a></div></div>
      <div><div class="siraj-footer__title siraj-label">${c.x('تواصل', 'Contact')}</div><div class="siraj-footer__links"><a href="tel:${PHONE}">${ltr(PHONE_D)}</a><a href="https://wa.me/968${PHONE}">${c.x('واتساب', 'WhatsApp')}</a><a href="https://instagram.com/sirajproperties">${IGH()}</a></div></div>
    </div>
    <div class="siraj-footer__bottom">${logo(c.R)}${contactLine(c)}</div>
  </div></footer>`;
}
function sidebar(c, active = 'overview') {
  const items = [['overview', 'نظرة عامة', 'Overview', 'grid'], ['units', 'الوحدات', 'Units', 'apartment'], ['payments', 'الدفعات', 'Payments', 'payment'], ['documents', 'المستندات', 'Documents', 'documents'], ['progress', 'سير البناء', 'Construction', 'construction']];
  const items2 = [['contact', 'التواصل مع المبيعات', 'Contact sales', 'call'], ['profile', 'الحساب', 'Account', 'user']];
  const link = ([k, a, e, i]) => `<a class="siraj-sidebar__link" href="#${k}"${k === active ? ' aria-current="page"' : ''}>${ic(i)}${c.x(a, e)}</a>`;
  return `<aside class="siraj-sidebar" aria-label="${c.mode === 'ar' ? 'القائمة الجانبية' : 'Sidebar'}"><div class="siraj-sidebar__group"><div class="siraj-sidebar__title siraj-label">${c.x('بوابة العميل', 'Customer portal')}</div>${items.map(link).join('')}</div><div class="siraj-sidebar__group"><div class="siraj-sidebar__title siraj-label">${c.x('الدعم', 'Support')}</div>${items2.map(link).join('')}</div></aside>`;
}
function breadcrumb(c, trail) {
  return `<nav class="siraj-breadcrumb" aria-label="${c.mode === 'ar' ? 'مسار التنقّل' : 'Breadcrumb'}"><ol>${trail.map(([a, e], i) => `<li>${i === trail.length - 1 ? `<span aria-current="page">${c.x(a, e)}</span>` : `<a href="#">${c.x(a, e)}</a>`}</li>`).join('')}</ol></nav>`;
}
function pagination(c, current = 2, total = 5) {
  const lab = c.mode === 'ar' ? ['السابق', 'التالي', 'صفحة'] : ['Previous', 'Next', 'Page'];
  let s = `<nav class="siraj-pagination" aria-label="${c.mode === 'ar' ? 'الصفحات' : 'Pagination'}"><ul><li><a class="siraj-page" href="#" aria-label="${lab[0]}">${ic('chevron-left')}</a></li>`;
  for (let i = 1; i <= total; i++) s += `<li><a class="siraj-page" href="#"${i === current ? ' aria-current="page"' : ''} aria-label="${lab[2]} ${i}">${i}</a></li>`;
  return s + `<li><a class="siraj-page" href="#" aria-label="${lab[1]}">${ic('chevron-right')}</a></li></ul></nav>`;
}

// ── forms ────────────────────────────────────────────────────────────────────
function field(c, { id, label, type = 'text', hint, error, required = false, value = '', state = '', placeholder = '', icon = '', attrs = '' }) {
  const describedBy = [hint ? `${id}-h` : '', error ? `${id}-e` : ''].filter(Boolean).join(' ');
  const input = type === 'textarea'
    ? `<textarea class="siraj-textarea" id="${id}" name="${id}"${required ? ' required' : ''}${describedBy ? ` aria-describedby="${describedBy}"` : ''}${state === 'invalid' ? ' aria-invalid="true"' : ''}${placeholder ? ` placeholder="${placeholder}"` : ''} ${attrs}>${value}</textarea>`
    : `<input class="siraj-input" id="${id}" name="${id}" type="${type}"${value ? ` value="${value}"` : ''}${required ? ' required' : ''}${describedBy ? ` aria-describedby="${describedBy}"` : ''}${state === 'invalid' ? ' aria-invalid="true"' : ''}${placeholder ? ` placeholder="${placeholder}"` : ''} ${attrs}>`;
  return `<div class="siraj-field${state === 'invalid' ? ' is-invalid' : ''}${state === 'valid' ? ' is-valid' : ''}"${state === 'valid' ? ' data-show-valid' : ''}>
    <label class="siraj-field__label" for="${id}">${label}${required ? '<span class="siraj-field__req" aria-hidden="true">*</span>' : ''}</label>
    ${icon ? `<div class="siraj-input-group">${ic(icon)}${input}</div>` : input}
    ${hint ? `<div class="siraj-field__hint" id="${id}-h">${hint}</div>` : ''}
    ${error ? `<div class="siraj-field__error" id="${id}-e">${ic('alert')}<span>${error}</span></div>` : ''}
    ${state === 'valid' ? `<div class="siraj-field__success">${ic('check', 'siraj-icon--sm')}<span>${c.x('تمّ التحقق', 'Looks good')}</span></div>` : ''}
  </div>`;
}
function select(c, { id, label, options, hint }) {
  return `<div class="siraj-field"><label class="siraj-field__label" for="${id}">${label}</label><div class="siraj-select"><select id="${id}" name="${id}">${options.map((o) => `<option>${o}</option>`).join('')}</select>${ic('chevron-down')}</div>${hint ? `<div class="siraj-field__hint">${hint}</div>` : ''}</div>`;
}
function search(c, id = 'q', withButton = true) {
  return `<form class="siraj-search" role="search" onsubmit="return false"><label class="siraj-sr-only" for="${id}">${c.x('بحث', 'Search')}</label><div class="siraj-input-group">${ic('search')}<input class="siraj-input" id="${id}" type="search" placeholder="${c.mode === 'ar' ? 'ابحث في الوحدات والمستندات' : 'Search units and documents'}"><button class="siraj-search__clear" type="button" aria-label="${c.mode === 'ar' ? 'مسح' : 'Clear'}" hidden>${ic('close')}</button></div>${withButton ? `<button class="siraj-btn siraj-btn--primary" type="submit">${c.x('بحث', 'Search')}</button>` : ''}</form>`;
}
function filterChips(c, single = false) {
  const chips = [['الكل', 'All', true, 'grid'], ['شقق سكنية', 'Apartments', false, 'apartment'], ['محلات تجارية', 'Shops', false, 'shop']];
  return `<div class="siraj-filter" role="group" aria-label="${c.mode === 'ar' ? 'تصفية حسب النوع' : 'Filter by type'}"${single ? ' data-single' : ''}><span class="siraj-filter__label siraj-label">${c.x('النوع', 'Type')}</span>${chips.map(([a, e, on, i]) => `<button class="siraj-chip" type="button" data-siraj-toggle aria-pressed="${on}">${ic(i)}${c.x(a, e)}</button>`).join('')}</div>`;
}
function tabs(c, id, items) {
  return `<div class="siraj-tabs" data-siraj-tabs><div class="siraj-tabs__list" role="tablist" aria-label="${c.mode === 'ar' ? 'أقسام' : 'Sections'}">${items.map(([a, e], i) => `<button class="siraj-tab" role="tab" type="button" id="${id}-t${i}" aria-controls="${id}-p${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${c.x(a, e)}</button>`).join('')}</div>${items.map(([, , body], i) => `<div class="siraj-tabs__panel" role="tabpanel" id="${id}-p${i}" aria-labelledby="${id}-t${i}" tabindex="0"${i ? ' hidden' : ''}>${body}</div>`).join('')}</div>`;
}
function accordion(c, id, items, openFirst = true) {
  return `<div class="siraj-accordion" data-siraj-accordion data-single>${items.map(([qa, qe, aa, ae], i) => `<div class="siraj-accordion__item"><h3 style="margin:0"><button class="siraj-accordion__trigger" type="button" id="${id}-b${i}" aria-expanded="${openFirst && i === 0}" aria-controls="${id}-p${i}"><span>${c.x(qa, qe)}</span>${ic('chevron-down')}</button></h3><div class="siraj-accordion__panel" id="${id}-p${i}" role="region" aria-labelledby="${id}-b${i}"${openFirst && i === 0 ? '' : ' hidden'}>${c.x(aa, ae)}</div></div>`).join('')}</div>`;
}
const FAQ = [
  ['ما هو المشروع؟', 'What is the project?', 'مشروعٌ في مسقط: شقق سكنية ومحلات تجارية، في مبنى صُمّم ليحتفي بالضوء والمادة والتفاصيل.', 'Siraj is a project in Muscat with residential apartments and retail shops, designed around light, material and detail.'],
  ['كيف أتواصل مع فريق المبيعات؟', 'How do I reach the sales team?', `اتصل على ${PHONE_D} أو راسلنا عبر واتساب على الرقم نفسه، أو تابعنا على إنستغرام ${HANDLE}.`, `Call ${PHONE_D}, message us on WhatsApp on the same number, or follow ${HANDLE} on Instagram.`],
  ['متى تُعلن الأسعار والمساحات؟', 'When are prices and areas announced?', 'تُعلن الأسعار والمساحات ومواعيد التسليم عند اعتمادها رسميًا، وتظهر هنا تلقائيًا.', 'Prices, areas and handover dates are published once officially confirmed and appear here automatically.'],
];

// ── cards ────────────────────────────────────────────────────────────────────
function propertyCard(c, { kind = 'apartment', image = 'frontBlue', tag } = {}) {
  const isShop = kind === 'shop';
  return `<article class="siraj-card siraj-property-card">
    <div class="siraj-card__media">${img(c, image, { lazy: true })}${tag ? `<span class="siraj-tag siraj-tag--on-photo"><span class="siraj-lumen"></span>${tag}</span>` : ''}<button class="siraj-fav" type="button" data-siraj-toggle aria-pressed="false" aria-label="${c.mode === 'ar' ? 'أضف إلى المفضّلة' : 'Save to favourites'}">${ic('heart')}</button></div>
    <div class="siraj-card__body">
      <h3 class="siraj-card__title">${isShop ? c.x('محل تجاري', 'Retail shop') : c.x('شقة سكنية', 'Residential apartment')}</h3>
      <div class="siraj-property-card__loc">${ic('location')}${c.x('مسقط', 'Muscat')}</div>
      <div class="siraj-facts" style="--_n:3">
        <div class="siraj-fact"><span class="siraj-fact__label">${ic('area')}${c.x('المساحة', 'Area')}</span><span class="siraj-fact__value">${SLOT}</span></div>
        <div class="siraj-fact"><span class="siraj-fact__label">${ic(isShop ? 'shop' : 'bedroom')}${isShop ? c.x('الواجهة', 'Frontage') : c.x('الغرف', 'Rooms')}</span><span class="siraj-fact__value">${SLOT}</span></div>
        <div class="siraj-fact"><span class="siraj-fact__label">${ic('tag')}${c.x('السعر', 'Price')}</span><span class="siraj-fact__value">${SLOT}</span></div>
      </div>
    </div>
    <div class="siraj-card__footer"><span class="siraj-small siraj-muted">${c.x('التفاصيل بانتظار الاعتماد', 'Details pending confirmation')}</span><a class="siraj-btn siraj-btn--link" href="#">${c.x('التفاصيل', 'Details')}${ic('arrow-right')}</a></div>
  </article>`;
}
function projectCard(c, { image = 'cornerBlue' } = {}) {
  return `<article class="siraj-card siraj-project-card">
    <a class="siraj-card__media" href="#project">${img(c, image, { lazy: true })}</a>
    <div class="siraj-card__body">
      <div class="siraj-project-card__meta"><span class="siraj-lumen"></span>${c.x('مسقط', 'Muscat')}</div>
      <h3 class="siraj-project-card__title">${LETT(c, false, 56)}</h3>
      <p class="siraj-card__text">${c.x('شقق سكنية ومحلات تجارية', 'Residential apartments and retail shops')}</p>
      <a class="siraj-btn siraj-btn--link" href="#project" style="align-self:flex-start">${c.x('استكشف المشروع', 'Explore the project')}${ic('arrow-right')}</a>
    </div>
  </article>`;
}
function infoCard(c, { icon, a, e, ta, te }) {
  return `<article class="siraj-card"><div class="siraj-card__body">${ic(icon, 'siraj-icon--xl')}<h3 class="siraj-card__title">${c.x(a, e)}</h3><p class="siraj-card__text">${c.x(ta, te)}</p></div></article>`;
}

// ── data display ─────────────────────────────────────────────────────────────
const STAT_SET = [['الشقق السكنية', 'Apartments'], ['المحلات التجارية', 'Retail shops'], ['المساحات', 'Areas'], ['موعد التسليم', 'Handover']];
function stats(c, set = STAT_SET) {
  return `<div class="siraj-stats" style="--_n:${set.length}">${set.map(([a, e, v]) => `<div class="siraj-stat"><span class="siraj-stat__value">${v || '—'}</span><span class="siraj-stat__label siraj-label">${c.x(a, e)}</span></div>`).join('')}</div>`;
}
function table(c) {
  const rows = [['شقة سكنية', 'Residential apartment', 'apartment'], ['شقة سكنية', 'Residential apartment', 'apartment'], ['محل تجاري', 'Retail shop', 'shop'], ['محل تجاري', 'Retail shop', 'shop']];
  return `<div class="siraj-table-wrap" tabindex="0" role="region" aria-label="${c.mode === 'ar' ? 'جدول الوحدات' : 'Units table'}"><table class="siraj-table"><caption>${c.x('الوحدات — بانتظار البيانات المعتمدة', 'Units — awaiting confirmed data')}</caption><thead><tr><th scope="col">${c.x('النوع', 'Type')}</th><th scope="col">${c.x('الرمز', 'Code')}</th><th scope="col" class="is-num">${c.x('المساحة', 'Area')}</th><th scope="col" class="is-num">${c.x('السعر', 'Price')}</th><th scope="col">${c.x('الحالة', 'Status')}</th></tr></thead><tbody>${rows.map(([a, e, i]) => `<tr><td class="is-strong"><span style="display:inline-flex;gap:10px;align-items:center">${ic(i, 'siraj-icon--md')}${c.x(a, e)}</span></td><td>${SLOT}</td><td class="is-num">${SLOT}</td><td class="is-num">${SLOT}</td><td><span class="siraj-tag"><span class="siraj-lumen"></span>${c.x('بانتظار الاعتماد', 'Pending')}</span></td></tr>`).join('')}</tbody></table></div>`;
}
function chartCard(c, kind, { a, e, legend = true } = {}) {
  const svg = kind === 'bar' ? L.barChart(c, { second: [30, 52, 48, 60, 58, 72] }) : kind === 'line' ? L.lineChart(c) : L.donutChart(c, {});
  const leg = kind === 'donut'
    ? [['data-1', 'السلسلة أ', 'Series A'], ['data-2', 'السلسلة ب', 'Series B'], ['data-5', 'السلسلة ج', 'Series C']]
    : [['data-1', 'السلسلة أ', 'Series A'], ['data-2', 'السلسلة ب', 'Series B']];
  return `<figure class="siraj-chart" style="margin:0"><div class="siraj-chart__head"><figcaption class="siraj-chart__title">${c.x(a, e)}</figcaption><span class="siraj-small siraj-muted">${c.x('مؤشر 0–100', 'Index 0–100')}</span></div>${svg}${legend ? `<div class="siraj-legend">${leg.map(([v, la, le]) => `<span><i style="background:var(--siraj-color-${v})"></i>${c.x(la, le)}</span>`).join('')}</div>` : ''}</figure>`;
}

// ── overlays + feedback ──────────────────────────────────────────────────────
function dialogBox(c, id, { live = false } = {}) {
  const inner = `<div class="siraj-dialog" role="dialog" aria-modal="${live}" aria-labelledby="${id}-t" aria-describedby="${id}-d">
    <div class="siraj-dialog__head"><h2 class="siraj-dialog__title" id="${id}-t">${c.x('حجز موعد زيارة', 'Book a visit')}</h2><button class="siraj-btn siraj-btn--icon siraj-btn--ghost" type="button" data-siraj-close aria-label="${c.mode === 'ar' ? 'إغلاق' : 'Close'}">${ic('close')}</button></div>
    <div class="siraj-dialog__body"><p id="${id}-d" class="siraj-muted" style="margin-bottom:20px">${c.x('اترك رقمك وسيتصل بك فريق المبيعات لتحديد الموعد.', 'Leave your number and the sales team will call to arrange a time.')}</p>${field(c, { id: `${id}-phone`, label: c.x('رقم الهاتف', 'Phone number'), type: 'tel', required: true, attrs: 'inputmode="numeric" autocomplete="tel"' })}</div>
    <div class="siraj-dialog__foot"><button class="siraj-btn siraj-btn--ghost" type="button" data-siraj-close>${c.x('إلغاء', 'Cancel')}</button><button class="siraj-btn siraj-btn--primary" type="button" data-siraj-close>${c.x('أرسل الطلب', 'Send request')}</button></div>
  </div>`;
  return live ? `<div class="siraj-overlay" id="${id}" hidden>${inner}</div>` : inner;
}
function drawerBox(c, id, { live = false } = {}) {
  const inner = `<div class="siraj-drawer" role="dialog" aria-modal="${live}" aria-labelledby="${id}-t">
    <div class="siraj-drawer__head"><h2 class="siraj-drawer__title" id="${id}-t">${c.x('تصفية الوحدات', 'Filter units')}</h2><button class="siraj-btn siraj-btn--icon siraj-btn--ghost" type="button" data-siraj-close aria-label="${c.mode === 'ar' ? 'إغلاق' : 'Close'}">${ic('close')}</button></div>
    <div class="siraj-drawer__body"><div class="siraj-stack" style="--siraj-gap:24px">${filterChips(c, true)}${select(c, { id: `${id}-s`, label: c.x('الترتيب', 'Sort'), options: c.mode === 'ar' ? ['الأحدث', 'المساحة', 'السعر'] : ['Newest', 'Area', 'Price'] })}<label class="siraj-check"><input type="checkbox" checked> ${c.x('الوحدات المتاحة فقط', 'Available units only')}</label></div></div>
    <div class="siraj-drawer__foot"><button class="siraj-btn siraj-btn--secondary" type="button" data-siraj-close>${c.x('إعادة الضبط', 'Reset')}</button><button class="siraj-btn siraj-btn--primary" type="button" data-siraj-close>${c.x('عرض النتائج', 'Show results')}</button></div>
  </div>`;
  return live ? `<div class="siraj-overlay siraj-overlay--drawer" id="${id}" hidden>${inner}</div>` : inner;
}
function banner(c, live = true) {
  return `<div class="siraj-banner" role="region" aria-label="${c.mode === 'ar' ? 'إعلان' : 'Announcement'}"><div class="siraj-container siraj-banner__inner"><span class="siraj-lumen"></span><span class="siraj-banner__text">${c.x('سجّل اهتمامك بالمشروع ليصلك الإعلان الأول.', 'Register your interest in Siraj to hear first.')} <a href="#contact">${c.x('سجّل الآن', 'Register now')}</a></span>${live ? `<button class="siraj-banner__close" type="button" data-siraj-dismiss aria-label="${c.mode === 'ar' ? 'إغلاق الإعلان' : 'Dismiss'}">${ic('close')}</button>` : ''}</div></div>`;
}
function alert(c, kind) {
  const m = {
    info: ['info', 'معلومة', 'Information', 'تظهر الأسعار والمساحات عند اعتمادها.', 'Prices and areas appear once confirmed.'],
    success: ['check', 'تم استلام طلبك', 'Request received', 'سيتواصل معك فريق المبيعات قريبًا.', 'The sales team will be in touch shortly.'],
    warning: ['alert', 'بيانات غير مكتملة', 'Incomplete data', 'بعض الحقول تنتظر بيانات معتمدة.', 'Some fields are awaiting confirmed data.'],
    error: ['alert', 'تعذّر الإرسال', 'Could not send', 'تحقّق من الاتصال ثم أعد المحاولة.', 'Check your connection and try again.'],
  }[kind];
  return `<div class="siraj-alert siraj-alert--${kind}" role="${kind === 'error' ? 'alert' : 'status'}">${ic(m[0])}<div class="siraj-alert__title">${c.x(m[1], m[2])}</div><button class="siraj-banner__close" type="button" data-siraj-dismiss aria-label="${c.mode === 'ar' ? 'إغلاق' : 'Dismiss'}">${ic('close')}</button><div class="siraj-alert__text">${c.x(m[3], m[4])}</div></div>`;
}
function cta(c) {
  return `<section class="siraj-cta" data-theme="dark"><div class="siraj-cta__body"><div class="siraj-eyebrow"><span class="siraj-lumen"></span>${c.x('مسقط', 'Muscat')}</div><h2 class="siraj-cta__title">${c.x('في قلب المدينة، بيتٌ من ضوء.', 'In the heart of the city, a home of light.')}</h2><p style="max-width:44ch">${c.x('تواصل مع فريق المبيعات لمعرفة التفاصيل عند الإعلان.', 'Talk to the sales team to hear the details at launch.')}</p><div class="siraj-btn-row"><a class="siraj-btn siraj-btn--primary" href="tel:${PHONE}">${ic('call')}${ltr(PHONE_D)}</a><a class="siraj-btn siraj-btn--secondary" href="https://wa.me/968${PHONE}">${ic('whatsapp')}${c.x('واتساب', 'WhatsApp')}</a></div></div><div class="siraj-cta__silk"><img src="${SILK(c.R, 'Ribbon-Sweep', '4x5')}" alt="${c.mode === 'ar' ? 'حرير حقيقي بلون العنابي' : 'Real maroon silk'}" width="800" height="1000" loading="lazy"></div></section>`;
}
function empty(c) {
  return `<div class="siraj-empty">${ic('search')}<h3 class="siraj-empty__title">${c.x('لا توجد نتائج', 'No results')}</h3><p class="siraj-empty__text">${c.x('لم نجد وحدات تطابق هذا التصفية. جرّب نوعًا آخر أو امسح التصفية.', 'No units match this filter. Try another type or clear the filter.')}</p><button class="siraj-btn siraj-btn--secondary" type="button">${c.x('امسح التصفية', 'Clear filter')}</button></div>`;
}
function skeletonCard() {
  return `<div class="siraj-card" aria-busy="true"><div class="siraj-skeleton siraj-skeleton--media"></div><div class="siraj-card__body"><div class="siraj-skeleton siraj-skeleton--title"></div><div class="siraj-skeleton siraj-skeleton--text" style="width:90%"></div><div class="siraj-skeleton siraj-skeleton--text" style="width:70%"></div></div></div>`;
}

// ── real-estate ──────────────────────────────────────────────────────────────
function hero(c, { image = 'kvLantern', titleA = ['أوّلُ', 'الضوء.'], titleE = ['First', 'light.'] } = {}) {
  return `<section class="siraj-container"><div class="siraj-hero">
    <div class="siraj-hero__body">
      <div class="siraj-eyebrow"><span class="siraj-lumen"></span>${c.x('مسقط', 'Muscat')}</div>
      <h1 class="siraj-hero__title">${c.x(`<span class="siraj-t-light">${titleA[0]}</span> <span class="siraj-t-heavy">${titleA[1]}</span>`, `<span class="siraj-t-light">${titleE[0]}</span> <span class="siraj-t-heavy">${titleE[1]}</span>`)}</h1>
      ${LETT(c, true, 72)}<p class="siraj-hero__lead">${c.x('شقق سكنية ومحلات تجارية في مسقط.', 'Residential apartments and retail shops in Muscat.')}</p>
      <div class="siraj-btn-row"><a class="siraj-btn siraj-btn--primary siraj-btn--lg" href="#contact">${c.x('سجّل اهتمامك', 'Register interest')}</a><a class="siraj-btn siraj-btn--ghost siraj-btn--lg" href="#brochure">${ic('download')}${c.x('كتيّب المشروع', 'Brochure')}</a></div>
    </div>
    <div class="siraj-hero__media siraj-silk-corner">${img(c, image)}</div>
  </div></section>`;
}
function overview(c) {
  return `<div class="siraj-overview">
    <div class="siraj-stack" style="--siraj-gap:20px"><div class="siraj-eyebrow"><span class="siraj-lumen"></span>${c.x('عن المشروع', 'About the project')}</div><h2 class="siraj-t-h2">${c.x('مدروسة في كل تفاصيلها. مبنية لتدوم.', 'Considered in every detail. Built to last.')}</h2><p class="siraj-t-body siraj-measure">${c.x('في مسقط: شقق سكنية ومحلات تجارية. واجهة بيضاء هادئة، وطوب مثقّب يعبره الضوء، ونباتات تنحدر من الشرفات؛ عمارة تُرى في النهار وتضيء في المساء.', 'Siraj is a building in Muscat bringing together residential apartments and retail shops. A calm white façade, perforated brick that light passes through and planting falling from the balconies — architecture seen by day and glowing by evening.')}</p></div>
    <dl class="siraj-specs">
      ${[['location', 'الموقع', 'Location', c.x('مسقط', 'Muscat')], ['building', 'النوع', 'Type', c.x('شقق سكنية ومحلات تجارية', 'Apartments and retail shops')], ['apartment', 'الوحدات السكنية', 'Apartments', SLOT], ['shop', 'المحلات التجارية', 'Retail shops', SLOT], ['area', 'المساحات', 'Areas', SLOT], ['handover', 'التسليم', 'Handover', SLOT]].map(([i, a, e, v]) => `<div class="siraj-spec"><dt class="siraj-spec__label">${ic(i)}${c.x(a, e)}</dt><dd class="siraj-spec__value">${v}</dd></div>`).join('')}
    </dl>
  </div>`;
}
function unitCard(c, kind = 'apartment') {
  const shop = kind === 'shop';
  return `<article class="siraj-card siraj-unit-card"><div class="siraj-card__body">
    <div class="siraj-unit-card__head"><div class="siraj-unit-card__type">${ic(shop ? 'shop' : 'apartment')}<div><h3 class="siraj-card__title">${shop ? c.x('محل تجاري', 'Retail shop') : c.x('شقة سكنية', 'Residential apartment')}</h3><div class="siraj-small siraj-muted">${c.x('مسقط', 'Muscat')}</div></div></div><span class="siraj-tag"><span class="siraj-lumen"></span>${c.x('بانتظار الاعتماد', 'Pending')}</span></div>
    <div class="siraj-facts" style="--_n:3"><div class="siraj-fact"><span class="siraj-fact__label">${ic('area')}${c.x('المساحة', 'Area')}</span><span class="siraj-fact__value">${SLOT}</span></div><div class="siraj-fact"><span class="siraj-fact__label">${ic(shop ? 'view' : 'bedroom')}${shop ? c.x('الواجهة', 'Frontage') : c.x('الغرف', 'Rooms')}</span><span class="siraj-fact__value">${SLOT}</span></div><div class="siraj-fact"><span class="siraj-fact__label">${ic(shop ? 'parking' : 'bathroom')}${shop ? c.x('المواقف', 'Parking') : c.x('الحمّامات', 'Baths')}</span><span class="siraj-fact__value">${SLOT}</span></div></div>
    ${price(c)}
  </div><div class="siraj-card__footer"><a class="siraj-btn siraj-btn--link" href="#">${c.x('تفاصيل الوحدة', 'Unit details')}${ic('arrow-right')}</a><button class="siraj-btn siraj-btn--icon siraj-btn--ghost siraj-btn--sm" type="button" aria-label="${c.mode === 'ar' ? 'مشاركة' : 'Share'}">${ic('share', 'siraj-icon--mirror')}</button></div></article>`;
}
function unitDetails(c) {
  return `<div class="siraj-unit-details"><div class="siraj-stack"><div class="siraj-eyebrow"><span class="siraj-lumen"></span>${c.x('تفاصيل الوحدة', 'Unit details')}</div><h3 class="siraj-t-h3">${c.x('شقة سكنية', 'Residential apartment')}</h3>${price(c)}<div class="siraj-btn-row"><button class="siraj-btn siraj-btn--primary" type="button">${ic('reservation')}${c.x('اطلب الحجز', 'Request reservation')}</button><button class="siraj-btn siraj-btn--secondary" type="button">${ic('floor-plan')}${c.x('المخطط', 'Floor plan')}</button></div></div>
  <dl class="siraj-specs">${[['area', 'المساحة الداخلية', 'Internal area'], ['bedroom', 'غرف النوم', 'Bedrooms'], ['bathroom', 'الحمّامات', 'Bathrooms'], ['parking', 'المواقف', 'Parking'], ['layers', 'الطابق', 'Floor'], ['sun', 'الاتجاه', 'Orientation']].map(([i, a, e]) => `<div class="siraj-spec"><dt class="siraj-spec__label">${ic(i)}${c.x(a, e)}</dt><dd class="siraj-spec__value">${SLOT}</dd></div>`).join('')}</dl></div>`;
}
function price(c) {
  return `<div class="siraj-price"><span class="siraj-label siraj-muted">${c.x('السعر', 'Price')}</span><span class="siraj-price__value">—<span class="siraj-price__unit">${c.x('ر.ع.', 'OMR')}</span></span><span class="siraj-price__note">${c.x('يُعلن عند الاعتماد', 'Announced on confirmation')}</span></div>`;
}
function area(c) {
  return `<div class="siraj-area">${ic('area')}<div><div class="siraj-label siraj-muted">${c.x('المساحة', 'Area')}</div><span class="siraj-area__value">—</span><span class="siraj-area__unit">م²</span></div></div>`;
}
function availability(c) {
  return `<div class="siraj-availability"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><strong class="siraj-strong" style="font-weight:500">${c.x('التوفّر', 'Availability')}</strong><span class="siraj-small siraj-muted">${c.x('بانتظار البيانات المعتمدة', 'Awaiting confirmed data')}</span></div><div class="siraj-availability__bar" role="img" aria-label="${c.mode === 'ar' ? 'لا توجد بيانات بعد' : 'No data yet'}"></div><div class="siraj-availability__legend">${[['متاح', 'Available', 'var(--siraj-success)'], ['محجوز', 'Reserved', 'var(--siraj-warning)'], ['مباع', 'Sold', 'var(--siraj-accent)']].map(([a, e, col]) => `<div class="siraj-availability__item"><span><i style="background:${col};transform:rotate(45deg)"></i>${c.x(a, e)}</span><strong>—</strong></div>`).join('')}</div></div>`;
}
function floorPlanBox(c) {
  return `<div class="siraj-floorplan"><div class="siraj-floorplan__tools"><div class="siraj-filter" data-single role="group" aria-label="${c.mode === 'ar' ? 'نوع المخطط' : 'Plan type'}"><button class="siraj-chip" type="button" data-siraj-toggle aria-pressed="true">${c.x('المخطط', 'Plan')}</button><button class="siraj-chip" type="button" data-siraj-toggle aria-pressed="false">${c.x('الأبعاد', 'Dimensions')}</button></div><div class="siraj-btn-row" style="gap:4px"><button class="siraj-btn siraj-btn--icon siraj-btn--sm" type="button" aria-label="${c.mode === 'ar' ? 'تكبير' : 'Zoom in'}">${ic('plus')}</button><button class="siraj-btn siraj-btn--icon siraj-btn--sm" type="button" aria-label="${c.mode === 'ar' ? 'تصغير' : 'Zoom out'}">${ic('minus')}</button></div></div><div class="siraj-floorplan__canvas">${L.floorPlan(c)}</div><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><span class="siraj-small siraj-muted">${c.x('المساحة الإجمالية', 'Total area')} <span class="siraj-num">—</span> م²</span><a class="siraj-btn siraj-btn--link" href="#">${c.x('تنزيل المخطط', 'Download plan')}${ic('download')}</a></div></div>`;
}
// The first four are visible in the approved renders; the rest are component types for the docs only.
const AMEN = [['parking', 'مواقف السيارات', 'Parking'], ['shop', 'محلات في المبنى', 'Shops in the building'], ['sustainability', 'النباتات في الشرفات', 'Balcony planting'], ['sun', 'الضوء الطبيعي', 'Daylight'], ['elevator', 'المصاعد', 'Elevators'], ['security', 'الأمن والدخول', 'Security & access'], ['amenities', 'خدمات المبنى', 'Building services'], ['key', 'التسليم', 'Handover']];
function amenities(c, n = 8) {
  return `<ul class="siraj-amenities">${AMEN.slice(0, n).map(([i, a, e]) => `<li class="siraj-amenity">${ic(i)}<span class="siraj-amenity__label">${c.x(a, e)}</span><span class="siraj-amenity__value">${c.x('التفاصيل —', 'Details —')}</span></li>`).join('')}</ul>`;
}
function location(c) {
  return `<div class="siraj-location"><div class="siraj-stack" style="--siraj-gap:20px;justify-content:center"><div class="siraj-eyebrow"><span class="siraj-lumen"></span>${c.x('الموقع', 'Location')}</div><h3 class="siraj-t-h3">${c.x('مسقط', 'Muscat')}</h3><p class="siraj-muted">${c.x('يُعلن الموقع التفصيلي والمعالم القريبة عند الاعتماد.', 'The detailed location and nearby landmarks are published on confirmation.')}</p><div class="siraj-btn-row"><a class="siraj-btn siraj-btn--secondary" href="#">${ic('direction')}${c.x('الاتجاهات', 'Directions')}</a><a class="siraj-btn siraj-btn--ghost" href="tel:${PHONE}">${ic('call')}${c.x('اسأل عن الموقع', 'Ask about the location')}</a></div></div>${L.mapTile(c, {})}</div>`;
}
function progressSteps(c) {
  const steps = [['التصميم', 'Design'], ['التراخيص', 'Permits'], ['الهيكل', 'Structure'], ['التشطيبات', 'Finishes'], ['التسليم', 'Handover']];
  return `<div class="siraj-stack" style="--siraj-gap:20px"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap"><strong class="siraj-strong" style="font-weight:500">${c.x('سير البناء', 'Construction progress')}</strong><span class="siraj-small siraj-muted">${c.x('نسبة الإنجاز', 'Completion')} <span class="siraj-num">—</span></span></div><div class="siraj-progress" role="progressbar" aria-label="${c.mode === 'ar' ? 'نسبة الإنجاز غير معلنة' : 'Completion not published'}"><div class="siraj-progress__bar" style="--_v:0%"></div></div><ol class="siraj-steps" style="--_n:5">${steps.map(([a, e]) => `<li class="siraj-step"><span class="siraj-step__title">${c.x(a, e)}</span><span class="siraj-step__state">${c.x('التحديث —', 'Update —')}</span></li>`).join('')}</ol></div>`;
}
function metrics(c) {
  return `<div class="siraj-metrics">${[['roi', 'العائد المتوقّع', 'Expected yield'], ['tag', 'سعر المتر المربع', 'Price per m²'], ['growth', 'نمو القيمة المتوقّع', 'Expected appreciation'], ['payment', 'الدفعة الأولى', 'Down payment']].map(([i, a, e]) => `<div class="siraj-metric">${ic(i)}<span class="siraj-metric__value">—</span><span class="siraj-metric__label">${c.x(a, e)}</span></div>`).join('')}</div>`;
}
function paymentPlan(c) {
  return `<div class="siraj-plan">${[['دفعة الحجز', 'Reservation', 'عند توقيع طلب الحجز', 'On signing the reservation'], ['أثناء البناء', 'During construction', 'على مراحل مرتبطة بالإنجاز', 'In stages linked to progress'], ['عند التسليم', 'On handover', 'عند استلام المفتاح', 'On receiving the key']].map(([a, e, da, de], i) => `<div class="siraj-plan__row"><span class="siraj-plan__idx">${i + 1}</span><span><span class="siraj-plan__name">${c.x(a, e)}</span><span class="siraj-plan__desc">${c.x(da, de)}</span></span><span class="siraj-plan__pct">—</span></div>`).join('')}</div>`;
}
const GAL = ['cornerBlue', 'frontBlue', 'sideBlue', 'cornerDay', 'frontDay', 'sideDay'];
function gallery(c, { side = false } = {}) {
  return `<div class="siraj-gallery${side ? ' siraj-gallery--side' : ''}" data-siraj-gallery><div class="siraj-gallery__main">${img(c, GAL[0])}<div class="siraj-gallery__caption">${c.x('تصوّر معماري — ', 'Architectural visualisation — ')}${c.x(IMG[GAL[0]].ar, IMG[GAL[0]].en)}</div></div><div class="siraj-gallery__thumbs">${GAL.map((k, i) => `<button class="siraj-gallery__thumb" type="button" aria-current="${i === 0}" data-full="${imgUrl(c.D, k)}" data-caption="${c.mode === 'ar' ? 'تصوّر معماري — ' + IMG[k].ar : 'Architectural visualisation — ' + IMG[k].en}" aria-label="${c.mode === 'ar' ? IMG[k].ar : IMG[k].en}">${img(c, k, { thumb: true })}</button>`).join('')}</div></div>`;
}
function download(c) {
  return `<div class="siraj-download" id="brochure">${ic('brochure')}<div><div class="siraj-download__title">${c.x('كتيّب المشروع', 'Project brochure')}</div><div class="siraj-download__meta">PDF · ${c.x('الحجم', 'Size')} —</div></div><a class="siraj-btn siraj-btn--primary" href="#">${ic('download')}${c.x('تنزيل الكتيّب', 'Download brochure')}</a></div>`;
}
function contactSales(c, { form = false } = {}) {
  return `<section class="siraj-contact" id="contact" aria-labelledby="contact-t"><div class="siraj-stack" style="--siraj-gap:8px"><div class="siraj-eyebrow"><span class="siraj-lumen"></span>${c.x('فريق المبيعات', 'Sales team')}</div><h2 class="siraj-contact__title" id="contact-t">${c.x('تحدّث إلينا عن المشروع', 'Talk to us about the project')}</h2></div>
    <div class="siraj-contact__channels">
      <a class="siraj-channel" href="tel:${PHONE}">${ic('call')}<span><span class="siraj-channel__label">${c.x('اتصال', 'Call')}</span><span class="siraj-channel__value">${PHONE_D}</span></span></a>
      <a class="siraj-channel" href="https://wa.me/968${PHONE}">${ic('whatsapp')}<span><span class="siraj-channel__label">${c.x('واتساب', 'WhatsApp')}</span><span class="siraj-channel__value">${PHONE_D}</span></span></a>
      <a class="siraj-channel" href="https://instagram.com/sirajproperties">${ic('instagram')}<span><span class="siraj-channel__label">${c.x('إنستغرام', 'Instagram')}</span><span class="siraj-channel__value">${HANDLE}</span></span></a>
    </div>${form ? leadForm(c) : ''}</section>`;
}
function leadForm(c, id = 'lead') {
  return `<form class="siraj-form" data-siraj-validate aria-label="${c.mode === 'ar' ? 'نموذج تسجيل الاهتمام' : 'Register interest form'}">
    <div class="siraj-form__row">${field(c, { id: `${id}-name`, label: c.x('الاسم', 'Name'), required: true, error: c.x('اكتب اسمك لنتمكّن من مخاطبتك.', 'Enter your name so we can address you.'), attrs: 'autocomplete="name"' })}${field(c, { id: `${id}-phone`, label: c.x('رقم الهاتف', 'Phone number'), type: 'tel', required: true, hint: c.x('ثمانية أرقام', 'Eight digits'), error: c.x('اكتب رقمًا من ثمانية أرقام.', 'Enter an eight-digit number.'), attrs: 'inputmode="numeric" pattern="[0-9]{8}" autocomplete="tel"' })}</div>
    ${select(c, { id: `${id}-type`, label: c.x('أهتمّ بـ', 'Interested in'), options: c.mode === 'ar' ? ['شقة سكنية', 'محل تجاري'] : ['Residential apartment', 'Retail shop'] })}
    <label class="siraj-check"><input type="checkbox" required> ${c.x('أوافق على أن يتواصل معي فريق المبيعات.', 'I agree to be contacted by the sales team.')}</label>
    <div class="siraj-btn-row"><button class="siraj-btn siraj-btn--primary siraj-btn--lg" type="submit">${c.x('سجّل اهتمامك', 'Register interest')}</button></div>
    <div data-siraj-success hidden tabindex="-1">${alert(c, 'success')}</div>
  </form>`;
}

module.exports = { SLOT, ltr, IGH, LETT, img, nav, header, menuDrawer, contactLine, footer, sidebar, breadcrumb, pagination, field, select, search, filterChips, tabs, accordion, FAQ, propertyCard, projectCard, infoCard, stats, STAT_SET, table, chartCard, dialogBox, drawerBox, banner, alert, cta, empty, skeletonCard, hero, overview, unitCard, unitDetails, price, area, availability, floorPlanBox, amenities, location, progressSteps, metrics, paymentPlan, gallery, GAL, download, contactSales, leadForm };
