#!/usr/bin/env node
// SIRAJ Design System v1.0 — documentation site, example screens, template index, exports and QA.
//
//   node tools/build-design-system.js        (tokens → design-system/build, css)
//   node tools/build-design-system-docs.js   (this file: docs + examples + PNG exports + QA report)
//
// Outputs  design-system/index.html, design-system/docs/*.html, design-system/examples/*.html,
//          design-system/exports/*.png (page captures), docs/qa/DESIGN_SYSTEM_QA.md
// Docs are bilingual (AR/EN toggle) for the team; example screens are public-facing and Arabic only.
// Unknown facts (prices, areas, unit counts, dates) always render as the data slot «—».
const fs = require('fs');
const path = require('path');
const L = require('../design-system/src/lib');
const K = require('../design-system/src/components');
const R = require('./lib/render');

const { DS, ROOT, TOKENS, MOTION, ICONS, t, tb, BI, AR, ic, section, spec, docPage, examplePage, esc, logoFixed, PHONE, HANDLE } = L;
const OUT = (...a) => path.join(DS, ...a);
const W = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };
const WIND = JSON.parse(fs.readFileSync(path.join(ROOT, 'motion-system/tokens/siraj-wind.json'), 'utf8'));
const CFG = L.cfg;

// contexts
const cDoc = (D, R) => ({ ...BI, D, R });
const cAr = (D, R) => ({ ...AR, D, R });
const DOCP = { D: '../', R: '../../' };

// token helpers
const val = (p) => p.split('.').reduce((o, k) => (o ? o[k] : undefined), TOKENS);
const resolve = (v) => (typeof v === 'string' && /^\{.+\}$/.test(v) ? resolve(val(v.slice(1, -1)).$value) : v);
const leaf = (o) => Object.entries(o).filter(([k]) => !k.startsWith('$'));

// ------------------------------------------------------------------------------------------------ pages
const pages = {};

// Overview -------------------------------------------------------------------------------------------
{
  const c = cDoc('', '../');
  const cards = L.DOCS_NAV.filter(([k]) => k !== 'index').map(([k, a, e, i]) => `<a class="siraj-card siraj-card--link doc-card" href="${L.docHref('', k)}"><div class="siraj-card__body">${ic(i, 'siraj-icon--lg')}<h3 class="siraj-card__title">${t(a, e)}</h3></div></a>`).join('');
  const body = section('what', 'ما هو نظام التصميم', 'What the system is', ['نظام واحد لكل ما تصنعه سراج على الشاشة والورق: رموز، طباعة، شبكات، مكوّنات، مكوّنات عقارية، أيقونات، خطافات حركة، وقوالب. كل قيمة تأتي من ملف رموز واحد، فلا يتباعد التصميم عن الكود.', 'One system for everything SIRAJ makes on screen and on paper: tokens, typography, grids, components, real-estate components, icons, motion hooks and templates. Every value comes from one token file, so design and code never drift.'],
    `<div class="doc-overview-grid doc-cards">${cards}</div>`)
    + section('files', 'الملفات', 'Files', null, `<div class="doc-table-wrap"><table class="siraj-table doc-table"><thead><tr><th>${t('الملف', 'File')}</th><th>${t('الغرض', 'Purpose')}</th></tr></thead><tbody>
      ${[['tokens/siraj-ds.tokens.json', 'مصدر كل الرموز (W3C Design Tokens)', 'Source of every token (W3C Design Tokens)'], ['build/siraj-ds.css · .js · .ts · .json', 'الرموز مولّدة لـ CSS وJavaScript وTypeScript', 'Generated tokens for CSS, JavaScript, TypeScript'], ['css/siraj-ds.css', 'نقطة الدخول: الرموز + الأساس + المكوّنات', 'Entry point: tokens + base + components'], ['components/siraj-ds.css · .js', 'المكوّنات والتفاعلات (بلا أطر عمل)', 'Components and interactions (framework-free)'], ['src/components.js', 'وصفات HTML لكل مكوّن', 'HTML recipes for every component'], ['examples/', 'شاشات نموذجية عربية', 'Arabic example screens'], ['exports/', 'لقطات PNG للصفحات', 'PNG captures of every page']].map(([f, a, e]) => `<tr><td><code>${f}</code></td><td>${t(a, e)}</td></tr>`).join('')}
    </tbody></table></div>`)
    + section('status', 'الحالة', 'Status', null, `<p class="doc-p">${t('الإصدار 1.0.0 — مغلق وجاهز للإنتاج. التفاصيل في DESIGN_SYSTEM_STATUS.md وتقرير الفحص docs/qa/DESIGN_SYSTEM_QA.md.', 'Version 1.0.0 — closed and production ready. See DESIGN_SYSTEM_STATUS.md and the QA report docs/qa/DESIGN_SYSTEM_QA.md.')}</p>`);
  pages['index'] = { file: OUT('index.html'), html: docPage({ key: 'index', title: ['نظام تصميم سراج', 'SIRAJ Design System'], eyebrow: ['الإصدار 1.0', 'Version 1.0'], lead: ['الضوء، والمادة، والتفاصيل — في نظام واحد.', 'Light, material and detail — in one system.'], body, D: '', R: '../' }) };
}

