# 🛠️ Development tools and methods

The easiest way to get started is to run `make` from this project's root to
see what devtools are available to you.

Alternatively, use the bundled `./run/*` scripts. These run each npm script
under the Node.js version pinned in `.nvmrc`, installed by
[mise](https://mise.jdx.dev), the same on the host and in the devcontainer.
Besides mise, no additional local software is required. Run `./run/install`
first. Or you can run the npm scripts directly, through whatever Node is on
your `PATH`.

| Script                   | npm                        | Description                                                                                                   |
|--------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------|
| `./run/install`          | `npm install`              | Install the pinned Node.js and the build dependencies. Run after `.nvmrc` or `package.json` changes.          |
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
