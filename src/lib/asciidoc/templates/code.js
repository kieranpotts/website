const { isMermaid, renderMermaid } = require("./mermaid");

/**
 * Custom rendering for AsciiDoc `listing` (`----`) and `literal` (indented
 * or `....`) blocks. Both node types share this template — see ./index.js
 * — as they're styled identically: a bare `<figure><pre>…</pre></figure>`,
 * optionally closing with a `<figcaption>` when the block has a title.
 */
module.exports = ({ node }) => {
  if (isMermaid(node)) return renderMermaid(node);

  let html = "";

  html += "<figure>";
  html += "<pre>";
  html += `${node.getContent()}`;
  html += "</pre>";
  if (node.getTitle()) {
    html += `<figcaption>${node.getTitle()}</figcaption>`;
  }
  html += "</figure>";

  return html;
};
