# ✍️ Authoring

## Diagrams-as-code

Mermaid blocks (`[mermaid]`) render as diagrams on the client-side. PlantUML
(`[plantuml]`) is not supported at this time.

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

It was considered to implement a PlantUML renderer, but this requires a
self-hosted Java program or the use of the public plantuml.com service. JS
packages that claim PlantUML support only redirect requests to a PlantUML
server. There is no client-side PlantUML renderer available at this time.
Therefore, supporting PlantUML would require a Java-based rendering step at
build time, or calling out to a third-party rendering service from client-side
scripting.

Mermaid has better support for client-side web rendering. The project provides
a self-contained JS bundle that parses diagram syntax and renders it to SVG
directly in the browser.

Mermaid's engine is not small. However, it only loads a minimal core framework
and then lazy-loads extensions as required for specific diagram types. Fetching
the core engine plus one diagram-type chunk (eg. flowchart) typically runs
several hundred KB to ~1 MB gzipped. But most of this cost is paid only by
pages that contain a `[mermaid]` block, and initial page render is not blocked.

This deployment model fits better with my website's self-contained,
statically-hosted asset bundle.

## Hand-drawn diagrams

Diagrams are created in Draw.io then exported and hand-edited to optimize
for inline rendering in the context of this site's theme.

### Sizing

When rendered in AsciiDoc content, inline diagrams are sized by their own
`width`/`height`. Because of this, the root `<svg>` element's `viewBox` MUST be
1:1 with its `width`/`height` attributes.

```xml
<svg width="500px" height="320px" viewBox="-0.5 -0.5 500 320">
```

Diagrams SHOULD be sized between 320px and 800px wide.

- The lower bound is the narrowest viewport the theme supports
  (`html { min-width: 320px; }`). A diagram no wider than 320px fits every
  supported screen without scaling, so its labels always render at their
  nominal size.

- The upper bound is the widest a content column ever renders. Prose columns
  cap out at `80ch`, which resolves to roughly 700–800px at the theme's largest
  root font size.

Within the band, width is a trade-off against small screens.
`.AsciiDoc figure.image svg` pairs `width: auto` (for fluidity to the container
size) with `max-width: 100%` (to prevent clipping), so a diagram wider than the
column scales down proportionally to fit. Nothing is lost, but the labels shrink
with it. A 500px-wide diagram in a 320px viewport renders its `font-size="14"`
labels at about 8px.

So the narrower a diagram is, the better it holds up on a phone. Size to the
content, and prefer the lower end of the band where the drawing allows it.

### Conventions

SVG source content MUST follow
[TS-39](https://kieranpotts.com/standards/039#vector-graphics).

In addition, the following conventions and guidelines apply to all hand-drawn
diagrams across all of this site's content sources. Where they conflict with
TS-39, the conventions below take precedence. In particular:

- Presentation attributes (`fill`, `stroke`, `font-size`, `font-family`, and so
  on) MUST be set directly on each element, even where the same value repeats
  across many elements. They MUST NOT be moved to a `<style>` block, as TS-39
  otherwise recommends. Each element stays self-describing, and the diagram
  renders the same whether it's inlined into the site or opened standalone.

- Attributes are not required to be in alphabetical order. The order Draw.io
  exports them in MAY be kept.

- Draw.io exports labels as `foreignObject` instances wrapping an HTML `<div>`.
  Under this site's theme, this can result in label text rendering off-position.
  For this reason, we MUST manually replace `foreignObject` text labels with
  native SVG `<text>` and `<tspan>` elements, with the following attributes.

  - `text-anchor="middle"`, `dominant-baseline="central"`, and
    `font-family="inherit"` to preserve font inheritance.

  - `fill="currentColor"` to inherit the document's font color.

- If a label doesn't fit the diagram's original column width at the target font
  size, consider wrapping it onto multiple lines with `<tspan x="..." dy="...">`,
  rather than widening the SVG's viewBox.

- Labels MUST use a base font size of 14px, `font-size="14"`, set on each
  `<text>` element. Keeping one size across every diagram means labels render
  at the same size as each other wherever they appear on the site. Emphasis
  comes from `font-weight="bold"`, not from a bigger size.

- Multi-line labels MUST use a line spacing of 16 at `font-size="14"`. For a
  two-line label vertically centered on its anchor point, that's `dy="-8"` on
  the first `<tspan>` and `dy="16"` on the second. In general, a label of _n_
  lines sets `dy` to −8 × (_n_ − 1) on the first `<tspan>`, eg. `dy="-16"` for
  three lines, and `dy="16"` on each one after.

- Labels MUST use Title Case: capitalize every word, except articles,
  conjunctions, and short prepositions ("a", "and", "per", "of", etc.) that are
  not the first word. For example, "Accidental Complexity" and "Bugs Found per
  Month". Labels MUST NOT be set in all capitals.

  The exception is text that reads as a sentence, such as a question or a
  statement. This MUST use sentence case, eg. "What is the pricing strategy?"

- Labels MUST NOT be rotated. This includes chart axis labels. A y-axis label
  sits horizontally to the left of the axis, wrapped onto multiple lines if
  needed, with the plot area narrowed to make room. Rotated text is harder to
  read, and it doesn't wrap.

- Fonts SHOULD be inherited from the embedding page via `font-family="inherit"`
  set directly on each `<text>` element. This lets a diagram's text render in
  whatever font the page itself uses, rather than a fixed font baked into the
  diagram. Diagrams automatically evolve with the site theme.

- Simple diagrams should have no hardcoded colors — no literal hex/rgb/hsl
  values, other than the `var()` fallback for paper fills described below.
  Instead, every fill and stroke must theme itself off the parent page.
  The exception is for diagrams where color itself carries meaning. These
  diagrams MAY use literal color values. They SHOULD still pick values that
  work in both light and dark themes (eg. via `light-dark()` or a light/dark-safe
  palette).

  The RECOMMENDED pattern sets the light-theme hex value as the presentation
  attribute, and overrides it with `light-dark()` in the element's own `style`
  attribute. The hex value is the fallback wherever `light-dark()` isn't
  supported. Record why the color carries meaning in an XML comment in the SVG.

  ```xml
  <!-- Colors carry meaning here: ... -->
  <rect fill="#f0a30a" stroke="#bd7000" stroke-width="2"
      style="fill: light-dark(rgb(240, 163, 10), rgb(154, 88, 0)); stroke: light-dark(rgb(189, 112, 0), rgb(193, 127, 31));"/>
  ```

  A `style` attribute on a child element is fine. Only the root `<svg>`'s
  `style` is stripped on build, and the ban on `<style>` blocks still applies.

- All foreground shapes and labels use `fill="currentColor"` / `stroke="currentColor"`,
  except where the color exception above applies.

- Neutral tint fills — greys or other low-contrast shades used only to group
  or set off areas, including `light-dark()` greys — SHOULD NOT be used. A shape
  is either unfilled (`fill="none"`), filled with paper
  (`var(--base-page, #ffffff)`), or filled solid with `currentColor`. Grouping is
  shown with outlines, dashed borders, or position instead. A tint MAY be used
  only when there's a good reason that those can't serve, and that reason
  SHOULD be recorded in an XML comment in the SVG.

- Diagrams MUST use clean, geometric shapes: straight lines, true rectangles,
  circles, and smooth curves. Draw.io's "sketch" style (wobbly hand-drawn
  outlines, rough fills, and hachures) and its handwriting-style fonts MUST NOT
  be used. Sketch shapes are exported as dense, filled outline paths rather than
  strokes, so they can't follow the stroke rule below, and they bloat the file.