// Foundations ----------------------------------------------------------------------------------------
{
  const sw = (name, hex, note = '') => `<div class="doc-swatch"><div class="doc-swatch__chip" style="background:${hex}"></div><div class="doc-swatch__meta"><b>${name}</b><span class="siraj-num">${hex}</span>${note ? `<span class="siraj-small siraj-muted">${note}</span>` : ''}</div></div>`;
  const group = (k, ttl) => `<h3 class="siraj-t-h3 doc-sub">${ttl}</h3><div class="doc-swatches">${leaf(TOKENS.color[k]).map(([n, v]) => sw(n, resolve(v.$value), v.$description || '')).join('')}</div>`;
  const themes = ['ivory', 'deep'].map((th) => `<div class="doc-theme" data-theme="${th === 'ivory' ? 'light' : 'dark'}" style="background:${resolve(TOKENS.theme[th].bg.$value)};color:${resolve(TOKENS.theme[th].text.$value)}"><b>${th}</b>${leaf(TOKENS.theme[th]).filter(([, v]) => /^#|\{/.test(String(v.$value))).map(([n, v]) => `<div class="doc-theme__row"><span class="doc-swatch__chip" style="background:${resolve(v.$value)};width:20px;height:20px;display:inline-block"></span><span>${n}</span><span class="siraj-num">${resolve(v.$value)}</span></div>`).join('')}</div>`).join('');
  const scale = (obj, unit = '') => `<div class="doc-scale">${leaf(obj).map(([n, v]) => `<div class="doc-scale__row"><span class="siraj-num">${n}</span><span class="doc-scale__bar" style="width:${Math.min(parseFloat(v.$value) || 0, 400)}px"></span><span class="siraj-num siraj-muted">${v.$value}${unit}</span></div>`).join('')}</div>`;
  const tbl = (obj, cols = ['Token', 'Value']) => `<div class="doc-table-wrap"><table class="siraj-table doc-table"><thead><tr><th>${cols[0]}</th><th>${cols[1]}</th></tr></thead><tbody>${leaf(obj).map(([n, v]) => `<tr><td><code>${n}</code></td><td class="siraj-num">${esc(String(v.$value ?? JSON.stringify(v)))}</td></tr>`).join('')}</tbody></table></div>`;
  const body = section('colour', 'الألوان', 'Colour', ['العنابي هو صوت سراج؛ الأحجار والعاجي يحملان الضوء. لا تُستخدم ألوان خارج اللوحة.', 'Maroon is the voice of SIRAJ; stone and ivory carry the light. No colours outside the palette.'],
    group('core', t('الأساسية', 'Core')) + group('maroon', t('درجات العنابي', 'Maroon scale')) + group('silk', t('ألوان الحرير', 'Silk')) + group('functional', t('الوظيفية', 'Functional')) + group('data', t('البيانات', 'Data')))
    + section('themes', 'البيئتان', 'Themes', ['بيئة عاجية للنهار والمستندات، وبيئة داكنة للمساء والفيلم.', 'An ivory environment for day and documents, a deep one for evening and film.'], `<div class="doc-themes">${themes}</div>`)
    + section('space', 'المسافات', 'Spacing', ['مقياس 8 بكسل مع 4 و12 للتفاصيل الدقيقة.', '8 px scale with 4 and 12 for fine detail.'], scale(TOKENS.space))
    + section('radius', 'الزوايا والحدود والظلال', 'Radius, borders, shadows', ['زوايا حادة؛ زاوية «الحرير» 96 بكسل وحدها للصور الكبيرة. خطوط شعرية. ظلال ناعمة تشبه انسدال القماش.', 'Square corners; the 96 px "silk" corner only on large images. Hairline rules. Soft shadows like falling fabric.'],
      `<div class="doc-specs">${['none', 'sm', 'md', 'drape'].map((s) => spec(s, s, `<div style="width:160px;height:110px;background:var(--siraj-surface);box-shadow:${TOKENS.shadow[s].$value}"></div>`)).join('')}${spec('silk', 'silk', `<div style="width:160px;height:110px;background:var(--siraj-accent);border-top-left-radius:96px"></div>`)}</div>` + tbl(TOKENS.border.width))
    + section('opacity', 'الشفافية', 'Opacity', null, tbl(TOKENS.opacity))
    + section('z', 'طبقات العمق', 'Z-index', null, tbl(TOKENS.z))
    + section('bp', 'نقاط الانقطاع', 'Breakpoints', null, tbl(TOKENS.breakpoint))
    + section('layout', 'التخطيط', 'Layout', null, tbl(TOKENS.layout));
  pages['foundations'] = { html: docPage({ key: 'foundations', title: ['الأسس والرموز', 'Foundations & tokens'], eyebrow: ['الرموز', 'Tokens'], lead: ['كل قيمة في النظام لها اسم واحد ومصدر واحد.', 'Every value in the system has one name and one source.'], body, ...DOCP, toc: [['colour', 'الألوان', 'Colour'], ['themes', 'البيئتان', 'Themes'], ['space', 'المسافات', 'Spacing'], ['radius', 'الزوايا', 'Radius'], ['z', 'العمق', 'Z-index']] }) };
}

// Typography -----------------------------------------------------------------------------------------
{
  const SAMPLE = { display: ['أوّلُ الضوء.', 'First light.'], h1: ['في قلب المدينة، بيتٌ من ضوء.', 'In the heart of the city, a house of light.'], h2: ['شقق سكنية ومحلات تجارية', 'Residential apartments and retail shops'], h3: ['مدروسة في كل تفاصيلها', 'Considered in every detail'], lead: ['حين يحلّ المساء، يُضيء سراج.', 'When evening falls, Siraj lights up.'], body: ['ضوءٌ يعبر الطوب، وظلٌّ يرسم المكان. مبنى في مسقط صُمّم ليحتفي بالضوء والمادة والتفاصيل.', 'Light passes through brick and shadow draws the place. A building in Muscat designed around light, material and detail.'], small: ['تصوّر معماري للمشروع.', 'Architectural visualisation.'], caption: ['الواجهة عند الساعة الزرقاء', 'The facade at blue hour'], label: ['الموقع', 'Location'], numbers: ['77714404', '77714404'], pricing: ['—', '—'], data: ['— م²', '— m²'] };
  const rows = leaf(TOKENS.typography).map(([k, v]) => {
    const a = v.ar, e = v.en;
    return `<div class="doc-type-row"><div class="doc-type-meta"><b>${k}</b><span class="siraj-small siraj-muted">${esc(v.usage || '')}</span><span class="siraj-num siraj-small">AR ${a.desktop}/${a.mobile}px · ${a.weight} · LH ${a.lineHeight}</span><span class="siraj-num siraj-small">EN ${e.desktop}/${e.mobile}px · ${e.weight} · LH ${e.lineHeight}</span></div>
      <div class="doc-type-sample"><div class="siraj-t-${k}" lang="ar" dir="rtl">${k === 'display' ? '<span class="siraj-t-light">أوّلُ</span> <span class="siraj-t-heavy">الضوء.</span>' : SAMPLE[k] ? SAMPLE[k][0] : ''}</div><div class="siraj-t-${k}" lang="en" dir="ltr" style="margin-top:12px">${SAMPLE[k] ? SAMPLE[k][1] : ''}</div></div></div>`;
  }).join('');
  const rules = `<div class="doc-dos"><div class="doc-do"><div class="doc-do__head">${ic('check')}${t('افعل', 'Do')}</div><ul>${[['Tajawal للعربية وJost للاتينية، وأرقام غربية دائماً.', 'Tajawal for Arabic, Jost for Latin, always Western digits.'], ['تباعد الأسطر: العرض ≥ 1.3، العناوين ≥ 1.4، النص ≥ 1.6 — حتى في الخط العريض.', 'Line height: display ≥ 1.3, headings ≥ 1.4, body ≥ 1.6 — also in Bold.'], ['سطر العرض قد يجمع وزن 200 مع 800.', 'Display lines may pair weight 200 with 800.']].map(([a, e]) => `<li>${t(a, e)}</li>`).join('')}</ul></div>
    <div class="doc-do doc-dont"><div class="doc-dont__head">${ic('close')}${t('لا تفعل', "Don't")}</div><ul>${[['لا تباعد حروف في العربية.', 'No letter-spacing on Arabic.'], ['لا تجعل الأسطر تتلامس أو تتداخل.', 'Never let lines touch or overlap.'], ['لا تكتب تخطيطاً كاملاً بالخط العريض.', 'Never set a whole layout in bold.']].map(([a, e]) => `<li>${t(a, e)}</li>`).join('')}</ul></div></div>`;
  const body = section('roles', 'الأدوار الطباعية', 'Type roles', ['اثنا عشر دوراً ثنائي اللغة: Display, H1–H3, Lead, Body, Small, Caption, Label, Numbers, Pricing, Data.', 'Twelve bilingual roles: Display, H1–H3, Lead, Body, Small, Caption, Label, Numbers, Pricing, Data.'], rows) + section('rules', 'القواعد', 'Rules', null, rules);
  pages['typography'] = { html: docPage({ key: 'typography', title: ['الطباعة', 'Typography'], eyebrow: ['Tajawal · Jost', 'Tajawal · Jost'], lead: ['خطّان، ووزنان متقابلان، ومسافة تتنفّس بين الأسطر.', 'Two typefaces, two contrasting weights, and room to breathe between lines.'], body, ...DOCP }) };
}

