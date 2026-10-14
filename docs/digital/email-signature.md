# Email-signature images — stable hosted path

The signature templates (`19-Templates/email-signature/SIRAJ_Email-Signature_AR_v1.0.html`) need their two images on a
public HTTPS URL that never changes. The website now publishes them at versioned, immutable paths:

| Image | Size shown | Published URL (after deployment) |
|---|---|---|
| Logo (2× PNG) | 132 × 38 | `https://www.sirajproperties.net/brand/email/v1/SIRAJ_Email-Logo_v1.0.png` |
| Instagram icon (2× PNG) | 12 × 12 | `https://www.sirajproperties.net/brand/email/v1/SIRAJ_Email-Instagram_v1.0.png` |

- Source files: `19-Templates/email-signature/assets/` (copied at build by `website/scripts/prepare-assets.mjs`).
- Cache: `/brand/*` → `public, max-age=31536000, immutable`, `Access-Control-Allow-Origin: *`.
- **Never overwrite a file in `v1/`.** A changed image goes to `/brand/email/v2/…` with a new file name, then signatures are updated;
  old emails keep pointing at `v1`.

## Switching the signature over (after the site is live)

1. Confirm both URLs above respond 200 over HTTPS.
2. Replace `assets/SIRAJ_Email-Logo_v1.0.png` and `assets/SIRAJ_Email-Instagram_v1.0.png` in the signature HTML with those URLs
   (set `email.logo_url` in `12-Print/Source/print.config.json` and rebuild with `npm run build:print`; the Instagram icon URL is derived from it automatically).
3. Paste the signature into the mail client and send a test to Gmail, Outlook and iOS Mail.

No mail-server, MX or DNS setting is involved.
