/**
 * Custom rendering of AsciiDoc sidebars.
 */
module.exports = ({ node }) => {
  const level = 2
  const id = node.getId()

  let html = ''

  html += '<hr />'
  html += '<aside>'
  html += `<h${level} id="${id}">${node.getTitle()}</h${level}>`
  html += node.getContent()
  html += '</aside>'

  return html
}
