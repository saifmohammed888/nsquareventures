# Nsquare CMS Setup

The private CMS is available at `/admin` after deployment.

Required Vercel environment variables:

- `CMS_PASSWORD`: password used by the admin screen for saving content and uploading images.
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob read/write token for persistent JSON content and uploaded image storage.

What the CMS manages:

- Projects shown on the home page, projects page, and project detail page.
- Journal/blog posts shown on the journal page and journal detail page.
- Uploaded images for hero sections, project images, blog images, galleries, and supporting section imagery.
- Site image settings such as `homeHeroImage`, `projectsHeroImage`, `journalHeroImage`, `contactHeroImage`, and `processImage`.

The public site reads `/api/content`. If Blob storage is not configured yet, the site falls back to the committed `projects-data.js` and `journal-data.js` files.
