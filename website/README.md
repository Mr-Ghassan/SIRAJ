# SIRAJ website v1.0

Arabic RTL static site built with Astro on the frozen SIRAJ Design System and Motion System v1.0.
Full documentation: [`../docs/digital/README.md`](../docs/digital/README.md) · status: [`../DIGITAL_EXPERIENCE_STATUS.md`](../DIGITAL_EXPERIENCE_STATUS.md).

```bash
npm ci
npm run dev      # assets + dev server
npm run build    # assets + static build → dist/
npm run test     # content QA on dist/
npm run verify   # build + content QA + browser QA (Playwright Chromium) + screenshots
```

Optional: `PUBLIC_SIRAJ_FORMS_ENDPOINT=https://…` (approved endpoint only; see `../docs/digital/forms-contract.md`).
