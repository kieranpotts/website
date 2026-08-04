/**
 * Renders `[mermaid]` AsciiDoc blocks client-side.
 *
 * Loaded on every page as a module script (see partials/head.hbs) — modules
 * are deferred by default, and the early-return below means pages without a
 * diagram pay only the cost of fetching this ~10 KB (gzipped) entry file,
 * not the ~500 KB+ Mermaid engine or any diagram-type chunk.
 *
 * The `[mermaid]` AsciiDoc templates (src/lib/asciidoc/templates/mermaid.js)
 * emit each diagram's raw source as the text content of a
 * `<pre data-mermaid>`. Mermaid reads that text content directly, so no
 * further decoding is needed here.
 */
const nodes = document.querySelectorAll('[data-mermaid]')

if (nodes.length) {
  const { default: mermaid } = await import('./mermaid.esm.min.mjs')

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: prefersDark ? 'dark' : 'default'
  })

  await mermaid.run({ nodes })
}
