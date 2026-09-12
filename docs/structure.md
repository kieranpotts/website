# 🗂️ Structure

- **`src/content/`** \
  AsciiDoc content for this site. The ROOT component (home and about pages)
  are under `src/content/modules/ROOT/`.

- **`src/static/`** \
  The site's `supplemental_files` mount. Holds files published to the site
  root — `robots.txt`, `favicon.ico`, Netlify's `_redirects`/`_headers`, and
  the feeds' XSLT stylesheets (`/feeds/*.xsl`). These are all listed as
  `static_files` in `src/static/ui.yml`. The feed documents themselves are
  generated — see `src/lib/feeds/`.

- **`src/ui/`** \
  The custom Antora UI theme (layouts, partials, CSS, JS, fonts, brand image),
  built in-repo by `gulpfile.js` into `src/ui/dist/` and consumed by the
  Antora playbooks (`site-*.yml`).

- **`src/lib/asciidoc/`** \
  Custom AsciiDoc block converters that emit semantic HTML (`<figure>`,
  `<blockquote>`, etc.).

- **`src/lib/feeds/`** \
  Antora extension that generates the RSS/Atom/JSON feeds from the aggregated
  blog content at build time.

- **`src/lib/content-preview/`** \
  Antora extension that overrides the `thoughts` content source's branch from
  `THOUGHTS_BRANCH`, when set, for one-off previews of draft blog posts. No-op
  on normal builds.

- **`site-dev.yml`** / **`site-ci.yml`** \
  The Antora playbooks for local development. Netlify and CI use `site-ci.yml`.

- **`gulpfile.js`** \
  Builds the `src/ui/` theme into `src/ui/dist/`. Runs automatically before
  the Antora build.

- **`docs/`** \
  Design notes recording the build's architecture decisions.

- **`AGENTS.md`** \
  Orientation for coding agents.

- **`CHANGELOG.md`** \
  Notable changes and version history.

- **`run/`** \
  Docker wrapper scripts for the build tasks.

- **`.github/workflows/`** \
  CI and automation. The important ones are:

  - **`verify-build.yaml`** \
    Builds and validates the site, and checks for broken internal links, on
    every change to `latest/dev`.

  - **`netlify-build.yaml`** \
    Triggers a Netlify production rebuild nightly (02:00 UTC), so new content
    pushed to the blog/garden/bookmarks sub-repositories is pulled in even
    without a change to this repo. Requires the `NETLIFY_BUILD_HOOK` secret.

  - **`netlify-preview.yaml`** \
    Manually triggered (`workflow_dispatch`). Builds a one-off Netlify preview
    of a draft branch of `kieranpotts/thoughts`, for eyeballing a new blog post
    before merging its PR. Requires a `NETLIFY_PREVIEW_HOOK` secret pointing
    at a dedicated non-production Netlify context.
