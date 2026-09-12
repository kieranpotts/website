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

## Hand-drawn diagrams (draw.io SVGs)

Where a diagram isn't a good fit for Mermaid's text-based syntax, it's drafted
in [draw.io](https://www.drawio.com/), then exported as SVG and hand-edited to
optimize for the web.

The following conventions apply to all hand-drawn diagrams across all of this
site's content sources.

- **Text labels are native SVG `<text>`/`<tspan>` elements, not
  `foreignObject`.** Draw.io exports labels as a `foreignObject` wrapping an
  HTML `<div>`, centered with a `height: 1px` + `padding-top` hack tuned to
  the diagram's original fixed pixel canvas. This breaks under this site's
  theme, which forces every inlined SVG to `width: 100%; height: auto` (see
  below) — the height calculation collapses or misbehaves at non-native
  sizes, and label text can render off-position, overlapping surrounding
  page content. Replace each `foreignObject` label with a plain `<text>`
  element (`text-anchor="middle"`, `dominant-baseline="central"`,
  `font-family="inherit"` to preserve font inheritance, `fill="currentColor"`
  for theming — see below). If a label doesn't fit the diagram's original
  column width at the target font size, wrap it onto multiple lines with
  `<tspan x="..." dy="...">` rather than widening the SVG's viewBox, unless
  the wider proportions genuinely read better.

- **Fonts** are inherited from the embedding page via `font-family="inherit"`
  set directly on each `<text>` element, as an SVG presentation attribute —
  not a CSS declaration in a `style` block (see the note on root-`<svg>`
  `style` stripping, below) — 14px, bold. This lets a diagram's text render
  in whatever font the page itself uses, rather than a fixed font baked into
  the diagram.

- **No hardcoded colors.** Nothing in the SVG should carry a literal hex/rgb/hsl
  value as its live color — every fill and stroke must theme itself off the
  embedding page, not off a value baked into the diagram at draw.io export
  time. This is why the SVG is inlined at all (see below): inlining is what
  makes page-derived theming possible in the first place, so every color in
  the file should actually take advantage of that.

  - **Foreground shapes and labels** (ink: text, strokes, filled shapes read
    as content rather than background) use `fill="currentColor"` /
    `stroke="currentColor"`, inheriting the page's own themed text color. No
    `color` declaration is needed on the SVG itself — a root-level one would
    be dead weight, per the root-`<svg>` `style`-stripping note below. This
    is required by the theme's own `fill:none; stroke:none` reset in any
    case — see below.

  - **A shape that represents the *page background* showing through a
    cutout** (eg. a fulcrum notch) is the one case that isn't foreground ink,
    so it can't use `currentColor`. Use `fill="var(--base-page, #ffffff)"`
    instead — referencing the site's real background custom property
    directly (`src/ui/css/_/properties.css`, scoped to `:root`, which the
    inlined SVG sits inside) rather than duplicating its value as a literal.
    Keep a literal fallback in the `var()`'s second argument only as
    resilience for the rare case the SVG is viewed somewhere the property
    isn't defined (eg. opened standalone, outside the Antora build) — that
    fallback is not "a hardcoded color" in the sense this rule forbids, since
    it never applies when the diagram is viewed on the site.

  Referencing `var(--base-page, ...)` directly like this is preferable to
  `light-dark(<light>, <dark>)` with literal values for the same reason
  `currentColor` beats a `light-dark()` literal for ink: it tracks the site's
  actual custom property, including the manual `data-theme` toggle override
  (`src/ui/js/45-theme-toggle.js` sets `data-theme` on `:root`, which
  `--base-page` itself responds to — see `_/properties.css`), not just the
  OS-level `prefers-color-scheme` that a bare `light-dark()` is limited to.

- **Shape strokes:** 2px, `currentColor`.

- **Shape fills:** `currentColor` for foreground shapes; `var(--base-page, ...)`
  for background cutouts (see above).

- **The theme's global reset sets `svg { fill: none; stroke: none; }`**
  (`src/ui/css/_/resets.css`) to stop browsers' default black-fill from
  bleeding through unstyled SVGs. An external stylesheet rule like this beats
  an SVG presentation attribute (`fill="currentColor"`) in the cascade, since
  presentation attributes carry the lowest possible specificity — so shapes
  can silently render invisible. Every shape that needs a fill/stroke must
  therefore either repeat it as an inline `style="fill: ...; stroke: ...;"`
  (inline styles beat external stylesheet rules of any specificity) or rely
  on a more specific selector. In practice, `fill="currentColor"` /
  `stroke="currentColor"` as plain presentation attributes have worked
  because there is no site rule targeting fill/stroke more specifically than
  the blanket `svg { fill: none; stroke: none; }` reset — but this is worth
  re-checking if shapes ever appear to vanish.

- Asciidoctor's SVG inliner strips the `style` attribute from the root
  `<svg>` element on build (confirmed against built output; inner elements'
  `style` attributes survive). Don't put anything load-bearing — font or
  color declarations included — in the root's `style` attribute; it never
  reaches the published page.

- **The theme's global reset also sets `svg { display: block; width: 100%;
  height: auto; }`** (`src/ui/css/_/resets.css`), making every inlined SVG
  fluid-width regardless of its own `width`/`height` attributes or the
  `image::` macro's positional width/height args (which are inert under
  `opts=inline` — Asciidoctor inlines the SVG file's own root attributes, not
  the macro's args; omit them from the macro rather than leaving misleading
  numbers). Any hand-edited internal layout — label positioning in
  particular — must degrade gracefully when scaled to an arbitrary width,
  not assume the diagram's original fixed pixel canvas.

- The draw.io "text is not SVG" fallback (a `<switch>` wrapping a truncated
  `<text>` element, used only if `foreignObject` isn't supported) is removed.
  This is moot for diagrams using native `<text>` labels (see above), since
  there's no `foreignObject` to need a fallback from; for any diagram that
  still legitimately needs `foreignObject`, `opts=inline` guarantees it
  always renders via the `foreignObject` path, so the fallback can still be
  safely removed.

- Draw.io's embedded metadata is removed. This is the `content="..."`
  attribute on the root `<svg>` element.

The SVGs are inlined/embedded into the document at build time (`opts=inline`).
The reason for this is to guarantee the highest level of cross-browser
compatibility for light/dark mode switches and font inheritance. Both
`light-dark()` and `font-family: inherit` only take effect when the SVG's CSS
is evaluated in the context of the embedding page. If an SVG is referenced as
a normal raster-style image (ie. rendered to an `<img src="...">` tag), it
gets its own independent, opaque rendering context that does not inherit the
page's styles, so `light-dark()` silently resolves to its default light-mode
value, and `font-family: inherit` resolves to the browser default font. This
is a browser/spec limitation. There's an open CSSWG issue
([w3c/csswg-drafts#8634](https://github.com/w3c/csswg-drafts/issues/8634))
tracking the general inability to pass page CSS into `<img>`-loaded SVGs.

Because of this, every `image::` macro that references one of these `.svg`
files must include the `opts=inline` attribute.

```asciidoc
image::diagrams/some-diagram.svg["Alt text",opts=inline]
```
