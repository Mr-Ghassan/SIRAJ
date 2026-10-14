# SIRAJ website — deployment runbook v1.0

The site is a **static build** (`website/dist/`). Any static host with HTTPS works (Cloudflare Pages, Netlify, S3 + CloudFront,
the company's own server). Nothing has been deployed, and **no DNS, hosting or mail setting has been changed** from this repository.

## 1 · Build and verify

```bash
npm run web:install        # npm ci inside website/ (Astro 7, sharp, fontsource, axe-core)
npm run verify:web         # build → content QA → browser QA (Playwright Chromium)
```

`verify:web` must end with `content QA … failures: 0` and `browser QA … failures: 0`.
The build reads brand assets straight from the repository (`01-Logos`, `07-Icon-System`, `14-Property-Marketing`,
`06-SIRAJ-Silk`, `19-Templates/email-signature`, design-system and motion-system CSS), so build from a full checkout.

Optional build variable: `PUBLIC_SIRAJ_FORMS_ENDPOINT` (see `forms-contract.md`). Leave it unset until an endpoint is approved.

## 2 · Host settings

| Setting | Value |
|---|---|
| Publish directory | `website/dist` |
| Build command | `npm ci --prefix website && npm --prefix website run build` |
| Node | 22 LTS (≥ 22.12, required by Astro 7) |
| Canonical origin | `https://www.sirajproperties.net` (all canonical tags, sitemap, OG and JSON-LD use it) |
| Apex | redirect `https://sirajproperties.net/*` → `https://www.sirajproperties.net/:splat` (301) |
| HTTP | redirect to HTTPS; enable HSTS once HTTPS is confirmed on both hosts |
| Trailing slash | pages are `/about/`, `/project/`, `/contact/` (directory format) — keep the host from rewriting them |
| 404 | serve `404.html` with status 404 |
| Headers | `website/public/_headers` (copied to `dist/_headers`) is read by Netlify and Cloudflare Pages; on any other host mirror it: `/_astro/*`, `/fonts/*`, `/brand/*` → `Cache-Control: public, max-age=31536000, immutable`; security headers on `/*` |

## 3 · DNS (owner action — not done here)

Point `www.sirajproperties.net` at the chosen host (CNAME) and the apex at the host's apex records, following the host's own
instructions. **Do not touch MX, SPF, DKIM or DMARC records**: the mailbox setup is outside this project.

## 4 · After go-live checks

- `https://www.sirajproperties.net/` loads in Arabic RTL, with the logo, phone `7771 4404` and the Instagram icon + `SIRAJPROPERTIES`.
- `https://www.sirajproperties.net/sitemap-index.xml` and `/robots.txt` respond 200.
- Share a page link in WhatsApp/iMessage to confirm the OG image.
- Email signature images respond 200 with the immutable cache header (see `email-signature.md`).
- Submit the Google Search Console property for `https://www.sirajproperties.net` (owner account).

## 5 · Rollback

Static deploys are atomic: re-publish the previous successful deploy from the host dashboard, or rebuild the previous Git commit.
