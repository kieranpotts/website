/**
 * Custom template for block images.
 *
 * To keep Antora's URL resolution, this is invoked with the already-resolved
 * `<img>` markup produced by Antora's default image converter – see
 * `../converter.js`, which calls `super` then passes the rendered
 * `<img>` here.
 */
module.exports = ({ node, img }) => {
  const attrs = node.attributes["$$smap"];
  let html = "";

  html += "<figure>";
  if (attrs["link"]) {
    html += `<a href="${attrs["link"]}">`;
  }
  html += img;
  if (attrs["link"]) {
    html += "</a>";
  }
  if (node.getTitle()) {
    html += `<figcaption>${node.getTitle()}</figcaption>`;
  }
  html += "</figure>";

  return html;
};
