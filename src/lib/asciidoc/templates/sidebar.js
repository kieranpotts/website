/**
 * Custom rendering of AsciiDoc sidebars.
 */
module.exports = ({ node }) => {
  const id = node.getId()
  const title = node.getTitle()

  let html = ''

  html += `<aside${id ? ` id="${id}"` : ''}>`
  if (title) html += `<div class="title">${title}</div>`
  html += node.getContent()
  html += '</aside>'

  return html
}
