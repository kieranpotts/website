const { isMermaid, renderMermaid } = require("./mermaid");

/**
 * Custom rendering for AsciiDoc `listing` (`----`) and `literal` (indented
 * or `....`) blocks. Both node types share this template — see ./index.js
 * — as they're styled identically: a `<figure class="code">` wrapping a
 * bare `<pre>…</pre>`, optionally closing with a `<figcaption>` when the
 * block has a title. The `code` class distinguishes these from image
 * figures, which don't share the same inner padding.
 */
module.exports = ({ node }) => {
  if (isMermaid(node)) return renderMermaid(node);

  let html = "";

  html += '<figure class="code">';
  html += "<pre>";
  html += `${node.getContent()}`;
  html += "</pre>";
  if (node.getTitle()) {
    html += `<figcaption>${node.getTitle()}</figcaption>`;
  }
  html += "</figure>";

  return html;
};
