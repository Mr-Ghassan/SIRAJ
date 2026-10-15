# Template previews — internal, never published

These PNGs show the editable social templates (`11-Social/Briefs/v1/*.json` with `"kind": "template"`) with their
labelled data slots «—» (prices, areas, dates, progress, unit details). They are internal references for filling a
template, not publish-ready files (decision D5, 2026-10-15).

To publish one: copy the brief, replace every «—» with a confirmed value — or delete that row or stat — set
`"kind": "publish"`, and run `node tools/build-social-v1.js <name>`. The result lands in `11-Social/Exports/`.
A publish brief may never contain «—», a placeholder or an invented value; `npm run qa:library` fails if it does.
