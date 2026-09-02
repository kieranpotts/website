# Changelog

The changelog is hand-maintained. Keep the [Unreleased] section up-to-date with
new revisions introduced to the development trunk. The format is loosely based
on <https://keepachangelog.com/en/1.1.0/>.

The version numbers reflect major milestones, rather than releases. The site
is deployed continuously, on every update to the upstream `latest/dev` trunk,
via Netlify.

## [Unreleased]

## [0.8.0] - 2026-09-02

- Typography tweaks.
- Fix QandA rendering.
- Remove bold for inline and block-level code.
- Add bold for figcaptions.
- Narrow text-underline-offset

## [0.7.0] - 2026-08-10

- Add bookmarks content source.
- Add résumé as a download link.
- Add light/dark mode toggle.
- Integrate the UI theme into this repo (`src/ui/`).
- Retire the separate `kieranpotts/website-ui` repository and workflow.
- Add custom AsciiDoc block converters (`src/lib/asciidoc/`) that emit semantic
  HTML — `<figure>`, `<blockquote>`, `<aside>`, etc.
- Various style improvements, including:
  - Reintroduce small inline font style.
  - Improve spacing around list items.
  - Fix missing headings from sidebars.
  - Fix "undefined" element IDs.
  - Fix AsciiDoc embedded image and video sizing and centering.
  - Fix inconsistency of presentation between rich and simple sidebar content.
  - Evolve styling of sidebars (asides).
  - Evolve presentation of inline code.
- Reintegrate Umami analytics.
- Add GitHub workflow to check production website for broken links.
- Add `./run/release` automation script.

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
