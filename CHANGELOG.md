# Changelog

## [Unreleased]

- feature: integrate the UI theme into this repo (`src/ui/`), built locally and consumed by the playbooks; retire the separate `kieranpotts/website-ui` release-asset workflow
- feature: custom AsciiDoc block converters (`src/lib/asciidoc/`) emitting semantic HTML (`<figure>`, `<blockquote>`, `<aside>`, etc.)
- feature: reintroduce small inline font style (theme, post-0.6.0)
- feature: improve spacing around list items (theme, post-0.6.0)
- feature: reintegrate umami analytics
- feature: light/dark mode toggle
- feature: download résumé
- maintenance github workflow to check production website for broken links

---

The entries below predate the merge and record the history of the UI theme,
formerly the standalone `kieranpotts/website-ui` repository. They are retained
here as the theme is now part of this repo.

## [0.6.0] - 2025-06-19

- feature: thinner default font
- feature: footer composed from unordered list
- feature: improved footer text/links rendering

## [0.5.0] - 2025-06-19

- feature: make the logo bigger!
- feature: remove opacity on logo hover
- feature: add prefers-color-scheme toggle to brand.svg

## [0.4.0] - 2026-06-19

- feature: graphic for website brand

## [0.3.0] - 2026-06-19

- fix: breadcrumbs spacing
- feature: improvements to sidebar, exampleblock, etc.

## [0.2.0] - 2026-06-17

- feature: decouple the theme from the website's structure
- feature: add a client-side floating table of contents with scrollspy
- feature: add a mobile nav menu that collapses behind a burger toggle
- maintenance: restructure the preview workflow
- docs: consolidate developer/maintainer documentation
- style: refine form controls
- refactor: modernize the JavaScript and the CSS reset.

## [0.1.0] - 2026-06-15

Early iteration.

## [0.0.0] - 2026-06-15

Early experiments.
