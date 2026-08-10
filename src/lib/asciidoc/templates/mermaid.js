/**
 * Shared rendering for `[mermaid]` listing/literal blocks.
 *
 * Diagram source must be the block's raw, unescaped text (`node.getSource()`)
 * — not `node.getContent()`, which Asciidoctor HTML-escapes for prose
 * rendering and would corrupt Mermaid syntax (e.g. `-->`, quoted labels).
 * That raw text is then escaped here for safe embedding as the `<pre>`
 * element's HTML text content, which the theme's client-side Mermaid script
 * (`src/ui/js/60-mermaid.js`) reads back out and renders to SVG in place.
 */
const escapeHtml = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const isMermaid = (node) => node.getStyle() === "mermaid";

const renderMermaid = (node) => {
  let html = "";

  // The `code` class matches the code.js template's figures, so the raw
  // source gets the same box styling as any other listing/literal block
  // until (or unless) it's replaced with an SVG diagram.
  html += '<figure class="mermaid code">';
  html += `<pre data-mermaid>${escapeHtml(node.getSource())}</pre>`;
  if (node.getTitle()) {
    html += `<figcaption>${node.getTitle()}</figcaption>`;
  }
  html += "</figure>";

  return html;
};

module.exports = { isMermaid, renderMermaid };
