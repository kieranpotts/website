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

## Hand-drawn diagrams

Diagrams are created in Draw.io then exported and hand-edited to optimize
for inline rendering in the context of this site's theme.

SVG source content MUST follow
https://kieranpotts.com/standards/039#vector-graphics[TS-9].

In addition, the following conventions and guidelines apply to all hand-drawn
diagrams across all of this site's content sources.

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

- Fonts SHOULD be inherited from the embedding page via `font-family="inherit"`
  set directly on each `<text>` element. This lets a diagram's text render in
  whatever font the page itself uses, rather than a fixed font baked into the
  diagram. Diagrams automatically evolve with the site theme.

- No hardcoded colors. Nothing in the SVG should carry a literal hex/rgb/hsl
  value. Instead, every fill and stroke must theme itself off the parent page.

- All foreground shapes and labels use `fill="currentColor"` / `stroke="currentColor"`.

- Shape strokes: 2px, `currentColor`.

- Draw.io's embedded metadata — embedded in the `content="..."` attribute on the
  root `<svg>` element — MUST be removed.

SVGs are inlined using the following AsciiDoc image macro syntax. The
`opts=inline` bit is important. This is the signal to the `asciidoctor`
compiler to inline the image at build time.

```asciidoc
image::diagrams/some-diagram.svg["Alt text",opts=inline]
```

This gives the diagrams the highest possible level of cross-browser compatibility
for light/dark mode switches and font inheritance. This has the following
consequences.

- Asciidoctor's SVG inliner (`opts=inline`) strips the `style` attribute from
  the root `<svg>` element on build.

- The theme's global reset sets `svg { fill: none; stroke: none; }`
  to stop browsers' default black-fill from bleeding through unstyled SVGs.

- The theme's global reset also sets
  `svg { display: block; width: 100%; height: auto; }`, making every inlined SVG
  fluid-width regardless of its own `width`/`height` attributes.
