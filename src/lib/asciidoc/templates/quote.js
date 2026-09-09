 /**
 * Custom rendering of quote blocks. See verse.js for the closely-related
 * verse block, which preserves line breaks verbatim instead of flowing
 * content as paragraphs.
 */
module.exports = ({ node }) => {
  const id = node.getId();
  const attr = node.attributes["$$smap"];
  let html = "";

  html += `<blockquote${id ? ` id="${id}"` : ""}>`;
  // A style-based quote (`[quote, Author]`, no `____` delimiters) has a
  // "simple" content model – its content is the paragraph's raw
  // substituted text, not pre-wrapped in a <p>. Delimited quote blocks
  // are "compound" and their content is already fully-formed HTML – same
  // distinction as admonition.js/aside.js.
  html += node.content_model === "simple" ? `<p>${node.getContent()}</p>` : node.getContent();
  if (attr["attribution"] || attr["citetitle"]) {
    html += "<p>";
    if (attr["attribution"]) html += `– ${attr["attribution"]}`;
    if (attr["citetitle"]) html += `<br><cite>${attr["citetitle"]}</cite>`;
    html += "</p>";
  }
  html += "</blockquote>";

  return html;
};
