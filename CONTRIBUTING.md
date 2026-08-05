# Contributing

<!-- Agents MUST read ./AGENTS.md. This document is for humans. -->

> [!NOTE]
> This repo is not open to external contributions.

## 🚀 Quick start

The easiest way to get started is to run `make` from this project's root to
see what devtools are available to you.

Alternatively, use the bundled `./run/*` scripts. These execute everything in
a container. Besides Docker, no additional local software is required. Or you
can run things directly through a local Node install.

| Docker                   | Node (local)               | Description                                                                                                   |
|--------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------|
| `./run/install`          | `npm run install`          | Install build dependencies. Run after `package.json` changes.                                                 |
| `./run/build`            | `npm run build`            | Build the site into `public/`.                                                                                |
| `./run/serve`            | `npm run serve`            | Serve `public/` at `http://localhost:8080`.                                                                   |
| `./run/preview`          | `npm run preview`          | Watch sources and rebuild on change, served at `:8080`.                                                       |
| —                        | `npm run bundle:ui`        | Build the UI theme (`src/ui/`) into `src/ui/dist/`. Runs automatically before every site build.               |
| `./run/preview-ui`       | `npm run preview:ui`       | Build the theme's standalone showcase (`src/ui/preview/`) into `www/`.                                        |
| `./run/preview-ui-serve` | `npm run preview:ui:serve` | Build the showcase and serve it at `http://localhost:8081`. Does not watch for changes.                       |
| `./run/watch`            | `npm run watch`            | Watch `src/` and `site-dev.yml` and rebuild on change. Use `serve`/`preview` to serve the output.             |
| `./run/lint`             | `npm run lint`             | Build with `--log-failure-level=warn` (fails on broken xrefs etc.) against the dev playbook (`site-dev.yml`). |
| —                        | `npm run lint:ci`          | Same, against the production playbook (`site-ci.yml`).                                                        |
| `./run/lint-css`         | `npm run lint:css`         | Lint the theme stylesheets using stylelint.                                                                   |
| `./run/linkcheck`        | `npm run linkcheck`        | Serve the built site and crawl it for broken internal links.                                                  |
| `./run/clean`            | `npm run clean`            | Delete all built artifacts. |

## 🗂️ Structure

- `src/content/` \
  AsciiDoc content for this site. The ROOT component (home and about pages)
  are under `src/content/modules/ROOT/`.

- `src/static/` \
  The site's `supplemental_files` mount. Holds files published to the site
  root — `robots.txt`, `favicon.ico`, Netlify's `_redirects`/`_headers`, and
  the feeds' XSLT stylesheets (`/feeds/*.xsl`). These are all listed as
  `static_files` in `src/static/ui.yml`. The feed documents themselves are
  generated — see `src/lib/feeds/`.

- `src/ui/` \
  The custom Antora UI theme (layouts, partials, CSS, JS, fonts, brand image),
  built in-repo by `gulpfile.js` into `src/ui/dist/` and consumed by the
  Antora playbooks (`site-*.yml`).

- `src/lib/asciidoc/` \
  Custom AsciiDoc block converters that emit semantic HTML (`<figure>`,
  `<blockquote>`, etc.).

- `src/lib/feeds/` \
  Antora extension that generates the RSS/Atom/JSON feeds from the aggregated
  blog content at build time.

- `src/lib/content-preview/` \
  Antora extension that overrides the `thoughts` content source's branch from
  `THOUGHTS_BRANCH`, when set, for one-off previews of draft blog posts. No-op
  on normal builds.

- `site-dev.yml` / `site-ci.yml` \
  The Antora playbooks for local development. Netlify and CI use `site-ci.yml`.

- `gulpfile.js` \
  Builds the `src/ui/` theme into `src/ui/dist/`. Runs automatically before
  the Antora build.

- `docs/` \
  Design notes recording the build's architecture decisions.

- `AGENTS.md` \
  Orientation for coding agents.

- `CHANGELOG.md` \
  Notable changes and version history.

- `run/` \
  Docker wrapper scripts for the build tasks.

- `.github/workflows/` \
  CI and automation. The important ones are:

  - `build.yaml` \
    Builds and validates the site, and checks for broken internal links, on
    every change to `latest/dev`.

  - `netlify-build.yaml` \
    Triggers a Netlify production rebuild nightly (02:00 UTC), so new content
    pushed to the blog/garden/bookmarks sub-repositories is pulled in even
    without a change to this repo. Requires the `NETLIFY_BUILD_HOOK` secret.

  - `netlify-preview.yaml` \
    Manually triggered (`workflow_dispatch`). Builds a one-off Netlify preview
    of a draft branch of `kieranpotts/thoughts`, for eyeballing a new blog post
    before merging its PR. Requires a `NETLIFY_PREVIEW_HOOK` secret pointing
    at a dedicated non-production Netlify context.

## 📚 Content sources

The site aggregates four content sources at build time. The blog, garden, and
bookmarks are public repositories referenced by URL in the playbooks.

