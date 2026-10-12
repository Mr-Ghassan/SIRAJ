# 11-Social / Content: posts made from briefs

Every new post is made from a short JSON **brief** and rendered by the SIRAJ template engine. The engine applies the grid, Tajawal, Western digits, logo zone, real-silk stills and layout QA, so no post is hand-built.

```bash
node tools/make-post.js 11-Social/Content/briefs/<name>.json            # formats from the brief (default post + story)
node tools/make-post.js 11-Social/Content/briefs/<name>.json --formats post,story,square
```

Output goes to `11-Social/Content/<date>_<name>/`. It holds one PNG per format (`SIRAJ_<name>_<Format>_AR_v1.0.png`), `source.html` (open it in a browser with `?format=post&lang=ar`) and a copy of the brief.

- **Brief schema and recipes:** the header of `tools/make-post.js` and `.claude/skills/siraj-brand-system/references/production.md`.
- **Examples:** `briefs/example-*.json` covers a hero photo with real-silk Horizon, a statement on Drape-Deep, a quote, and a product pillar in a Silk-Corner window.
- **Rules:** the brand skill `siraj-brand-system`. In short: Arabic only, real silk only, the people rules, no invented facts, logo bottom-start (bottom-right in Arabic).
