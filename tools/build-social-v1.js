// SIRAJ Social v1.0 — renders every brief in 11-Social/Briefs/v1 through make-post (the one template engine)
// and files the results:  kind "publish" → 11-Social/Exports (publishable, real project only)
//                         kind "template" → 11-Social/Template-Previews (data slots «—», fill before use)
// Usage: node tools/build-social-v1.js [name-filter]
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const BR = path.join(ROOT, '11-Social', 'Briefs', 'v1');
const OUT = { publish: path.join(ROOT, '11-Social', 'Exports'), template: path.join(ROOT, '11-Social', 'Template-Previews') };
const FNAME = { post: 'Post', square: 'Square', story: 'Story', reel: 'Reel', carousel: 'Carousel', li: 'LinkedIn', x: 'X' };
const filter = process.argv[2];
Object.values(OUT).forEach((d) => fs.mkdirSync(d, { recursive: true }));
let fail = 0;
for (const f of fs.readdirSync(BR).filter((x) => x.endsWith('.json')).sort()) {
  const b = JSON.parse(fs.readFileSync(path.join(BR, f), 'utf8'));
  if (filter && !b.name.includes(filter)) continue;
  b.date = 'v1'; // stable source folder: 11-Social/Content/v1_<name>
  const tmp = path.join(ROOT, '11-Social', 'Content', 'briefs', `_v1_${b.name}.json`);
  fs.writeFileSync(tmp, JSON.stringify(b, null, 2));
  try { execFileSync('node', [path.join(ROOT, 'tools', 'make-post.js'), tmp], { stdio: 'inherit' }); }
  catch (e) { fail++; }
  fs.rmSync(tmp);
  const src = path.join(ROOT, '11-Social', 'Content', `v1_${b.name}`);
  for (const fmt of b.formats) {
    const from = path.join(src, `SIRAJ_${b.name}_${FNAME[fmt]}_AR_v1.0.png`);
    const to = path.join(OUT[b.kind || 'publish'], `SIRAJ_Social_${b.name}_${FNAME[fmt]}_AR_v1.0.png`);
    if (fs.existsSync(from)) fs.copyFileSync(from, to);
  }
}
if (fail) { console.error(`${fail} brief(s) reported layout QA issues`); process.exitCode = 2; }
