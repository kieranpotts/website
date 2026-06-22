 /**
 * Custom rendering of quote blocks.
 */
module.exports = ({ node }) => {
  const attr = node.attributes["$$smap"];
  let html = "";

  html += "<blockquote>";
  html += node.getContent();
  if (attr["attribution"]) {
    html += `<p>– ${attr.attribution}</p>`;
  }
  html += "</blockquote>";

  return html;
};
