/**
 * Custom template for block images.
 *
 * To keep Antora's URL resolution, this is invoked with the already-resolved
 * `<img>` markup produced by Antora's default image converter – see
 * `../converter.js`, which calls `super` then passes the rendered
 * `<img>` here.
 *
 * A linked image's `<a>` carries the `image` class too – same convention
 * Asciidoctor's stock inline-image converter uses – so the IMAGE FIGURES
 * rule in asciidoc.css (`figure.image > img`) still matches the `<img>`
 * regardless of whether it's wrapped in a link.
 */
module.exports = ({ node, img }) => {
  const attrs = node.attributes["$$smap"];
  let html = "";

  html += '<figure class="image">';
  if (attrs["link"]) {
    html += `<a class="image" href="${attrs["link"]}">`;
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