| Source         | Repository                                                        | Branch       | Published under |
|----------------|-------------------------------------------------------------------|--------------|-----------------|
| Home / about   | This repo                                                         | `HEAD`       | `/`             |
| Blog           | [kieranpotts/thoughts](https://github.com/kieranpotts/thoughts)   | `latest/dev` | `/thoughts/`    |
| Digital Garden | [kieranpotts/garden](https://github.com/kieranpotts/garden)       | `latest/dev` | `/garden/`      |
| Bookmarks      | [kieranpotts/bookmarks](https://github.com/kieranpotts/bookmarks) | `latest/dev` | `/bookmarks/`   |

The look and feel comes from a custom Antora UI theme built in-repo from
`src/ui/`.

Custom AsciiDoc converters are defined in `src/lib/asciidoc/` and evolve
alongside the theme. They override Antora's default markup for certain
AsciiDoc blocks.

## 🚢 Deployment

The site deploys to [Netlify](https://www.netlify.com/). The build command is
`npm run build:ci` and the publish directory is `public/` (see `netlify.toml`).

The `_redirects` and `_headers` files emitted into `public/` from `src/static/`
preserve the site's legacy URLs and set the HSTS policy.

Production is also rebuilt nightly (02:00 UTC) by the `netlify-build.yaml`
workflow, which POSTs to a Netlify build hook, stored in the `NETLIFY_BUILD_HOOK`
secret. This pulls in new content pushed to the blog/garden/bookmarks
sub-repositories.

Production builds can also be run manually from the GitHub Actions UI.

### Deployment previews

Netlify Deploy Previews are built from PRs. Work on a branch off `latest/dev`
and open a pull request. Netlify automatically builds the branch and posts a
temporary preview URL (`deploy-preview-<n>--kieranpotts.netlify.app`).

Merging the PR into `latest/dev` promotes the change to production as normal.

Preview builds use the same `npm run build:ci` command as production, so
`site.url` resolves to `https://kieranpotts.com`. On previews this only affects
absolute links and the sitemap.

Netlify automatically serves previews with `X-Robots-Tag: noindex`, keeping
preview URLs out of search engines.

### Previewing a draft `thoughts` branch

A website-repo preview only reflects changes in _this_ repo. The blog, garden,
and bookmarks are pulled from their published branches at build time. However,
there is a way to preview draft blog posts.

To preview an unmerged `thoughts` branch within the aggregated site — rather
than waiting for it to land on `latest/dev` — trigger the `Netlify Preview`
workflow.

1.  Push the draft branch to `kieranpotts/thoughts`.
2.  In this repo on GitHub, go to **Actions → Netlify Preview → Run workflow**.
3.  Enter the `thoughts` branch name in the `thoughts_branch` input, and run.
4.  The workflow's job summary prints the preview URL once triggered, eg.
    `https://latest-netlify-preview--kieranpotts.netlify.app` (the branch
    `latest/netlify-preview` is slugified).

### Replicating the Netlify Deploy Previews configuration

The preview workflow depends on Netlify dashboard configuration that isn't
stored in this repo or anywhere else. The following instruction explain how to
set it up from scratch .

1.  Create the `latest/netlify-preview` branch in this repo. It can be identical
    to `latest/dev`.

    ```sh
    git push origin latest/dev:latest/netlify-preview
    ```

2.  Add it as a branch-deploy context. From the Netlify dashboard, select this
    site, then go to **site configuration** → **build & deploy** →
    **continuous deployment**. Confirm the production branch is `latest/dev`.
    Under **branch deploys**, add `latest/netlify-preview`.

3.  Create a build hook scoped to the deploy branch. Go to **site configuration**
    → **build & deploy** → **build hooks** → **add build hook**. Name it, eg.
    `content-preview`. Set the **branch to build** to `latest/netlify-preview`.
    Save and copy the generated URL.

4.  Store the hook URL as a GitHub secret. In this GitHub repo, go to **settings**
    **secrets and variables** → **actions** → **new repository secret**. Set
    the name of the secret to `NETLIFY_PREVIEW_HOOK`.

No Netlify API token or site ID is needed. The build hook URL alone is enough
to trigger a build via `curl`.

## ✍️ Authoring

### Diagrams-as-code

Mermaid diagrams render as diagrams on the client-side. PlantUML (`[plantuml]`)
is not supported at this time.

Write a `[mermaid]` block with either listing (`----`) or literal (`....`)
delimiters, containing standard [Mermaid](https://mermaid.js.org) syntax.

```asciidoc
[mermaid]
....
flowchart TD
  A --> B
....
```

See `src/ui/preview/modules/ROOT/pages/asciidoc.adoc` for an example,
and use `npm run preview:ui:serve` to see it rendered.

> [!NOTE]
> Rendering depends on ES modules (`<script type="module">` with dynamic
> `import()`). Browsers block these from loading over `file://`, so opening
> the `www/index.html` preview file directly will fail to show the rendered
> diagrams. Instead, the showcase site must be loaded from an HTTP server.
> Use `npm run preview:ui:serve` for that purpose.

`[plantuml]` blocks render as plain text. It was considered to implement a
PlantUML renderer, but this requires a self-hosted Java program or the use
of the public plantuml.com service. JS packages that claim PlantUML support
only redirect requests to a PlantUML server. There is no client-side PlantUML
renderer available at this time. Therefore, supporting PlantUML would require
a Java-based rendering step at build time, or calling out to a third-party
rendering service from client-side scripting.

Mermaid is better support for client-side web rendering. The project provides
a self-contained JS bundle that parses diagram syntax and renders it to SVG
directly in the browser.

Mermaid's engine is not small. However, it only loads a minimal core framework
and then lazy-loads extensions as required for specific diagram types. Fetching
the coe engine plus one diagram-type chunk (eg. flowchart) typically runs
several hundred KB to ~1 MB gzipped. But most of this cost is paid only by
pages that contain a `[mermaid]` block, and initial page render is not blocked.

This deployment model fits better with my website's self-contained,
statically-hosted asset bundle.
