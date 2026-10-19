/**
 * Custom rendering of verse blocks. Unlike quote.js, content is wrapped in
 * a `<pre>` (not paragraphs) so line breaks in the source are preserved
 * verbatim, as verse (poetry, song lyrics) requires.
 */
module.exports = ({ node }) => {
  const id = node.getId();
  const attr = node.attributes["$$smap"];
  let html = "";

  html += `<blockquote${id ? ` id="${id}"` : ""}>`;
  html += `<pre>${node.getContent()}</pre>`;
  if (attr["attribution"] || attr["citetitle"]) {
    html += "<p>";
    if (attr["attribution"]) html += `<span>– </span>${attr["attribution"]}`;
    if (attr["attribution"] && attr["citetitle"]) html += "<br>";
    if (attr["citetitle"]) html += `<cite>${attr["citetitle"]}</cite>`;
    html += "</p>";
  }
  html += "</blockquote>";

  return html;
};
