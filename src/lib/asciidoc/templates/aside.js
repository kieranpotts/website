/**
 * Custom rendering for AsciiDoc `sidebar` (`****`) and `example` (`====`)
 * blocks. Both node types share this template — see ./index.js — as
 * they're styled identically: a bare `<aside>`, optionally opening with
 * a `.title` div.
 */
module.exports = ({ node }) => {
  const id = node.getId()
  const title = node.getTitle()

  let html = ''

  html += `<aside${id ? ` id="${id}"` : ''}>`
  if (title) html += `<div class="title">${title}</div>`
  // A style-based sidebar (`[sidebar]` on a paragraph, no `****` delimiters)
  // has a "simple" content model – its content is the paragraph's raw
  // substituted text, not pre-wrapped in a <p>. Delimited sidebar blocks
  // are "compound" and their content is already fully-formed HTML.
  html += node.content_model === 'simple' ? `<p>${node.getContent()}</p>` : node.getContent()
  html += '</aside>'

  return html
}
