// SIRAJ website — static content & structure checks on the production build (dist/). Exit 1 on any failure.
// Brand rules (frozen v1.0): no «@» handle, phone always «7771 4404» in visible text, no typed «سراج», no internal
// strategy, no cancelled project lettering, no fictional projects, no placeholder data, Arabic RTL document, SEO basics.
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(WEB, 'dist');
const CANON = 'https://www.sirajproperties.net';
if (!existsSync(DIST)) { console.error('dist/ missing — run npm run build first'); process.exit(1); }

async function walk(d) { const out = []; for (const f of await readdir(d)) { const p = path.join(d, f); (await stat(p)).isDirectory() ? out.push(...await walk(p)) : out.push(p); } return out; }
const files = await walk(DIST);
const pages = files.filter((f) => f.endsWith('.html'));

// visible text = HTML without scripts/styles/svg sprite/tags/attributes; "alt-ish" text = alt/aria-label/title/content
const visible = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&[a-z]+;/g, ' ');
const attrText = (h) => [...h.matchAll(/\s(?:alt|aria-label|title|content|placeholder)="([^"]*)"/g)].map((m) => m[1]).join(' \n ');

const RULES = [
  ['«@» before the Instagram handle', /@\s?sirajproperties/i, 'both'],
  ['ungrouped phone in visible text (must be «7771 4404»)', /77714404/, 'text'],
  ['typed «سراج» (brand/project name is the logo only)', /سراج/, 'both'],
  ['internal strategy wording', /المشروع المؤس|Founding Project|لا تبدأ بالانتشار|إثبات\s*←|PROVE\s*→|EXPAND|المعيار/i, 'both'],
  ['cancelled project lettering', /Project-Siraj_Lettering|01-Logos\/Project\//, 'html'],
  ['fictional project', /مساكن نور|Noor Residences|\bHarir\b|«حرير»/, 'both'],
  ['placeholder data («—», lorem, TODO, placeholder)', /—\s*(?:<|$)|\blorem\b|\bTODO\b|\bplaceholder\b|XXX|\?\?\?/i, 'text'],
  ['invented commercial data (prices / areas / dates)', /ر\.ع|OMR|ريال|م²|م2|sqm|\d+\s?%|تسليم\s+\d|\b20(2[6-9]|3\d)\b(?!\s*·\s*جميع)/, 'text'],
  ['email address on public pages', /[\w.]+@[\w-]+\.(com|net|om|org)/i, 'both'],
  ['website written outside the frozen form', /(?<!https:\/\/)www\.sirajproperties\.net(?![\w/])|SirajProperties\.net/, 'text'],
  ['yellow / gold wording', /ذهبي|golden|gold\b/i, 'both'],
  ['floor-position wording («في الأعلى / في الأرض / في الطابق الأرضي»)', /في الأعلى|في الأرض|الطابق الأرضي/, 'both'],
];

let fails = 0;
const fail = (page, msg) => { fails++; console.log(`✗ ${path.relative(DIST, page) || '/'}: ${msg}`); };

for (const p of pages) {
  const html = await readFile(p, 'utf8');
  const text = visible(html); const attrs = attrText(html);
  for (const [label, re, where] of RULES) {
    const hayText = where === 'html' ? html : where === 'text' ? text : `${text}\n${attrs}`;
    const m = hayText.match(re);
    if (m) fail(p, `${label}: “${m[0].trim()}”`);
  }
  // document
  if (!/<html lang="ar" dir="rtl"/.test(html)) fail(p, 'html must be lang="ar" dir="rtl"');
  const h1 = (html.match(/<h1[\s>]/g) || []).length; if (h1 !== 1) fail(p, `expected exactly one <h1>, found ${h1}`);
  if (!/<title>[^<]{3,}<\/title>/.test(html)) fail(p, 'missing <title>');
  if (!/<meta name="description" content="[^"]{30,}"/.test(html)) fail(p, 'missing/short meta description');
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/); if (!canon || !canon[1].startsWith(CANON + '/')) fail(p, 'canonical must be on https://www.sirajproperties.net');
  if (!/property="og:image" content="https:\/\/www\.sirajproperties\.net\/og\/[^"]+\.jpg"/.test(html)) fail(p, 'og:image missing');
  const og = html.match(/property="og:image" content="https:\/\/www\.sirajproperties\.net(\/og\/[^"]+)"/); if (og && !existsSync(path.join(DIST, og[1]))) fail(p, `og image file missing: ${og[1]}`);
  if (!/<a class="siraj-skip" href="#main">/.test(html)) fail(p, 'skip link missing');
  // icons: every <use href="#sj-…"> has its symbol in the inlined sprite
  for (const m of new Set([...html.matchAll(/href="#(sj-[a-z0-9-]+)"/g)].map((x) => x[1]))) if (!html.includes(`id="${m}"`)) fail(p, `icon symbol missing: #${m}`);
  // images
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt(="|[\s>])/.test(tag)) fail(p, `img without alt: ${tag.slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) fail(p, `img without width/height: ${tag.slice(0, 80)}`);
  }
  // local assets + internal links resolve
  const refs = [...html.matchAll(/(?:src|href)="(\/[^"#?]*)/g)].map((m) => m[1]);
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) m[1].split(',').forEach((s) => refs.push(s.trim().split(' ')[0]));
  for (const ref of new Set(refs)) {
    if (!ref.startsWith('/') || ref.startsWith('//')) continue;
    const target = path.join(DIST, decodeURI(ref));
    const ok = existsSync(target) && ((await stat(target)).isFile() || existsSync(path.join(target, 'index.html')));
    if (!ok) fail(p, `broken local reference ${ref}`);
  }
}
for (const f of ['robots.txt', 'sitemap-index.xml', '404.html', 'favicon.svg', 'site.webmanifest', 'brand/email/v1/SIRAJ_Email-Logo_v1.0.png']) if (!existsSync(path.join(DIST, f))) { fails++; console.log(`✗ missing ${f}`); }
console.log(`content QA: ${pages.length} pages · ${RULES.length} brand rules + structure, SEO, image and link checks · failures: ${fails}`);
process.exit(fails ? 1 : 0);
