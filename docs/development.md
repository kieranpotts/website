# 🛠️ Development tools and methods

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
