const { isMermaid, renderMermaid } = require("./mermaid");

/**
 * Custom rendering of "listing" blocks.
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
