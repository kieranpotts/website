/**
 * Custom rendering of admonition blocks (NOTE, TIP, IMPORTANT, CAUTION,
 * WARNING). Emits a bare `<div class="admonition <type>">` – no
 * `.admonitionblock`/icon-table wrapper. The type name is rendered as a
 * plain-text label rather than an icon font, so it degrades gracefully
 * and needs no `content: attr(title)` trick to read out the admonition
 * type.
 */
module.exports = ({ node }) => {
  const id = node.getId()
  const type = node.getStyle().toLowerCase()
  let html = ''

  html += `<div${id ? ` id="${id}"` : ''} class="admonition ${type}">`
  html += `<p class="label">${node.getCaption()}</p>`
  // Titles are intentionally not rendered. An admonition's type label
  // already serves as its heading; a user-supplied title would duplicate
  // that role and read as a second, conflicting heading (see screenshot
  // in the originating discussion – "CAUTION" followed immediately by
  // "OPTIONAL TITLE").
  // A shorthand admonition (`NOTE: …`, no delimiters) has a "simple"
  // content model – its content is the paragraph's raw substituted text,
  // not pre-wrapped in a <p>. Delimited admonition blocks (`[NOTE]` +
  // `====`) are "compound" and their content is already fully-formed
  // HTML – same distinction as aside.js.
  html += node.content_model === 'simple' ? `<p>${node.getContent()}</p>` : node.getContent()
  html += '</div>'

  return html
}
