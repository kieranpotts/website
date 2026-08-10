/**
 * Custom rendering of verse blocks. Unlike quote.js, content is wrapped in
 * a `<pre>` (not paragraphs) so line breaks in the source are preserved
 * verbatim, as verse (poetry, song lyrics) requires.
 */
module.exports = ({ node }) => {
  const attr = node.attributes["$$smap"];
  let html = "";

  html += "<blockquote>";
  html += `<pre>${node.getContent()}</pre>`;
  if (attr["attribution"] || attr["citetitle"]) {
    html += "<p>";
    if (attr["attribution"]) html += `– ${attr["attribution"]}`;
    if (attr["citetitle"]) html += `<br><cite>${attr["citetitle"]}</cite>`;
    html += "</p>";
  }
  html += "</blockquote>";

  return html;
};
