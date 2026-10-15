# SIRAJ Digital Experience v1.0 — BUILT · VERIFIED · NOT YET DEPLOYED

**Status:** 14 October 2026 · branch `feat/siraj-digital-project-experience-v1` · source `website/` · docs `docs/digital/`
Built on the frozen baseline: Brand Identity v1.0, Design System v1.0, Motion System v1.0 (tag `siraj-brand-system-v1.0.0`).
No identity, token, logo, colour, type or motion value was changed.

> **Website visual design is ON HOLD (client, 2026-10-15):** «لا تنشغل بتصميم وهيئة الموقع الان». The build stays as it is on this branch; no further layout, look or styling work until the client reopens it. Only functional or brand-rule fixes, if needed.

## What exists

| Area | State |
|---|---|
| Website (Astro 7 + TypeScript, static, Arabic RTL) | ✅ 4 pages + 404: `/`, `/about/`, `/project/`, `/contact/` |
| Design System reuse | ✅ DS CSS + components + JS, official icon sprite, official logos; page layer `site.css` uses tokens only |
| Motion | ✅ Motion System classes (SETTLE / REVEAL / line rise), one ribbon gesture right → left, reduced motion + no-JS safe |
| Images | ✅ approved Clean renders, Key Visuals and pressed silk stills only; AVIF/WebP responsive |
| Forms | ✅ Register Interest + Contact, validated, consent + honeypot · **transport disabled** (no approved endpoint) |
| SEO | ✅ canonical `https://www.sirajproperties.net`, OG/Twitter images, JSON-LD, sitemap, robots, favicons, manifest |
| Email-signature images | ✅ stable path `/brand/email/v1/…` (immutable) |
| QA | ✅ content QA 0 failures · browser QA 0 failures · axe 0 violations · perf budget met |
| Deployment | ⏳ runbook ready; nothing deployed, no DNS/hosting/mail change made |

## Commands (repository root)

```bash
npm run web:install   # npm ci in website/
npm run dev:web       # local dev server
npm run build:web     # → website/dist
npm run test:web      # content QA on the build
npm run verify:web    # build + content QA + browser QA + screenshots → docs/digital/screens/
```

Existing scripts (`build`, `qa`, `qa:silk`, `build:*`) are unchanged. `tools/qa-brand.js` now skips the website's generated
build output (`website/dist`, `website/public`, `website/.astro`), which is gitignored and checked by `test:web`.

## Open dependencies (owner decisions — nothing invented in the meantime)

1. **Forms endpoint** — an approved company endpoint (CRM / own API). Until then forms send nothing (`docs/digital/forms-contract.md`).
2. **WhatsApp** — confirm that 7771 4404 is the WhatsApp number; the WhatsApp channel appears once `contact.whatsapp_status` is confirmed.
3. **Hosting + DNS** — choose the host, connect `www.sirajproperties.net` + apex redirect (`docs/digital/deployment-runbook.md`). MX/SPF/DKIM untouched.
4. **Project name lettering** — postponed by the client; pages identify the project by logo + «مسقط» + description.
5. **Project data** — prices, areas, unit counts, floors, handover dates: hidden until approved.
6. **Legal data** — CR number, privacy notice for form data (needed before the forms endpoint is enabled).
7. **Release v1.0 leftovers** — push tag `siraj-brand-system-v1.0.0` / create the GitHub Release; upload the 10 ZIPs and the guidelines PDF to Drive.

## Docs

`docs/digital/README.md` · `QA_REPORT_v1.0.md` · `forms-contract.md` · `deployment-runbook.md` · `email-signature.md` · `screens/`