// Grid & layout ---------------------------------------------------------------------------------------
{
  const gridRows = leaf(TOKENS.grid).map(([k, g]) => `<tr><td><b>${k}</b></td>${['width', 'height', 'columns', 'gutter', 'margin', 'baseline'].map((p) => `<td class="siraj-num">${g[p] ? (g[p].$value ?? g[p]) : '—'}</td>`).join('')}<td class="siraj-small">${g.use ? (g.use.$value ?? g.use) : ''}</td></tr>`).join('');
  const live = `<div class="doc-livegrid siraj-container" aria-hidden="true" style="display:grid;grid-template-columns:repeat(12,1fr);gap:var(--siraj-grid-gutter, 24px)">${Array.from({ length: 12 }, (_, i) => `<div style="height:120px;background:var(--siraj-accent-tint);outline:1px solid var(--siraj-border)"><span class="siraj-num siraj-small" style="display:block;padding:6px">${i + 1}</span></div>`).join('')}</div>`;
  const body = section('web', 'شبكة الويب', 'Web grid', ['12 عموداً على سطح المكتب، 8 على اللوحي، 4 على الجوال. خط أساس 8 بكسل.', '12 columns on desktop, 8 on tablet, 4 on mobile. 8 px baseline.'], live)
    + section('all', 'كل الشبكات', 'All grids', ['الشبكات نفسها تحكم المنشورات والعروض والمطبوعات العقارية.', 'The same grids govern posts, presentations and property print.'], `<div class="doc-table-wrap"><table class="siraj-table doc-table"><thead><tr><th>Grid</th><th>W</th><th>H</th><th>Cols</th><th>Gutter</th><th>Margin</th><th>Baseline</th><th>${t('الاستخدام', 'Use')}</th></tr></thead><tbody>${gridRows}</tbody></table></div>`)
    + section('zones', 'مناطق الشعار والتواصل', 'Logo and contact zones', ['الشعار أسفل اليمين في التخطيطات العربية. سطر التواصل (الهاتف · أيقونة إنستغرام SIRAJPROPERTIES) في الطرف المقابل. في القصص: أعلى 250 وأسفل 340 بكسل خالية من النص.', 'Logo bottom-right in Arabic layouts. The contact line (phone · Instagram icon SIRAJPROPERTIES) sits opposite. Stories keep the top 250 and bottom 340 px free of copy.'], `<div class="doc-frame" style="max-width:420px;aspect-ratio:4/5;position:relative;background:var(--siraj-surface-alt);border:1px solid var(--siraj-border)"><div style="position:absolute;right:8%;bottom:6%">${logoFixed('../../', 'Primary', 96)}</div><div style="position:absolute;left:8%;bottom:7.5%">${K.contactLine(cDoc('../', '../../'))}</div></div>`);
  pages['grid'] = { html: docPage({ key: 'grid', title: ['الشبكة والتخطيط', 'Grid & layout'], eyebrow: ['الشبكات', 'Grids'], lead: ['كل شيء يقف على شبكة، حتى الحرير.', 'Everything stands on a grid, even the silk.'], body, ...DOCP }) };
}

