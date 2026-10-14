# SIRAJ Digital Experience v1.0 — QA report

Date: 14 October 2026 · branch `feat/siraj-digital-project-experience-v1` · build: Astro 7.3.8 static · command: `npm run verify:web`

## 1 · Automated results

| Suite | Scope | Result |
|---|---|---|
| Content QA (`website/scripts/test-content.mjs`) | 5 pages · 12 brand rules (no «@», phone grouped, no typed «سراج», no strategy lines, no lettering, no fictional projects, no placeholders, no prices/areas/dates, no email, website form, no gold wording, no floor-position wording) + `lang/dir`, one h1, title, description, canonical, OG image, skip link, img alt + size, icon symbols, every local link/asset/srcset | **0 failures** |
| Browser QA (`website/scripts/verify-browser.mjs`, Chromium) | 5 pages × 390 / 768 / 1280 / 1920: console errors, failed requests, horizontal overflow, images loaded, Arabic line heights, every motion element revealed, 44 px touch targets at 390 | **0 failures** |
| Accessibility (axe-core 4.14, WCAG 2.0/2.1 A + AA) | 5 pages at 1280 | **0 violations** |
| Keyboard | first Tab = skip link, visible focus ring | pass on all pages |
| Reduced motion | all content visible at once, nothing transformed | pass on all pages |
| Forms | empty submit flags 4 required fields and focuses the first; errors clear when fixed; valid submit with transport disabled shows the offline notice; **no non-GET request leaves the page** | pass |
| Performance budget | ≤ 900 KB first view, ≤ 30 KB JS (390 px @2×) | pass (181–636 KB, JS 13 KB) |
| Brand repo QA | `npm run qa` on the branch | pass (unchanged baseline) |

The negative test (violations injected into a built page) was caught by every content rule before release.

## 2 · Design review against the guidelines (v1.0, frozen)

| Guideline | Check | Result |
|---|---|---|
| Logo | official SVG files only, bottom-right in Arabic footer / top-right in the RTL header, never typed, alt "SIRAJ" | ✓ |
| Language | Arabic only; Latin limited to logo, SIRAJPROPERTIES, phone, website | ✓ |
| Contact | `7771 4404` + Instagram icon + SIRAJPROPERTIES; no «@», no email, no address; WhatsApp hidden until confirmed | ✓ |
| Naming | no «سراج» as a name, no project lettering; project = logo + «مسقط» + «شقق سكنية ومحلات تجارية» | ✓ |
| Copy | place, light, architecture, material, detail; no self-praise, no internal strategy; «دافئ» light wording replaced by «هادئ» (light is ivory-rose) | ✓ |
| Unknown facts | no prices, areas, unit counts or dates; no «—» in the public UI | ✓ |
| Imagery | approved Clean renders + Key Visuals + pressed silk stills only; no people | ✓ |
| Silk | one ribbon gesture per page section transition, silk never over text or data; deep maroon, no wash | ✓ |
| Type | Tajawal + Jost, Western digits, 200/800 display pairing in the hero, no Arabic letter-spacing, line heights above the floors | ✓ |
| Colour | DS tokens only (ivory / maroon / sand / shadow), dark sections from `data-theme="dark"` | ✓ |
| Motion | SETTLE / REVEAL / line rise from Motion System tokens; one direction (right → left); no bounce, zoom or loop; reduced motion honoured | ✓ |

Fixes made during the review: header CTA moved into the drawer below 480 px (overflow), honeypot hidden with clip-path
(not off-screen positioning), channel list restored to the DS 1 px hairline, silk removed from the footer (silk restraint),
consent text without Latin, floor-position wording removed from About, link buttons given a 44 px touch area,
icon sprite pruned (HTML 94 KB → 23–40 KB).

## 3 · Screenshots (`screens/`)

`home-390.jpg`, `home-1920.jpg`, `about-390.jpg`, `about-1920.jpg`, `project-390.jpg`, `project-1920.jpg`,
`contact-390.jpg`, `contact-1920.jpg`, `404-390.jpg`, `404-1920.jpg` — full page, header unpinned, after all reveals.

## 4 · Not verifiable here

Real-device Safari/iOS rendering, production CDN headers, Lighthouse on the live origin, and Search Console are checked
after deployment (`deployment-runbook.md` §4).
