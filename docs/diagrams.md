# Diagrams-as-code

Mermaid diagrams (implemented as `[mermaid]` AsciiDoc blocks) render as diagrams
on the client-side.

PlantUML (`[plantuml]`) is not supported at this time.

## Authoring a diagram

Write a `[mermaid]` block with either listing (`----`) or literal (`....`)
delimiters, containing standard [Mermaid](https://mermaid.js.org) syntax.

```asciidoc
[mermaid]
....
flowchart TD
  A --> B
....
```

This renders as an SVG diagram in the browser.

See `src/ui/preview/modules/ROOT/pages/asciidoc.adoc` for an example,
and use `npm run preview:ui:serve` to see it rendered (serves the built
showcase over HTTP at `:8081`).

Rendering depends on ES modules (`<script type="module">`, dynamic
`import()`) — browsers block these from loading over `file://`, so opening
`www/index.html` directly, or any other built page, in a `file://` URL will
silently fail to render diagrams. Always view the showcase (and the real
site) through a local HTTP server. `npm run preview:ui:serve` (see
`src/ui/README.md`) does this for the showcase automatically.

## Design decision

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