// Components --------------------------------------------------------------------------------------------
{
  const c = cDoc('../', '../../');
  const S = (a, e, inner, o) => spec(a, e, inner, o);
  const body = section('nav', 'التنقّل', 'Navigation', null, `<div class="doc-specs">${S('الترويسة', 'Header', K.header(c, { menuId: 'm1' }), { wide: true })}${S('مسار التنقّل', 'Breadcrumb', K.breadcrumb(c, [['الرئيسية', 'Home'], ['سراج', 'Siraj'], ['الوحدات', 'Units']]))}${S('ترقيم الصفحات', 'Pagination', K.pagination(c))}${S('الشريط الجانبي', 'Sidebar', K.sidebar(c))}${S('التذييل', 'Footer', K.footer(c), { wide: true })}</div>`)
    + section('actions', 'الأزرار', 'Buttons', null, `<div class="doc-specs">${S('الأزرار', 'Buttons', `<div class="siraj-btn-row"><a class="siraj-btn siraj-btn--primary" href="#">${c.x('سجّل اهتمامك', 'Register interest')}</a><a class="siraj-btn siraj-btn--secondary" href="#">${c.x('حمّل الكتيّب', 'Download brochure')}</a><a class="siraj-btn siraj-btn--ghost" href="#">${c.x('المزيد', 'More')}</a><a class="siraj-btn siraj-btn--link" href="#">${c.x('التفاصيل', 'Details')}${ic('arrow-right')}</a></div>`)}${S('سطر التواصل', 'Contact line', K.contactLine(c), { note: ['الهاتف + أيقونة إنستغرام مع SIRAJPROPERTIES. لا «@» أبداً.', 'Phone + Instagram icon with SIRAJPROPERTIES. Never «@».'] })}</div>`)
    + section('forms', 'النماذج', 'Forms', null, `<div class="doc-specs">${S('حقل', 'Field', K.field(c, { id: 'f1', label: c.x('الاسم', 'Name'), required: true, hint: c.x('كما في البطاقة الشخصية', 'As on your ID') }))}${S('حقل بخطأ', 'Field · error', K.field(c, { id: 'f2', label: c.x('رقم الهاتف', 'Phone'), type: 'tel', state: 'invalid', error: c.x('أدخل رقماً من 8 خانات', 'Enter an 8-digit number'), value: '7771' }))}${S('قائمة', 'Select', K.select(c, { id: 's1', label: c.x('نوع الوحدة', 'Unit type'), options: c.mode === 'ar' ? ['شقة سكنية', 'محل تجاري'] : ['Apartment', 'Retail shop'] }))}${S('بحث', 'Search', K.search(c, 'q1'))}${S('مرشّحات', 'Filters', K.filterChips(c))}${S('نموذج الاهتمام', 'Lead form', K.leadForm(c, 'lf1'), { wide: true })}</div>`)
    + section('content', 'المحتوى', 'Content', null, `<div class="doc-specs">${S('تبويبات', 'Tabs', K.tabs(c, 'tb1', [['نظرة عامة', 'Overview', `<p>${c.x('شقق سكنية ومحلات تجارية في مسقط.', 'Apartments and shops in Muscat.')}</p>`], ['الموقع', 'Location', `<p>${c.x('مسقط.', 'Muscat.')}</p>`], ['المخطط', 'Plan', `<p>${c.x('يُعلن عند الاعتماد.', 'Published once confirmed.')}</p>`]]))}${S('أسئلة', 'Accordion', K.accordion(c, 'ac1', K.FAQ))}${S('جدول', 'Table', K.table(c), { wide: true })}${S('إحصاءات', 'Stats', K.stats(c), { wide: true })}${S('مخطط', 'Chart', K.chartCard(c, 'bar', { a: 'مؤشر توضيحي', e: 'Illustrative series' }), { tag: L.DEMO_LABEL })}</div>`)
    + section('feedback', 'الإشعارات والحالات', 'Feedback & states', null, `<div class="doc-specs">${['success', 'warning', 'error'].map((k) => S(k, k, K.alert(c, k))).join('')}${S('شريط', 'Banner', K.banner(c, false))}${S('حالة فارغة', 'Empty', K.empty(c))}${S('هيكل التحميل', 'Skeleton', K.skeletonCard())}${S('دعوة للعمل', 'CTA', K.cta(c), { wide: true })}</div>`)
    + section('overlays', 'الطبقات', 'Overlays', null, `<div class="doc-specs">${S('حوار', 'Dialog', K.dialogBox(c, 'dg1'))}${S('درج', 'Drawer', K.drawerBox(c, 'dr1'))}</div>`);
  pages['components'] = { html: docPage({ key: 'components', title: ['المكوّنات', 'Components'], eyebrow: ['واجهات', 'UI'], lead: ['مكوّنات هادئة ودقيقة، تعمل من اليمين إلى اليسار أولاً، ومتاحة للجميع.', 'Calm, precise components — right-to-left first and accessible.'], body, ...DOCP, toc: [['nav', 'التنقّل', 'Navigation'], ['actions', 'الأزرار', 'Buttons'], ['forms', 'النماذج', 'Forms'], ['content', 'المحتوى', 'Content'], ['feedback', 'الإشعارات', 'Feedback'], ['overlays', 'الطبقات', 'Overlays']] }) };
}

// Real-estate components ----------------------------------------------------------------------------------
{
  const c = cDoc('../', '../../');
  const S = (a, e, inner, o) => spec(a, e, inner, o);
  const body = section('cards', 'البطاقات', 'Cards', ['البيانات غير المعتمدة تظهر كخانة «—» ولا تُخترع أبداً.', 'Unconfirmed data shows as the «—» slot and is never invented.'], `<div class="doc-specs">${S('بطاقة وحدة', 'Property card', K.propertyCard(c))}${S('بطاقة محل', 'Shop card', K.propertyCard(c, { kind: 'shop', image: 'frontDay' }))}${S('بطاقة المشروع', 'Project card', K.projectCard(c))}${S('بطاقة وحدة مختصرة', 'Unit card', K.unitCard(c))}</div>`)
    + section('hero', 'الواجهة الرئيسية', 'Hero & overview', null, `<div class="doc-specs">${S('البطل', 'Hero', K.hero(c), { wide: true })}${S('نظرة عامة', 'Overview', K.overview(c), { wide: true })}</div>`)
    + section('details', 'التفاصيل', 'Unit details', null, `<div class="doc-specs">${S('تفاصيل الوحدة', 'Unit details', K.unitDetails(c), { wide: true })}${S('السعر', 'Price', K.price(c))}${S('المساحة', 'Area', K.area(c))}${S('التوفّر', 'Availability', K.availability(c))}${S('المخطط', 'Floor plan', K.floorPlanBox(c))}${S('المرافق', 'Amenities', K.amenities(c), { wide: true })}</div>`)
    + section('place', 'المكان والتقدّم', 'Location & progress', null, `<div class="doc-specs">${S('الموقع', 'Location', K.location(c), { wide: true })}${S('مراحل البناء', 'Construction progress', K.progressSteps(c))}${S('مؤشرات', 'Metrics', K.metrics(c))}${S('خطة الدفع', 'Payment plan', K.paymentPlan(c))}</div>`)
    + section('media', 'الصور والتنزيل والتواصل', 'Gallery, download, contact', null, `<div class="doc-specs">${S('المعرض', 'Gallery', K.gallery(c), { wide: true })}${S('تنزيل', 'Download', K.download(c))}${S('تواصل مع المبيعات', 'Contact sales', K.contactSales(c), { wide: true })}</div>`);
  pages['real-estate'] = { html: docPage({ key: 'real-estate', title: ['مكوّنات العقار', 'Real-estate components'], eyebrow: ['سراج · مسقط', 'Siraj · Muscat'], lead: ['شقق سكنية ومحلات تجارية — مكوّنات تعرض المكان بصدق.', 'Residential apartments and retail shops — components that present the place honestly.'], body, ...DOCP }) };
}

