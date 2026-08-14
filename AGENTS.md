# Website

Source and build for [kieranpotts.com](https://kieranpotts.com). This is a
static site built with [Antora](https://antora.org) from
[AsciiDoc](https://asciidoc.org) sources.

The build aggregates the home/about pages (in this repo) with the blog,
digital garden, and bookmarks (each its own repository, pulled in at
build time), and applies a custom UI theme and custom AsciiDoc block
converters — both maintained in this repo.

## Tech stack

- Node.js (version pinned in `.nvmrc`).
- Antora (content aggregation + site generation).
- Asciidoctor.js, extended with custom block converters (`src/lib/asciidoc/`).
- A custom Antora UI theme (`src/ui/`). Handlebars layouts/partials/helpers,
  PostCSS-built CSS, minified JS, web fonts — built by Gulp.
- Stylelint for the theme's CSS.
- Docker (optional): `run/` wrapper scripts run the build with no local Node.

## Project structure

- `src/content/` \
  AsciiDoc content for this site (the ROOT component — home and about pages).

- `src/static/` \
  `supplemental_files` mount — files published to the site root (`_redirects`,
  `_headers`, `robots.txt`, `favicon.ico`, and the feeds' `.xsl` stylesheets).
  See `src/static/ui.yml`.

- `src/ui/` \
  The custom Antora UI theme. Built by `gulpfile.js` into
  `src/ui/dist/` (git-ignored) and consumed by the playbooks. `src/ui/preview/`
  is a standalone showcase. See `src/ui/README.md`.

- `src/lib/asciidoc/` \
  Custom AsciiDoc block converters that emit semantic
  HTML (`<figure>`, `<blockquote>`, etc.), wired in via the playbooks'
  `asciidoc.extensions`. See `src/lib/asciidoc/README.md`.

- `src/lib/feeds/` \
  Antora extension (playbooks' `antora.extensions`) that
  generates the RSS/Atom/JSON feeds from the aggregated blog content at build
  time. See `src/lib/feeds/README.md`.

- `site-dev.yml` / `site-ci.yml` \
  Antora playbooks for local development and
  production. Netlify and CI use `site-ci.yml`.

- `gulpfile.js` \
  Builds the `src/ui/` theme. Runs automatically before Antora.

- `run/` \
  Docker wrapper scripts for the build tasks.

- `docs/` \
  Design notes (architecture decisions).

- `.github/workflows/` \
  CI and automation. `verify-build.yaml` builds, validates, and
  link-checks the site on every change to `latest/dev`. `netlify-build.yaml`
  triggers a nightly (02:00 UTC) Netlify rebuild via a build hook to pull in
  new sub-repository content (`NETLIFY_BUILD_HOOK` secret).
  `validate-commit-messages.yaml` validates commit-message format on
  every push. `sync-labels.yaml` syncs issue labels nightly (04:00 UTC)
  from `kieranpotts/.github`.

## Tools

- `npm run build` \
  Build the site into `public/` (dev playbook).
  Runs `bundle:ui` first.

- `npm run build:ci` \
  Same, against the production playbook (used by Netlify/CI).

- `npm run preview` \
  Watch sources and rebuild, served at `:8080`.

- `npm run bundle:ui` \
  Build the UI theme into `src/ui/dist/`.

- `npm run preview:ui` \
  Build the theme's standalone showcase into `www/`.

- `npm run lint` / `lint:ci` \
  Build with `--log-failure-level=warn`
  (fails on broken xrefs etc.).

- `npm run lint:css` \
  Lint the theme stylesheets.

- `npm run linkcheck` \
  Crawl the built site for broken internal links.

The Docker equivalents are `./run/install`, `./run/build`, `./run/serve`,
`./run/preview`.

## Rules

- This working tree is a Git worktree, which Antora's aggregator
  (isomorphic-git) cannot read directly. Local dev (`site-dev.yml`) therefore
  reads the sibling bare repo (`../.bare`) on `latest/dev`, so local builds
  reflect only committed content on that branch. The theme showcase works
  around the same limitation by snapshotting `src/ui/preview/` into a
  throwaway `tmp/` repo.

- The UI bundle MUST contain `ui.yml` at its root. Antora rejects a bundle
  without it. It is at `src/ui/ui.yml` and copied into `src/ui/dist/`.

- The blog/garden/bookmarks are submodules and cannot be read as local
  content sources. They are referenced by public remote URL in the playbooks,
  so changes there must be pushed to their published branches before they
  appear here.

## References

The following technical standards (TS) govern this project. Fetch and ingest
the relevant standards as-and-when required for the task at hand.

- [**TS-28: AsciiDoc**](https://kieranpotts.com/standards/028) \
  Use when writing or reviewing AsciiDoc documents or websites built using
  Antora.

- [**TS-38: Node.js Applications**](https://kieranpotts.com/standards/038) \
  Use when designing, building, or deploying Node.js applications.

- [**TS-36: ECMAScript (JavaScript/TypeScript)**](https://kieranpotts.com/standards/036) \
  Use when writing or reviewing JavaScript or TypeScript source code. Covers
  syntax, modules, async programming, functional patterns, and testing.

- [**TS-25: Technical Documentation**](https://kieranpotts.com/standards/025) \
  Use when deciding what documentation a project needs, where it should live,
  who it's for, or whether it's still trustworthy.

- [**TS-9: Version Control**](https://kieranpotts.com/standards/009) \
  Use when working with Git. Covers commits, branching, merging, integration
  strategies, cutting releases, and configuring Git/PR/CI tooling.
