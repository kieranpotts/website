const { isMermaid, renderMermaid } = require("./mermaid");

/**
 * Custom rendering of "literal" (indented or `....`) blocks.
 */
module.exports = ({ node }) => {
  if (isMermaid(node)) return renderMermaid(node);

  let html = "";

  html += '<figure class="literal">';
  html += "<pre>";
  html += `${node.getContent()}`;
  html += "</pre>";
  if (node.getTitle()) {
    html += `<figcaption>${node.getTitle()}</figcaption>`;
  }
  html += "</figure>";

  return html;
};
