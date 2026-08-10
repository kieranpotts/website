# Changelog

## [Unreleased]

- Add bookmarks content source. 
- Add résumé as a download link.
- Integrate the UI theme into this repo (`src/ui/`).
- Retire the separate `kieranpotts/website-ui` repository and workflow.
- Add custom AsciiDoc block converters (`src/lib/asciidoc/`) that emit semantic
  HTML — `<figure>`, `<blockquote>`, `<aside>`, etc.
- Reintroduce small inline font style.
- Improve spacing around list items.
- Reintegrate Umami analytics.
- Add light/dark mode toggle.
- Add link to download résumé.
- Add GitHub workflow to check production website for broken links.
- Fix missing headings from sidebars.
- Fix AsciiDoc embedded image and video sizing and centering.
- Remove `<hr/>` before `<aside>` in AsciiDoc content.
- Fix styling for AsciiDoc asides.
- AsciiDoc rendering: fix "undefined" element IDs.
- Fix inconsistency of presentation between rich and simple sidebar content.
- Refactor: merge templates for sidebars and example blocks.
- Consolidate template and refine the style of listing and litertal blocks.
- Adjust presentation of inline code.
- Custom AsciiDoc templates for processing all in-use AsciiDoc block types.

-----

The entries below predate the merge and record the history of the UI theme,
formerly the standalone `kieranpotts/website-ui` repository. They are retained
here as the theme is now part of this repo.

## [0.6.0] - 2025-06-19

- Thinner default font.
- Footer composed from unordered list.
- Improved footer text/links rendering.

## [0.5.0] - 2025-06-19

- Make the logo bigger!
- Remove opacity on logo hover.
- Add prefers-color-scheme toggle to brand.svg.

## [0.4.0] - 2026-06-19

- Graphic for website brand.

## [0.3.0] - 2026-06-19

- Fix breadcrumbs spacing.
- Improvements to sidebar, exampleblock, etc.

## [0.2.0] - 2026-06-17

- Decouple the theme from the website's structure.
- Add a client-side floating table of contents with scrollspy.
- Add a mobile nav menu that collapses behind a burger toggle.
- Restructure the preview workflow.
- Consolidate developer/maintainer documentation.
- Refine form controls.
- Modernize the JavaScript and the CSS reset..

## [0.1.0] - 2026-06-15

Early iteration.

## [0.0.0] - 2026-06-15

Early experiments.