- Shapes that need an opaque "paper" fill — a box that masks lines behind it, or
  a label knocked out of a solid `currentColor` shape — MUST use the theme's page
  background token, `var(--base-page, #ffffff)`. This is the one place a literal
  color value is allowed in a simple diagram, and only as the fallback argument
  of `var()`, never on its own.

  The fallback is REQUIRED. The `--base-page` custom property only exists when
  the SVG is inlined into a page built with this site's theme. Anywhere else —
  opening the `.svg` file directly, GitHub's file preview, an editor's image
  preview, or re-importing into Draw.io — the property is undefined. A `fill`
  referencing an undefined property with no fallback does not render as
  transparent. It inherits the SVG's initial fill, which is black, so every
  paper shape becomes a solid black block that hides the `currentColor` ink
  on top of it. The white fallback keeps the source file legible outside the
  site, matching the default black-on-white rendering of `currentColor` there.

- Strokes MUST be 2px (`stroke-width="2"`) and `currentColor`. This applies to
  every stroked element, not only closed shapes: box outlines, connector and
  leader lines, dotted or dashed dividers, chart axes, and chart data curves.
  Dashed and dotted lines use `stroke-dasharray="2 4"`.

- Arrowheads are drawn as separate filled triangles, `fill="currentColor"` and
  `stroke="none"`, about 10px long and 10px wide, with the line ending just
  inside the triangle's base. They MUST NOT use `<marker>` elements, because a
  marker needs an `id`, and inlined SVGs on the same page share one ID
  namespace (see TS-39).

- Draw.io's embedded metadata — embedded in the `content="..."` attribute on the
  root `<svg>` element — MUST be removed.

- Draw.io's other export cruft MUST also be removed: the unused
  `xmlns:xlink` namespace declaration (unless the diagram actually uses
  `xlink:href`), empty `<defs/>` elements, and `pointer-events` and
  `stroke-miterlimit` attributes. None of these affect rendering on this site.

- Every diagram MUST have a `<title>` as the first child of the root `<svg>`,
  describing what the diagram shows. This is the diagram's accessible name.
  See [Inlining](#inlining) for why the image macro's alt text isn't used for
  this.

### Inlining

SVGs are inlined using the following AsciiDoc image macro syntax. The
`opts=inline` bit is important. This is the signal to the `asciidoctor`
compiler to inline the image at build time.

```asciidoc
image::diagrams/some-diagram.svg[opts=inline]
```

Alt text MAY be omitted from the macro. When an SVG is inlined, Asciidoctor
writes the `<svg>` markup straight into the page and discards the alt text. It
only uses the alt text as a fallback if it can't read the SVG file. Screen
readers get the diagram's accessible name from the SVG's own `<title>` element
instead, so that's where the description belongs.

This gives the diagrams the highest possible level of cross-browser compatibility
for light/dark mode switches and font inheritance. This has the following
consequences.

- Asciidoctor's SVG inliner (`opts=inline`) strips the `style` attribute from
  the root `<svg>` element on build.

- The theme's global reset sets `svg { fill: none; stroke: none; }`
  to stop browsers' default black-fill from bleeding through unstyled SVGs.

- The theme's global reset also sets
  `svg { display: block; width: 100%; height: auto; }`. Image figures opt out
  of the fluid width, however: the AsciiDoc component sets
  `.AsciiDoc figure.image svg { width: auto; max-width: 100%; }`, so an inlined
  diagram is sized by its own `width`/`height` attributes, capped at the column.
  It is never upscaled past its intrinsic size. See [Sizing](#sizing) above —
  this is why the `viewBox` has to match those attributes. Mermaid figures are
  sized the same way, from their intrinsic dimensions.