// Icons -------------------------------------------------------------------------------------------------
{
  const cats = {};
  for (const [name, m] of Object.entries(ICONS.icons)) (cats[m.category || 'other'] = cats[m.category || 'other'] || []).push([name, m]);
  const body = section('set', 'مجموعة الأيقونات', 'Icon set', [`${Object.keys(ICONS.icons).length} أيقونة على شبكة 24 بكسل، خط 1.25 بكسل، زوايا مربّعة. لكل أيقونة نسخة مفرّغة وأخرى ممتلئة. منها: واتساب، البريد، المحل، إنستغرام.`, `${Object.keys(ICONS.icons).length} icons on a 24 px grid, 1.25 px stroke, square caps. Outline and filled versions. Including WhatsApp, Email, Shop and Instagram.`],
    Object.entries(cats).map(([cat, list]) => `<h3 class="siraj-t-h3 doc-sub">${cat}</h3><div class="doc-icons">${list.map(([n, m]) => `<div class="doc-icon">${ic(n, 'siraj-icon--xl')}<span class="doc-icon__en siraj-num">${n}</span>${m.ar ? `<span class="doc-icon__ar">${m.ar}</span>` : ''}</div>`).join('')}</div>`).join(''))
    + section('files', 'الملفات', 'Files', null, `<p class="doc-p"><code>07-Icon-System/svg/outline</code> · <code>07-Icon-System/svg/filled</code> · <code>07-Icon-System/sprite/siraj-icons.svg</code> · <code>07-Icon-System/siraj-icons.json</code></p>`);
  pages['icons'] = { html: docPage({ key: 'icons', title: ['الأيقونات', 'Icons'], eyebrow: ['07-Icon-System', '07-Icon-System'], lead: ['أيقونة إنستغرام تحلّ محلّ «@» في كل مكان.', 'The Instagram icon replaces «@» everywhere.'], body, ...DOCP }) };
}

// Motion hooks --------------------------------------------------------------------------------------------
{
  const rows = Object.entries(MOTION.level).map(([k, l]) => `<tr><td><b>${k}</b></td><td class="siraj-num">${l.duration}</td><td>${l.ease}</td><td class="siraj-num">${l.stagger}</td><td class="siraj-num">${l.translate}</td><td class="siraj-num">${l.blur}</td><td>${l.camera}</td><td class="siraj-small">${l.use}</td></tr>`).join('');
  const wind = Object.entries(WIND.levels).map(([k, l]) => `<tr><td><b>${k}</b></td><td class="siraj-num">${l.speed_ms}</td><td class="siraj-num">${l.silk_amplitude}</td><td class="siraj-num">${l.foliage_sway_deg.join('–')}°</td><td class="siraj-small">${l.use}</td></tr>`).join('');
  const body = section('levels', 'المستويات الستة', 'Six levels', ['Micro · Fast · Standard · Emphasis · Hero · Cinematic. الفئات .m-<level> وخصائص CSS --siraj-m-* تأتي من motion-system/tokens.', 'Micro · Fast · Standard · Emphasis · Hero · Cinematic. Classes .m-<level> and CSS properties --siraj-m-* come from motion-system/tokens.'], `<div class="doc-table-wrap"><table class="siraj-table doc-table"><thead><tr><th>Level</th><th>Duration</th><th>Ease</th><th>Stagger</th><th>Translate</th><th>Blur</th><th>Camera</th><th>${t('الاستخدام', 'Use')}</th></tr></thead><tbody>${rows}</tbody></table></div>`)
    + section('air', 'الهواء والرياح', 'Air & wind', [WIND.principle.ar, WIND.principle.en], `<div class="doc-table-wrap"><table class="siraj-table doc-table"><thead><tr><th>Level</th><th>${t('السرعة', 'Speed')}</th><th>${t('موجة الحرير', 'Silk wave')}</th><th>${t('ميل الأشجار', 'Foliage sway')}</th><th>${t('الاستخدام', 'Use')}</th></tr></thead><tbody>${wind}</tbody></table></div><p class="doc-p">${t('اتجاه واحد سائد (من اليمين إلى اليسار)، هبّة واحدة على الأكثر، ثم سكون. العمارة لا تتحرك.', 'One prevailing direction (right → left), at most one gust, then settle. The architecture never moves.')}</p>`)
    + section('hooks', 'الاستخدام في الكود', 'Using the hooks', null, `<pre class="doc-p" dir="ltr" style="white-space:pre-wrap"><code>&lt;link rel="stylesheet" href="motion-system/tokens/build/siraj-motion.css"&gt;
&lt;h2 class="m-emphasis m-enter" style="--m-i:1"&gt;…&lt;/h2&gt;   → add .is-in when in view
&lt;img class="m-hero m-reveal"&gt;                           → curved silk-edge reveal
prefers-reduced-motion → opacity only, 120 ms</code></pre>`);
  pages['motion'] = { html: docPage({ key: 'motion', title: ['خطافات الحركة', 'Motion hooks'], eyebrow: ['FLOW · DRAPE · REVEAL · WRAP · FOLD · GLIDE · SETTLE', 'FLOW · DRAPE · REVEAL · WRAP · FOLD · GLIDE · SETTLE'], lead: ['الحركة انسياب قماش يحرّكه الهواء: بلا ارتداد ولا وميض.', 'Motion is fabric moved by air: no bounce, no flash.'], body, ...DOCP }) };
}

