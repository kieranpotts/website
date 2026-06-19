# 🌐 Website

Source and build for [kieranpotts.com](https://kieranpotts.com) — a single static site, built with [Antora](https://antora.org) from [AsciiDoc](https://asciidoc.org), that brings together the home/about pages (in this repo) with my blog, digital garden, and bookmarks (each its own repository, aggregated at build time).

## 🚀 Quick start

A container-based workflow is provided — only Docker is needed, no local Node install:

```sh
./run/install  # Install build dependencies after package.json changes.
./run/build    # Build the site into public/.
./run/serve    # Serve public/ at http://localhost:8080.
./run/preview  # Watch sources and rebuild on change, served at :8080.
```

Or, with a local Node toolchain (version pinned in `.nvmrc`):

```sh
nvm use          # Switch to the pinned Node version.
npm install      # Install build dependencies.
npm run build    # Build the site into public/.
npm run serve    # Serve public/ at http://localhost:8080.
npm run preview  # Watch + serve, rebuilding on change.
```

## 🗂️ Structure

- `src/content/`: AsciiDoc content for this site. The ROOT component (home and about pages) are under `src/content/modules/ROOT/`.

- `src/static/`: The site's UI `supplemental_files` mount. Holds files published to the site root — Netlify's `_redirects`/`_headers`, `robots.txt`/`favicon.ico`, and the blog feeds (`/feeds/`), all listed as `static_files` in `src/static/ui.yml` — plus the site-specific partial overrides in `src/static/partials/` (`head.hbs`, `nav-menu.hbs`) that layer over the theme bundle. The rest of the UI comes from the theme bundle.

- `site-dev.yml` / `site-ci.yml`: The Antora playbooks for local development (`http://localhost:8080`, reads the local git worktree via the sibling bare repo) and production (`https://kieranpotts.com`, reads the committed `HEAD`). Netlify and CI use `site-ci.yml`.

- `run/`: Docker wrapper scripts for the build tasks.

- `.github/workflows/build.yaml`: CI config – builds and validates the site, and checks for broken internal links, on every change to `latest/dev`.

## 📚 Content sources

The site aggregates four content sources at build time. The blog, garden, and bookmarks are public repositories referenced by URL in the playbooks (no token required). Their changes appear here once pushed to the branches below.

| Source | Repository | Branch | Published under |
|--------|------------|--------|-----------------|
| Home / about | this repo | `HEAD` | `/` |
| Blog | [kieranpotts/thoughts](https://github.com/kieranpotts/thoughts) | `latest/dev` | `/thoughts/` |
| Garden | [kieranpotts/garden](https://github.com/kieranpotts/garden) | `dev` | `/garden/` |
| Bookmarks | [kieranpotts/bookmarks](https://github.com/kieranpotts/bookmarks) | `dev` | `/bookmarks/` |

The look and feel comes from a custom Antora UI theme maintained in the [kieranpotts/website-ui](https://github.com/kieranpotts/website-ui) repository, published as a release asset and pinned by version in the playbooks.

## 🛠️ Development tasks

```sh
npm run lint       # Build with --log-failure-level=warn
                   # (fails on broken xrefs etc.), against the
                   # dev playbook (site-dev.yml).
npm run lint:ci    # Same, against the production playbook
                   # (site-ci.yml).
npm run linkcheck  # Serve the built site and crawl it for
                   # broken internal links.
npm run clean      # Remove public/ and the Antora cache.
```

## 🚢 Deployment

The site deploys to [Netlify](https://www.netlify.com/). The build command is `npm run build` and the publish directory is `public/` (see `netlify.toml`). The `_redirects` and `_headers` files emitted into `public/` from `src/static/` preserve the site's legacy URLs and set the HSTS policy.

-----

Copyright © 2020-present Kieran Potts, [MIT license](./LICENSE.txt)
