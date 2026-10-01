# Yuxuan Du — Academic Website

Public website source for **https://me.yuxuan1221.site**.

This independent repository does not replace or deploy to the existing
`sherryyyyyuu.github.io` repository. It contains only the website source and
public-facing assets; private research data and hosting credentials are excluded.

## Local development

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173/. If another preview is using that port, reuse it or
stop it before starting this one. Pages are available at `/#about`, `/#research`,
and `/#beyond`.

## Editing

- `app/page.tsx`: biography, publications, contact details, and gallery.
- `app/globals.css`: layout, typography, and responsive styles.
- `public/photos/` and `public/research/`: optimized public images.
- `public/Yuxuan_Du_Academic_CV.pdf`: downloadable CV.
- `index.html`: page title and social metadata.

## Deployment

Pushing to `main` runs `.github/workflows/deploy-pages.yml`, which builds the
static site with `npm run build:github` and deploys `dist-github` to GitHub Pages.
Set the repository's Pages source to **GitHub Actions** and its custom domain to
**me.yuxuan1221.site**. The domain's DNS record is a DNS-only CNAME for `me`
pointing to **sherryyyyyuu.github.io** (without a repository path).

The build uses `/` as its asset base because this website is served at the root
of its custom domain. The default GitHub project URL is not the primary address.
For Actions-based Pages deployment, the custom domain is configured in GitHub's
Pages settings, not by a CNAME file in this repository.
