# N Square Ventures

Premium editorial architecture website, built as a static HTML/CSS/JavaScript site.

## Deploy to Vercel

1. Create a new Vercel project and import this folder or its connected Git repository.
2. Keep **Framework Preset** set to `Other`.
3. Leave the **Build Command** and **Output Directory** empty.
4. Deploy.

Vercel will serve `index.html` at the site root. No environment variables or build step are required.

## Local preview

Run:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Updating the logo

The temporary `N² VENTURES` wordmark appears in the header and footer of `index.html`. Replace those two links with the supplied logo asset when available.
