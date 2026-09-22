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
