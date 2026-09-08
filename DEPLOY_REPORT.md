# VERSO GitHub Pages Deploy Report

Generated: 2026-09-08  
Source: `VERSO-v1.9.4-GitHub/`

## Result

| Metric | Result |
|---|---:|
| Original project size | 58.45 MiB |
| GitHub deploy size | 6.22 MiB |
| Size reduction | 89.36% |
| Original asset size | 57.87 MiB |
| Deploy asset size | 5.69 MiB |
| Original assets | 28 |
| Deploy assets | 27 |
| Images converted to WebP | 26 |
| Unused assets excluded | 1 |
| Byte-identical duplicates removed | 0 |
| Largest remaining file | 617.99 KiB |

The deploy contains 6,440,553 logical file bytes (6.14 MiB); the 6.22 MiB figure above is filesystem usage as reported by `du`.

## Deploy contents

The repository root contains only the static files required by the prototype:

- `index.html`
- `app.js`
- runtime JavaScript and CSS under `app/`
- optimized runtime assets under `public/assets/`
- `.nojekyll`
- `.gitignore`
- this deploy report

No Node server, backend, build step or Git LFS is required.

## Image optimization

- All 26 referenced PNG files were converted to WebP.
- Feed, Session, Event, Marketplace and Shop photographs use high-quality WebP compression.
- Event posters and visually important branded imagery use higher-quality settings.
- Transparent Badge, mascot and logo artwork retain alpha transparency.
- The Badge artwork sprite is intentionally the largest remaining file at 617.99 KiB because it contains multiple unique Badge artworks and was kept at high quality to preserve text, edges and transparency.
- `verso-icon-v8.svg` remains vector artwork.

## Excluded files

- One unreferenced legacy GIF
- tests and test frames
- development reports and notes
- `.DS_Store`
- old versions, temporary exports and source artwork outside the runtime version
- `node_modules` and build caches

## GitHub Pages readiness

- `index.html` is at the deploy-folder root.
- All runtime paths are relative.
- No local absolute filesystem paths are present.
- No individual file exceeds 1 MiB; the largest is about 618 KiB.
- `.nojekyll` is included.
- `.gitignore` excludes dependencies, logs, temporary files, backups and source-art files without excluding runtime assets.

Publish the contents of `VERSO-GITHUB-DEPLOY/` as the repository root, then enable GitHub Pages from the repository's default branch and root folder.

## Verification completed

- All 27 runtime asset references resolve to 27 existing files; there are no missing or unused deploy assets.
- Every WebP file decodes successfully.
- Runtime JavaScript syntax checks pass.
- Database integrity passes all 19 automated relationship and persistence checks.
- Badge integrity passes for 24 main Badges, 18 Partner Shop Badges and all Session references.
- Browser flows verified: homepage/login, Feed, Session Detail, Deck links, Badge links, Event Detail, Explore tabs and search, Marketplace, all Profile tabs, Like, Comment, Share Studio and Create Activity.
- Responsive checks pass at 1440×900, 1280×800, 430×932, 390×844 and 375×812.
- At every tested width: no horizontal viewport overflow, no broken images and no browser console or HTTP loading errors.
