# 🎨 UI theme

The custom Antora UI theme for kieranpotts.com. It supplies the site's page chrome — layouts, partials, CSS, JS, fonts, and the brand image — that wrap the HTML Antora generates from the AsciiDoc content.

This theme used to live in a separate repository (`kieranpotts/website-ui`), published as a versioned `ui-bundle.zip` release asset. It was brought in-repo so the theme's CSS and the site's HTML shape — including the custom block converters in [../lib/asciidoc/](../lib/asciidoc/) that emit semantic elements like `<figure>` and `<blockquote>` — can change together.

## 🗂️ Layout

- `css/`: Stylesheets. Entry point `site.css` `@import`s the layered files under `_/` (fonts, properties, resets, typography, controls, layout, the `components/` styles incl. `asciidoc.css`, and utilities).

- `js/`: Theme scripts (`40-navbar.js`, `50-toc.js`). Numeric prefixes set the concatenation order. `js/vendor/` is copied through untouched — it holds third-party assets that must NOT be run through `terser`/`concat` (e.g. `js/vendor/mermaid/`, a prebuilt ES module bundle, loaded separately as `<script type="module">` from `partials/head.hbs`; see [../../docs/diagrams.md](../../docs/diagrams.md)).

- `helpers/`: Handlebars helpers (`and`, `eq`, `gt`, `or`).

- `layouts/`: Page layouts (`default.hbs`, `404.hbs`).

- `partials/`: Handlebars partials included by the layouts. `head.hbs`, `nav-menu.hbs`, and `footer.hbs` carry site-specific content (feed links, the navigation menu, the copyright line).

- `font/jetbrains-mono/`: The web fonts bundled with the theme (woff2).

- `img/brand.svg`: The navbar brand image.

- `ui.yml`: The UI bundle descriptor Antora reads.

- `preview/`: A standalone showcase (sample AsciiDoc pages) for iterating on the theme in isolation. See below.

## 🔨 Building

The theme is built by [../../gulpfile.js](../../gulpfile.js):

```sh
npm run bundle:ui   # Build the theme into src/ui/dist/.
npm run lint:css    # Lint the stylesheets (stylelint).
```

`bundle:ui` inlines the CSS `@import`s and autoprefixes them into a single `css/site.css`, concatenates and minifies the JS into `js/site.js`, copies the layouts/partials/helpers/fonts/img/ui.yml verbatim, and writes the result, unzipped, into `src/ui/dist/`. The site playbooks consume that directory directly (`ui.bundle.url: ./src/ui/dist`). The site build (`npm run build`) runs `bundle:ui` automatically before Antora.

`src/ui/dist/` is a build artifact and is git-ignored.

### Re-vendoring Mermaid

`js/vendor/mermaid/` is not hand-written — it's Mermaid's own prebuilt
browser bundle, copied verbatim from the `mermaid` package (a
devDependency, used only as a source of these files; nothing in the build
imports it as a module). To pick up a new Mermaid version:

```sh
npm install --save-dev mermaid@latest
cp node_modules/mermaid/dist/mermaid.esm.min.mjs src/ui/js/vendor/mermaid/
rm -rf src/ui/js/vendor/mermaid/chunks
mkdir -p src/ui/js/vendor/mermaid/chunks/mermaid.esm.min
find node_modules/mermaid/dist/chunks/mermaid.esm.min -name '*.mjs' ! -name '*.map' \
  -exec cp {} src/ui/js/vendor/mermaid/chunks/mermaid.esm.min/ \;
```

`js/vendor/mermaid/init.js` is the one hand-written file in that directory
— it's the site's own code, not part of Mermaid's package.

## 👀 Previewing the theme

```sh
npm run preview:ui   # Build the showcase (src/ui/preview/) into www/.
```

This builds the sample pages in `preview/` against the freshly built theme, so the UI can be developed without a full site build. Open `www/index.html`.

Because this repo is checked out as a Git worktree (which Antora's aggregator cannot read directly), the build first snapshots `preview/` into a throwaway `tmp/` Git repo. Both `www/` and `tmp/` are git-ignored. See [../../gulpfile.js](../../gulpfile.js) for details.
