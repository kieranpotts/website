# Website

Source and build for [kieranpotts.com](https://kieranpotts.com) — a single
static site, built with [Antora](https://antora.org) from
[AsciiDoc](https://asciidoc.org), that brings together the home/about pages
(in this repo) with the blog, digital garden, and bookmarks (each its own
repository, aggregated at build time).

## Quick start

A container-based workflow is provided — only Docker is needed, no local Node
install:

```sh
./run/install      # Install build dependencies (once, and after package.json changes).
./run/build        # Build the site into public/.
./run/serve        # Serve public/ at http://localhost:8080.
./run/preview      # Watch sources and rebuild on change, served at :8080.
```

Or, with a local Node toolchain (version pinned in `.nvmrc`):

```sh
nvm use            # Switch to the pinned Node version.
npm install        # Install build dependencies.
npm run build      # Build the site into public/.
npm run serve      # Serve public/ at http://localhost:8080.
npm run preview    # Watch + serve, rebuilding on change.
```

## Structure

- `src/` — the AsciiDoc content for this site (the ROOT component: home and
  about pages), under `src/modules/ROOT/`.
- `overlay/` — files merged into the published output: the Netlify control
  files (`_redirects`, `_headers`) and `robots.txt`/`favicon.ico` (published to
  the site root via `overlay/ui.yml`), the blog feeds (`/feeds/`), the iA Writer
  webfonts, and a custom navbar partial (`partials/header-content.hbs`).
- `site-local.yml` / `site-ci.yml` — the Antora playbooks for local development
  (`http://localhost:8080`) and production (`https://kieranpotts.com`).
- `run/` — Docker wrapper scripts for the build tasks.
- `.github/workflows/build.yaml` — CI: builds and validates the site, and
  checks for broken internal links, on every change to `dev`.

## Content sources

The site aggregates four content sources at build time. The blog, garden, and
bookmarks are public repositories referenced by URL in the playbooks (no token
required); their changes appear here once **pushed** to the branches below.

| Source | Repository | Branch | Published under |
|--------|------------|--------|-----------------|
| Home / about | this repo | `HEAD` | `/` |
| Blog | [kieranpotts/blog](https://github.com/kieranpotts/blog) | `latest/dev` | `/blog/` |
| Garden | [kieranpotts/garden](https://github.com/kieranpotts/garden) | `dev` | `/garden/` |
| Bookmarks | [kieranpotts/bookmarks](https://github.com/kieranpotts/bookmarks) | `dev` | `/bookmarks/` |

The look and feel uses the stock Antora default UI for now, with the navbar
overridden via the overlay.

## Development tasks

```sh
npm run lint        # Build with --log-failure-level=warn (fails on broken xrefs etc.).
npm run lint:ci     # Same, against the production playbook (site-ci.yml).
npm run linkcheck   # Serve the built site and crawl it for broken internal links.
npm run clean       # Remove public/ and the Antora cache.
```

## Deployment

The site deploys to [Netlify](https://www.netlify.com/). The build command is
`npm run build` and the publish directory is `public/` (see `netlify.toml`).
The `_redirects` and `_headers` files emitted into `public/` from the overlay
preserve the site's legacy URLs and set the HSTS policy.

-----

Copyright © 2020-present Kieran Potts, [MIT license](./LICENSE.txt)
