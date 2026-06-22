# AsciiDoc custom templates

Custom block-level HTML for the site's AsciiDoc content. These converters replace the `<div class="…">`-heavy markup that Asciidoctor emits by default, swapping it for lean, semantic HTML (`<figure>`, `<blockquote>`, `<aside>`, bare `<h2 id>`, etc.).

We override only the block types in `templates/index.js`. Every other block type falls back to Antora's native Asciidoctor rendering, unchanged.

## 🗂️ Layout

- `templates/`: One file per block type, each exporting a
  `({ node }) => htmlString` function. `index.js` maps Asciidoctor node names (as returned by `node.getNodeName()`) to these functions.

- `converter.js`: Installs the templates onto Asciidoctor's HTML5 converter as `$convert_<type>` method overrides.

- `extension.js`: The entry point listed under `asciidoc.extensions` in the playbooks. Calls into `converter.js`.

## 🔌 How it's wired

The playbooks ([site-dev.yml](../../../site-dev.yml), [site-ci.yml](../../../site-ci.yml)) register the extension:

```yaml
asciidoc:
  extensions:
  - ./src/lib/asciidoc/extension.js
```

Antora calls each extension's exported `register` function once per converted file, before it builds that file's document converter. We use that hook to define our `$convert_<type>` overrides (idempotently — the install runs once and guards against repeats).

## 📚 References

- Asciidoctor.js custom converters:
  <https://docs.asciidoctor.org/asciidoctor.js/latest/extend/converter/custom-converter/>

- Antora AsciiDoc extensions:
  <https://docs.antora.org/antora/latest/playbook/asciidoc-extensions/>