// Templates ---------------------------------------------------------------------------------------------
{
  const exists = (p) => fs.existsSync(path.join(ROOT, p));
  const thumb = (p, a, e, src) => exists(p) ? `<figure class="siraj-card"><div class="siraj-card__media" style="aspect-ratio:auto"><img src="../../${p}" alt="${a}" loading="lazy" style="width:100%;height:auto;display:block"></div><figcaption class="siraj-card__body"><b>${t(a, e)}</b><span class="siraj-small siraj-muted" dir="ltr">${src}</span></figcaption></figure>` : '';
  const G = (items) => `<div class="doc-cards" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:24px">${items.join('')}</div>`;
  const SOC = '11-Social/Exports/', TP = '11-Social/Template-Previews/';
  const social = G([
    thumb(SOC + 'SIRAJ_Social_Project-Launch_Post_AR_v1.0.png', 'إطلاق المشروع', 'Project launch', '11-Social/Briefs/v1/Project-Launch.json'),
    thumb(SOC + 'SIRAJ_Social_Announcement_Post_AR_v1.0.png', 'إعلان', 'Announcement', '11-Social/Briefs/v1/Announcement.json'),
    thumb(SOC + 'SIRAJ_Social_Carousel-01_Carousel_AR_v1.0.png', 'كاروسيل', 'Carousel', '11-Social/Briefs/v1/Carousel-01.json'),
    thumb(SOC + 'SIRAJ_Social_Quote_Post_AR_v1.0.png', 'اقتباس', 'Quote', '11-Social/Briefs/v1/Quote.json'),
    thumb(SOC + 'SIRAJ_Social_Contact-Story_Story_AR_v1.0.png', 'قصة التواصل', 'Contact story', '11-Social/Briefs/v1/Contact-Story.json'),
    thumb(SOC + 'SIRAJ_Social_Reel-Cover_Reel_AR_v1.0.png', 'غلاف ريل', 'Reel cover', '11-Social/Briefs/v1/Reel-Cover.json'),
  ]);
  const kv = G(['Veil', 'Ribbon', 'Lantern', 'Reveal', 'Detail'].map((n) => thumb(`14-Property-Marketing/12-Project-Siraj/SIRAJ_Project-Siraj_KV_${n}_Post_AR_v1.0.png`, `الحرير والضوء · ${n}`, `Silk & Light · ${n}`, '14-Property-Marketing/12-Project-Siraj/Source/project-siraj-kv-post.html')));
  const re = G(['Investment-Opportunity', 'Construction-Update', 'Sold', 'Reservation', 'Event-Invitation'].map((n) => thumb(`${TP}SIRAJ_Social_${n}_Post_AR_v1.0.png`, n, n, `11-Social/Briefs/v1/${n}.json`)));
  const corp = G([
    thumb('12-Print/PNG/Stationery/SIRAJ_Business-Card_EN-AR_v1.0.png', 'بطاقة العمل', 'Business card', '12-Print/Source/Stationery'),
    thumb('12-Print/PNG/Stationery/SIRAJ_Letterhead_AR_v1.0.png', 'الورق الرسمي', 'Letterhead', '12-Print/Source/Stationery'),
    thumb('12-Print/PNG/Stationery/SIRAJ_Envelope_DL_v1.0.png', 'الظرف', 'Envelope', '12-Print/Source/Stationery'),
    thumb('19-Templates/email-signature/SIRAJ_Email-Signature_Preview_v1.0.png', 'توقيع البريد', 'Email signature', '19-Templates/email-signature'),
    thumb('13-Presentations/Exports/PNG/SIRAJ_Presentation_Siraj_AR_v1.0_slide-01.png', 'العرض التقديمي', 'Presentation', '13-Presentations/PPTX'),
  ]);
  const body = section('social', 'التواصل الاجتماعي', 'Social', ['كل منشور يُبنى من ملف موجز واحد عبر tools/make-post.js. التواصل: الهاتف + أيقونة إنستغرام.', 'Every post is built from one brief via tools/make-post.js. Contact: phone + Instagram icon.'], social)
    + section('marketing', 'التسويق: الحرير والضوء', 'Marketing: Silk & Light', null, kv)
    + section('realestate', 'قوالب عقارية (خانات «—»)', 'Real-estate templates («—» slots)', ['قوالب جاهزة تُملأ عند اعتماد البيانات؛ لا تُنشر وفيها خانات فارغة.', 'Ready templates, filled once data is confirmed; never published with empty slots.'], re)
    + section('corporate', 'المراسلات والعروض', 'Corporate', ['القرطاسية والعروض والتوقيع تضيف الموقع مكتوباً WWW.SIRAJPROPERTIES.NET.', 'Stationery, presentations and the signature add the website, written WWW.SIRAJPROPERTIES.NET.'], corp);
  pages['templates'] = { html: docPage({ key: 'templates', title: ['القوالب', 'Templates'], eyebrow: ['تواصل · تسويق · مؤسسي · عقاري', 'Social · Marketing · Corporate · Real estate'], lead: ['نظام قوالب واحد لكل القنوات.', 'One template system for every channel.'], body, ...DOCP }) };
}

