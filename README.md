# Nextsquare

Next.js rebuild of the Nsquare Ventures site.

## Commands

```bash
npm install
npm run dev
```

## Backend

- `GET /api/content`: public site content.
- `POST /api/content`: password-gated CMS save.
- `POST /api/upload`: password-gated image upload to Vercel Blob.

## Environment

- `CMS_PASSWORD`
- `BLOB_READ_WRITE_TOKEN`
- `POSTGRES_URL` or Vercel/Neon Postgres env vars

Without Postgres env vars, CMS saves to `cms-content.local.json` for local development.

## Website revision v2

Public URLs remain `/`, `/projects` (Works), `/project-detail?project=…`, `/expertise` (Office), and `/contact`. Legacy `.html` redirects remain in place. `/presentation` is unlisted and noindex, not password-protected. There is no sitemap generator in this repository.

In `/admin`, **Website** contains Home (introduction and ordered hero images), Tags, Associates, Staff, Presentation, and Media visibility. **Works** assigns multiple tags and publication/presentation eligibility per project. Media selectors search the existing library; upload new files through **Media / Images**. All editors use the existing Save Changes button. Image removal from slides does not delete its library file. People and slide ordering use keyboard-accessible Up/Down controls.

Run `npm run migrate:content` once per environment to persist the additive v2 migration. Reads also normalize older documents; saving retains the new collections. The command preserves project slugs, images and category assignments and copies existing stored content into `.content-backups/` before writing. Existing named consultants and Nabeel are migrated from the original homepage; no new people are invented. Tags have stable IDs; a rename never changes project relationships. Back up production data before running migrations. Supply existing database environment variables to the migration process (the standalone Node command does not load `.env.local`).

Development persists to `cms-content.local.json`; production requires Postgres. Supported connection variables: `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, or `DATABASE_URL`. `CMS_PASSWORD` protects reads of administrative content and all writes. The existing development-only fallback password remains unchanged. Public reads filter unpublished/private records and use no-store so saves appear on reload.

Uploads still require `BLOB_READ_WRITE_TOKEN`. Without it, existing library selection works but uploads return a configuration error. Contact still uses WhatsApp; the existing form has an empty `data-whatsapp-number` and no verified phone/email. Set the verified destination there before launch. Until configured, validation runs but submission reports that the message was not sent. Do not send live test enquiries without approval.

Presentation settings control enablement, all/selected-project/selected-image sources, saved image order, slide duration, transition duration, and fit/fill. Published project images are eligible by default; drafts, private media, opted-out media, and common non-project artwork are excluded. Explicit image selection can include other public assets. Mark library assets private or presentation-ineligible in Media visibility as appropriate. Static files and public Blob URLs are not access-controlled; content visibility does not revoke previously known asset URLs.

Verification: `npm run check` runs data migration/filtering tests; `npm run build` checks compilation. Browser checks in `scripts/browser-check.cjs` and `scripts/cms-browser-check.cjs` use externally available Playwright and installed Chrome. Set `PLAYWRIGHT_MODULE` to its module path if not resolvable and optionally `TEST_CMS_PASSWORD`. CMS browser checks temporarily save fixtures and restore the original content in `finally`; run only against local development on port 3001. Screenshots are written to ignored `test-results/`. Stop the dev server before a production build because both currently share `.next`.
