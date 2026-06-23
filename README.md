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

- `src/static/`: The site's `supplemental_files` mount. Holds files published to the site root — Netlify's `_redirects`/`_headers`, `robots.txt`/`favicon.ico`, and the feeds' XSLT stylesheets (`/feeds/*.xsl`), all listed as `static_files` in `src/static/ui.yml`. (The feed documents themselves are generated — see `src/lib/feeds/`.)

- `src/ui/`: The custom Antora UI theme (layouts, partials, CSS, JS, fonts, brand image), built in-repo by `gulpfile.js` into `src/ui/dist/` and consumed by the playbooks. See [src/ui/README.md](src/ui/README.md).

- `src/lib/asciidoc/`: Custom AsciiDoc block converters that emit semantic HTML (`<figure>`, `<blockquote>`, etc.). See [src/lib/asciidoc/README.md](src/lib/asciidoc/README.md).

- `src/lib/feeds/`: Antora extension that generates the RSS/Atom/JSON feeds (`/feeds/`) from the aggregated blog content at build time. See [src/lib/feeds/README.md](src/lib/feeds/README.md).

- `src/lib/content-preview/`: Antora extension that overrides the `thoughts` content source's branch from `THOUGHTS_BRANCH`, when set, for one-off draft previews. No-op on normal builds. See [🚢 Deployment](#-deployment).

- `site-dev.yml` / `site-ci.yml`: The Antora playbooks for local development (`http://localhost:8080`, reads the local git worktree via the sibling bare repo) and production (`https://kieranpotts.com`, reads the committed `HEAD`). Netlify and CI use `site-ci.yml`.

- `gulpfile.js`: Builds the `src/ui/` theme into `src/ui/dist/`. Runs automatically before the Antora build.

- `docs/`: Design notes recording the build's architecture decisions. See [docs/design-notes.md](docs/design-notes.md).