// Examples index + usage ------------------------------------------------------------------------------------
const EXAMPLES = [['home', 'الصفحة الرئيسية للمشروع', 'Project home'], ['unit', 'صفحة الوحدة', 'Unit page'], ['contact', 'سجّل اهتمامك', 'Register interest'], ['portal', 'بوابة العميل', 'Customer portal']];
{
  const body = section('screens', 'الشاشات', 'Screens', ['شاشات عربية فقط كما تُنشر. البيانات غير المعتمدة تظهر «—».', 'Arabic-only screens as published. Unconfirmed data shows «—».'], `<div class="doc-cards" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px">${EXAMPLES.map(([k, a, e]) => `<a class="siraj-card siraj-card--link" href="../examples/${k}.html"><div class="siraj-card__media" style="aspect-ratio:16/10"><img src="../exports/SIRAJ_DS_Example_${k}_desktop_v1.0.png" alt="${a}" loading="lazy" style="width:100%;height:100%;object-fit:cover;object-position:top"></div><div class="siraj-card__body"><h3 class="siraj-card__title">${t(a, e)}</h3></div></a>`).join('')}</div>`);
  pages['examples'] = { html: docPage({ key: 'examples', title: ['الشاشات النموذجية', 'Example screens'], eyebrow: ['عربي فقط', 'Arabic only'], lead: ['النظام كما يراه الناس.', 'The system as people see it.'], body, ...DOCP }) };
  const rule = (a, e) => `<li>${t(a, e)}</li>`;
  const usage = section('rules', 'قواعد غير قابلة للتفاوض', 'Non-negotiables', null, `<div class="doc-dos"><div class="doc-do"><div class="doc-do__head">${ic('check')}${t('دائماً', 'Always')}</div><ul>${[
    ['العربية فقط في التواصل العام؛ اللاتينية للشعار والهاتف وSIRAJPROPERTIES وWWW.SIRAJPROPERTIES.NET فقط.', 'Arabic only in public communication; Latin only for the logo, phone, SIRAJPROPERTIES and WWW.SIRAJPROPERTIES.NET.'],
    ['التواصل في المنشورات: 77714404 + أيقونة إنستغرام SIRAJPROPERTIES.', 'Contact on posts: 77714404 + Instagram icon SIRAJPROPERTIES.'],
    ['الموقع حيث يُسمح: WWW.SIRAJPROPERTIES.NET بالأحرف الكبيرة كاملاً.', 'Website where allowed: WWW.SIRAJPROPERTIES.NET, in full, in capitals.'],
    ['الوصف: «شقق سكنية ومحلات تجارية».', 'Description: «شقق سكنية ومحلات تجارية».'],
    ['الحرير حقيقي، عنابي، إيماءة واحدة، يحرّكه الهواء.', 'Silk is real, maroon, one gesture, moved by air.'],
    ['تباين 4.5:1 للنص، وتركيز ظاهر، ولوحة مفاتيح كاملة.', '4.5:1 text contrast, visible focus, full keyboard support.'],
  ].map(([a, e]) => rule(a, e)).join('')}</ul></div><div class="doc-do doc-dont"><div class="doc-dont__head">${ic('close')}${t('أبداً', 'Never')}</div><ul>${[
    ['علامة «@» قبل الحساب.', 'The «@» sign before the handle.'],
    ['حواشٍ أو ملاحظات جانبية على التصميم.', 'Side notes or footnotes on artwork.'],
    ['أسعار أو مساحات أو تواريخ غير معتمدة.', 'Unconfirmed prices, areas or dates.'],
    ['«المشروع المؤسِّس» أو عبارات الاستراتيجية الداخلية.', '«The Founding Project» or internal strategy lines.'],
    ['«في الأعلى / في الأرض / الطابق الأرضي».', '«in the upper floors / on the ground / ground floor».'],
    ['ارتداد أو وميض أو تكبير مبالغ في الحركة.', 'Bounce, flash or excessive zoom in motion.'],
  ].map(([a, e]) => rule(a, e)).join('')}</ul></div></div>`);
  pages['usage'] = { html: docPage({ key: 'usage', title: ['قواعد الاستخدام', 'Usage rules'], eyebrow: ['AGENTS.md', 'AGENTS.md'], lead: ['ما يجب أن يبقى صحيحاً في كل تصميم.', 'What must hold in every design.'], body: usage, ...DOCP }) };
}

// Example screens (Arabic only) ---------------------------------------------------------------------------
const ex = {};
{
  const c = cAr('../', '../../');
  const sec = (inner, cls = '') => `<section class="siraj-section ${cls}"><div class="siraj-container">${inner}</div></section>`;
  ex.home = examplePage({ title: 'سراج · مسقط', D: '../', R: '../../', body: `${K.header(c, { menuId: 'mm' })}${K.menuDrawer(c, 'mm')}<main id="home">${K.hero(c)}${sec(K.overview(c))}${sec(`<div class="ex-cards">${K.propertyCard(c)}${K.propertyCard(c, { kind: 'shop', image: 'frontDay' })}${K.propertyCard(c, { image: 'sideBlue' })}</div>`)}${sec(K.gallery(c))}${sec(K.location(c))}${sec(K.cta(c))}${sec(K.accordion(c, 'faq', K.FAQ))}</main>${K.footer(c)}` });
  ex.unit = examplePage({ title: 'شقة سكنية · سراج', D: '../', R: '../../', body: `${K.header(c, { active: 'project', menuId: 'mm' })}${K.menuDrawer(c, 'mm', 'project')}<main>${sec(K.breadcrumb(c, [['الرئيسية'], ['سراج'], ['شقة سكنية']].map(([a]) => [a, a])) + K.unitDetails(c))}${sec(`<div class="ex-split">${K.floorPlanBox(c)}<div>${K.price(c)}${K.area(c)}${K.availability(c)}</div></div>`)}${sec(K.amenities(c))}${sec(K.paymentPlan(c))}${sec(K.contactSales(c, { form: true }))}</main>${K.footer(c)}` });
  ex.contact = examplePage({ title: 'سجّل اهتمامك · سراج', D: '../', R: '../../', body: `${K.header(c, { active: 'contact', menuId: 'mm', cta: false })}${K.menuDrawer(c, 'mm', 'contact')}<main id="contact">${sec(`<div class="ex-split"><div><div class="siraj-eyebrow"><span class="siraj-lumen"></span>سراج · مسقط</div><h1 class="siraj-t-h1">سجّل اهتمامك</h1><p class="siraj-t-lead">شقق سكنية ومحلات تجارية. نتواصل معك حين تُعلن التفاصيل.</p>${K.contactLine(c)}</div>${K.leadForm(c, 'lead')}</div>`)}${sec(K.download(c))}</main>${K.footer(c)}` });
  ex.portal = examplePage({ title: 'بوابة العميل · سراج', D: '../', R: '../../', bodyClass: 'ex-portal', body: `${K.header(c, { menuId: 'mm', cta: false })}${K.menuDrawer(c, 'mm')}<div class="ex-portal__shell">${K.sidebar(c)}<main class="ex-portal__main"><h1 class="siraj-t-h2">مرحباً</h1>${K.banner(c, false)}${K.metrics(c)}${K.progressSteps(c)}${K.table(c)}${K.chartCard(c, 'line', { a: 'سير البناء', e: '' })}</main></div>` });
}
const EX_CSS = `/* SIRAJ Design System v1.0 — example-screen layout helpers (GENERATED by tools/build-design-system-docs.js) */
.ex { margin: 0; background: var(--siraj-bg); }
.ex .siraj-section { padding-block: clamp(48px, 8vw, 112px); }
.ex-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
.ex-split { display: grid; grid-template-columns: 1.2fr 1fr; gap: clamp(24px, 5vw, 80px); align-items: start; }
.ex-split > div > * + * { margin-top: 16px; }
.ex-portal__shell { display: grid; grid-template-columns: var(--siraj-layout-sidebar-width, 272px) 1fr; min-height: 100vh; }
.ex-portal__main { padding: clamp(24px, 4vw, 56px); display: grid; gap: 32px; align-content: start; }
@media (max-width: 834px) { .ex-split, .ex-portal__shell { grid-template-columns: 1fr; } .ex-portal__shell .siraj-sidebar { display: none; } }
`;
const DOCS_JS = `/* SIRAJ Design System docs — language + theme toggles (GENERATED by tools/build-design-system-docs.js) */
(function () {
  var html = document.documentElement, q = new URLSearchParams(location.search);
  function get(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lang(l) { html.setAttribute('data-doc-lang', l); html.lang = l; html.dir = l === 'ar' ? 'rtl' : 'ltr'; }
  function theme(t) { html.setAttribute('data-theme', t); }
  lang(q.get('lang') || get('siraj-doc-lang', 'ar')); theme(q.get('theme') || get('siraj-doc-theme', 'light'));
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-doc-lang]')) { var l = html.getAttribute('data-doc-lang') === 'ar' ? 'en' : 'ar'; lang(l); set('siraj-doc-lang', l); }
    if (e.target.closest('[data-doc-theme]')) { var t = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; theme(t); set('siraj-doc-theme', t); }
  });
})();
`;

