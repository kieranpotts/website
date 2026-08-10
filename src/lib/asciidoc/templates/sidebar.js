/**
 * Custom rendering of AsciiDoc sidebars.
 */
module.exports = ({ node }) => {
  const level = 2
  const id = node.getId()
  const title = node.getTitle()

  let html = ''

  html += '<aside>'
  if (title) html += `<h${level}${id ? ` id="${id}"` : ''}>${title}</h${level}>`
  html += node.getContent()
  html += '</aside>'

  return html
}
