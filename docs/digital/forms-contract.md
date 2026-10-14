# SIRAJ website — forms contract v1

Two forms live on `/contact/`: **Register Interest** (`#interest`) and **Contact** (`#message`).
Source: `website/src/forms/contract.ts` (rules + payload type), `website/src/scripts/forms.ts` (behaviour),
`website/src/components/{InterestForm,ContactForm,Field,FormStatus}.astro` (markup on the Design System `.siraj-field`).

## Current state: transport DISABLED (by design)

No backend, CRM, mailbox or third-party form service has been approved, so **nothing is sent and nothing is stored**.
A visitor who submits a valid form sees, in Arabic:

> استقبال النماذج عبر الموقع لم يُفعَّل بعد. لم تُرسَل بياناتك ولم تُحفظ. للتواصل الآن: 7771 4404 أو عبر إنستغرام SIRAJPROPERTIES.

The notice under each form says the same before submission. The browser QA (`npm run verify:web`) fails if any non-GET
request leaves the page.

## Enabling it later (only with an approved company endpoint)

1. The company approves an endpoint it owns or contracts (CRM webhook, own API, etc.), with HTTPS, data-retention
   and access rules, and a privacy notice if required.
2. Build with the public env var:
   ```bash
   PUBLIC_SIRAJ_FORMS_ENDPOINT=https://<approved-endpoint> npm run build:web
   ```
   Any value that does not start with `https://` keeps the transport disabled.
3. The endpoint must answer CORS for `https://www.sirajproperties.net` (`POST`, `content-type`), and return 2xx on success.
4. Re-run `npm run verify:web` with the endpoint pointed at a staging receiver before going live.

Do **not** connect a temporary free service or a personal inbox.

## Payload (POST, `application/json`, `credentials: "omit"`, timeout 15 s)

```json
{
  "form": "interest",
  "version": 1,
  "fields": { "name": "…", "phone": "9123 4567", "interest": "apartment", "note": "", "consent": true },
  "page": "/contact/",
  "locale": "ar",
  "submittedAt": "2026-10-14T08:00:00.000Z"
}
```

| Form | Field | Required | Max | Rule |
|---|---|---|---|---|
| interest | `name` | yes | 80 | — |
| interest | `phone` | yes | 20 | `^\+?[0-9\s-]{8,16}$` |
| interest | `interest` | yes | — | `apartment` \| `shop` |
| interest | `note` | no | 500 | — |
| interest | `consent` | yes | — | checked |
| contact | `name` | yes | 80 | — |
| contact | `phone` | yes | 20 | as above |
| contact | `email` | no | 120 | simple email pattern |
| contact | `message` | yes | 1000 | — |
| contact | `consent` | yes | — | checked |

## Behaviour and safeguards

- Validation on blur and on submit; errors are Arabic, linked by `aria-describedby`, cleared as the visitor corrects
  them; focus moves to the first invalid field.
- **Honeypot** field `company` (visually hidden, `tabindex=-1`, `autocomplete=off`): if filled, the form pretends success
  and sends nothing.
- **Consent** checkbox is required; its wording names the purpose («بخصوص المشروع» / «بخصوص رسالتي»).
- No cookies, no analytics, no third-party scripts; the request carries no credentials.
- Server side (when enabled) must re-validate everything above, rate-limit, and never echo data back into the page.
