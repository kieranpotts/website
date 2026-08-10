# AsciiDoc custom templates

Custom block-level HTML for the site's AsciiDoc content. These converters
replace the `<div class="…">`-heavy markup that Asciidoctor emits by default,
swapping it for lean, semantic HTML (`<figure>`, `<blockquote>`, `<aside>`,
bare `<h2 id>`, etc.).

We aim to override every block type this site's content actually uses (see
`src/ui/preview/modules/ROOT/pages/asciidoc.adoc` for the reference set),
listed in `templates/index.js` — so presentation is controlled entirely by
our own markup/CSS, not whatever wrapper classes Asciidoctor's stock
converter happens to emit. Any block type NOT listed there falls back to
Antora's native Asciidoctor rendering, unchanged.

## 🗂️ Layout

- `templates/` \
  One file per block type, each exporting a
  `({ node }) => htmlString` function. `index.js` maps Asciidoctor
  node names (as returned by `node.getNodeName()`) to these functions.
  Some related block types share a single file (`aside.js` for
  `sidebar`/`example`, since they render identically); `listing` and
  `literal` are kept as separate files even though their current output
  is nearly identical, since they're expected to diverge in styling.

  Nested content is only ever pulled through `node.getContent()`
  (rendered blocks) and, where an item's principal line isn't itself a
  block, `.getText()` — never Antora/Asciidoctor's default converter.
  For list items and description-list terms/descriptions, `.getText()`
  is the principal line and `.getContent()` is nested blocks
  (continuation paragraphs, sub-lists); both must be concatenated, or
  nested content is silently dropped.

  `listing` and `literal` both special-case blocks with an AsciiDoc style of
  `mermaid` (i.e. `[mermaid]`, however delimited) — shared in `templates/mermaid.js`
  — to render Mermaid diagrams client-side instead of as plain text. See
  [../../../docs/diagrams.md](../../../docs/diagrams.md) for the rationale
  and how it fits together with the theme's `src/ui/js/vendor/mermaid/`.

- `converter.js` \
  Installs the templates onto Asciidoctor's HTML5 converter as
  `$convert_<type>` method overrides.

- `extension.js` \
  The entry point listed under `asciidoc.extensions` in the playbooks.
  Calls into `converter.js`.

## 🔌 How it's wired

The playbooks ([site-dev.yml](../../../site-dev.yml),
[site-ci.yml](../../../site-ci.yml)) register the extension:

```yaml
asciidoc:
  extensions:
  - ./src/lib/asciidoc/extension.js
```

Antora calls each extension's exported `register` function once per converted
file, before it builds that file's document converter. We use that hook to
define our `$convert_<type>` overrides (idempotently — the install runs once
and guards against repeats).

## 📚 References

- Asciidoctor.js custom converters:
  <https://docs.asciidoctor.org/asciidoctor.js/latest/extend/converter/custom-converter/>

- Antora AsciiDoc extensions:
  <https://docs.antora.org/antora/latest/playbook/asciidoc-extensions/>