- `AGENTS.md`: Orientation for coding agents. `CHANGELOG.md`: notable changes (seeded with the UI theme's history).

- `run/`: Docker wrapper scripts for the build tasks.

- `.github/workflows/`: CI and automation.
  - `build.yaml`: Builds and validates the site, and checks for broken internal links, on every change to `latest/dev`.
  - `netlify-nightly-build.yaml`: Triggers a Netlify production rebuild nightly (02:00 UTC) via a build hook, so new content pushed to the blog/garden/bookmarks sub-repositories is pulled in even without a change to this repo. Requires the `NETLIFY_BUILD_HOOK` secret.
  - `netlify-content-preview.yaml`: Manually triggered (`workflow_dispatch`) — builds a one-off Netlify preview of a draft branch of `kieranpotts/thoughts`, for eyeballing a new blog post before merging its PR. Requires a `NETLIFY_PREVIEW_HOOK` secret pointing at a dedicated non-production Netlify context (see the workflow's header comment for one-time setup).
  - `validate-commit-messages.yaml`: Validates commit-message format on every push (all branches).
  - `sync-labels.yaml`: Syncs this repo's issue labels nightly (04:00 UTC) from [kieranpotts/.github](https://github.com/kieranpotts/.github), the source of truth for label config across the personal repositories.

## 📚 Content sources

The site aggregates four content sources at build time. The blog, garden, and bookmarks are public repositories referenced by URL in the playbooks (no token required). Their changes appear here once pushed to the branches below.

| Source | Repository | Branch | Published under |
|--------|------------|--------|-----------------|
| Home / about | this repo | `HEAD` | `/` |
| Blog | [kieranpotts/thoughts](https://github.com/kieranpotts/thoughts) | `latest/dev` | `/thoughts/` |
| Garden | [kieranpotts/garden](https://github.com/kieranpotts/garden) | `latest/dev` | `/garden/` |
| Bookmarks | [kieranpotts/bookmarks](https://github.com/kieranpotts/bookmarks) | `latest/dev` | `/bookmarks/` |

The look and feel comes from a custom Antora UI theme built in-repo from `src/ui/` (see [src/ui/README.md](src/ui/README.md)). The site build produces the theme locally and Antora consumes it directly, so the theme's CSS and the site's HTML — including the semantic block markup from the custom converters in `src/lib/asciidoc/` — evolve together. (The theme was previously a separate `kieranpotts/website-ui` repository pulled in as a versioned release asset.)

## 🛠️ Development tasks

```sh
npm run bundle:ui  # Build the UI theme (src/ui/) into
                   # src/ui/dist/. Runs automatically before
                   # every site build.
npm run preview:ui # Build the theme's standalone showcase
                   # (src/ui/preview/) into www/.
npm run lint       # Build with --log-failure-level=warn
                   # (fails on broken xrefs etc.), against the
                   # dev playbook (site-dev.yml).
npm run lint:ci    # Same, against the production playbook
                   # (site-ci.yml).
npm run lint:css   # Lint the theme stylesheets (stylelint).
npm run linkcheck  # Serve the built site and crawl it for
                   # broken internal links.
npm run clean      # Remove public/, the Antora cache, the
                   # built theme (src/ui/dist/), and the
                   # showcase artifacts (www/, tmp/).
```

## 🚢 Deployment

The site deploys to [Netlify](https://www.netlify.com/). The build command is `npm run build:ci` and the publish directory is `public/` (see `netlify.toml`). The `_redirects` and `_headers` files emitted into `public/` from `src/static/` preserve the site's legacy URLs and set the HSTS policy.

Pushes to `latest/dev` deploy to production at [kieranpotts.com](https://kieranpotts.com).

Production is also rebuilt nightly (02:00 UTC) by the `netlify-nightly-build.yaml` workflow, which POSTs to a Netlify build hook (stored in the `NETLIFY_BUILD_HOOK` secret). This pulls in new content pushed to the blog/garden/bookmarks sub-repositories, which would otherwise only reach production on the next change to this repo. It can also be run manually from the GitHub Actions UI.

Netlify Deploy Previews are built from PRs. Work on a branch off `latest/dev` and open a pull request. Netlify automatically builds the branch and posts a temporary preview URL (`deploy-preview-<n>--kieranpotts.netlify.app`). Merging the PR into `latest/dev` promotes the change to production.

Notes:

- Preview builds use the same `npm run build:ci` command as production, so `site.url` resolves to `https://kieranpotts.com`. On previews this only affects absolute links and the sitemap, which do not matter there.

- Netlify automatically serves previews with `X-Robots-Tag: noindex` (the `_headers` file only sets HSTS, so it does not override this), keeping preview URLs out of search engines.

- A website-repo preview only reflects changes in *this* repo. The blog, garden, and bookmarks are pulled from their published branches at build time, so changes there are previewed in their own repositories, not here.

### Previewing a draft `thoughts` branch

To preview an unmerged `thoughts` branch within the aggregated site — rather than waiting for it to land on `latest/dev` — trigger the `Netlify Preview` workflow:

1. Push the draft branch to `kieranpotts/thoughts`.
2. In this repo on GitHub, go to **Actions → Netlify Preview → Run workflow**.
3. Enter the `thoughts` branch name in the `thoughts_branch` input, and run.
4. The build deploys to the `latest/netlify-preview` Netlify branch-deploy context, at `https://latest-preview--kieranpotts.netlify.app` (Netlify slugifies the `/` to `-`) — not the production URL.

This requires the one-time Netlify setup described in `netlify-content-preview.yaml`'s header comment (a `latest/netlify-preview` branch-deploy context plus its own build hook secret). See `src/lib/content-preview/` for how the override is applied at build time.

## 🎨 Design notes

The custom Antora UI theme lives in this repository, under `src/ui/`, and is built locally as part of the site build. The theme was previously a standalone repository, built into an Antora bundle, `ui-bundle.zip`, and published as a versioned GitHub release asset.

However, when we added custom AsciiDock block converters to this repo (`src/lib/asciidoc/`), that created a tight coupling to the UI theme. The theme was now required to style HTML syntax that generated in this repository – thus the theme was no longer portable between different Antora instances.

Co-locating the theme with the website removed this boundary. The HTML shape and the CSS that styles it now live and change together. The workflow is simpler too, as there's no need to pin the website to specific releases of the UI theme.

-----

Copyright © 2020-present Kieran Potts, [MIT license](./LICENSE.txt)