// ------------------------------------------------------------------------------------------------ write
L.ensureImages();
W(OUT('examples', 'examples.css'), EX_CSS);
W(OUT('docs', 'assets', 'docs.js'), DOCS_JS);
const written = [];
for (const [k, p] of Object.entries(pages)) { const f = p.file || OUT('docs', `${k}.html`); W(f, p.html); written.push(f); }
for (const [k, h] of Object.entries(ex)) { const f = OUT('examples', `${k}.html`); W(f, h); written.push(f); }
console.log('design-system docs:', written.length, 'pages');

// ------------------------------------------------------------------------------------------------ exports + QA
(async () => {
  const qa = [];
  const shots = [];
  const targets = [
    // example screens first: the docs «examples» page shows their captures
    ...Object.keys(ex).map((k) => ({ k: `Example_${k}`, f: OUT('examples', `${k}.html`), mobile: true })),
    ...Object.keys(pages).map((k) => ({ k: `Docs_${k}`, f: pages[k].file || OUT('docs', `${k}.html`) })),
  ];
  const b = await R.browser();
  for (const tg of targets) {
    for (const [vw, vh, tag] of tg.mobile ? [[1440, 900, 'desktop'], [390, 844, 'mobile']] : [[1440, 900, 'desktop']]) {
      const page = await b.newPage({ viewport: { width: vw, height: vh } });
      const errs = [];
      page.on('pageerror', (e) => errs.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      await page.goto('file://' + tg.f + '?static=1', { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const res = await page.evaluate(() => {
        const out = { broken: [], overflow: 0, tight: [], at: 0 };
        document.querySelectorAll('img').forEach((i) => { if (i.complete && !i.naturalWidth) out.broken.push(i.getAttribute('src')); });
        out.overflow = Math.max(0, document.documentElement.scrollWidth - innerWidth);
        // Arabic line spacing: display ≥ 1.3, headings ≥ 1.4, body ≥ 1.6 (checked on visible Arabic text blocks)
        document.querySelectorAll('[lang="ar"] h1, [lang="ar"] h2, [lang="ar"] h3, [lang="ar"] p, html[lang="ar"] h1, html[lang="ar"] h2, html[lang="ar"] h3, html[lang="ar"] p').forEach((el) => {
          const cs = getComputedStyle(el); if (cs.display === 'none' || !el.textContent.trim()) return;
          const fs = parseFloat(cs.fontSize), lh = cs.lineHeight === 'normal' ? fs * 1.2 : parseFloat(cs.lineHeight);
          const need = /H1|H2|H3/.test(el.tagName) ? (fs >= 48 ? 1.3 : 1.4) : (fs >= 20 ? 1.4 : 1.6);
          if (lh / fs < need - 0.01) out.tight.push(`${el.tagName}.${el.className} ${(lh / fs).toFixed(2)} < ${need}`);
        });
        out.at = (document.body.innerText.match(/@SIRAJ/gi) || []).length;
        return out;
      });
      const name = `SIRAJ_DS_${tg.k}_${tag}_v1.0.png`;
      const isEx = tg.k.startsWith('Example_');
      await page.screenshot({ path: OUT('exports', name), fullPage: true });
      shots.push(name);
      qa.push({ page: path.relative(ROOT, tg.f), view: tag, errors: errs, ...res });
      await page.close();
    }
  }
  await R.close();
  const fails = qa.filter((r) => r.errors.length || r.broken.length || r.overflow > 1 || r.tight.length || r.at);
  let md = `# SIRAJ Design System v1.0 — QA report\n\nGenerated by \`node tools/build-design-system-docs.js\` on ${new Date().toISOString().slice(0, 10)}.\n\n`;
  md += `- Pages checked: **${qa.length}** (docs at 1440 px; example screens at 1440 px and 390 px)\n- Checks: JS errors · broken images · horizontal overflow · Arabic line spacing (display ≥ 1.3, headings ≥ 1.4, body ≥ 1.6) · «@» before the handle\n- Contrast: see design-system/build/contrast.json\n- Pages with issues: **${fails.length}**\n\n`;
  md += '| Page | View | JS errors | Broken images | Overflow px | Tight Arabic lines | «@» |\n|---|---|---|---|---|---|---|\n';
  md += qa.map((r) => `| ${r.page} | ${r.view} | ${r.errors.length} | ${r.broken.length} | ${r.overflow} | ${r.tight.length} | ${r.at} |`).join('\n') + '\n';
  if (fails.length) md += '\n## Details\n\n' + fails.map((r) => `- **${r.page} (${r.view})** ${[...r.errors, ...r.broken.map((x) => 'broken ' + x), ...r.tight.slice(0, 5)].join(' · ')}`).join('\n') + '\n';
  W(path.join(ROOT, 'docs', 'qa', 'DESIGN_SYSTEM_QA.md'), md);
  console.log(`QA: ${qa.length} page views · issues on ${fails.length}`);
  fails.forEach((r) => console.log('  ✗', r.page, r.view, r.errors.slice(0, 2).join(' | '), r.broken.slice(0, 2).join(' '), r.overflow ? 'overflow ' + r.overflow : '', r.tight.slice(0, 3).join(' ; ')));
  process.exitCode = fails.length ? 1 : 0;
})().catch((e) => { console.error(e); process.exit(1); });
