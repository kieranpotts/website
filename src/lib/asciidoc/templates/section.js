/**
 * Custom rendering of semantic sections.
 */
module.exports = ({ node }) => {
  const level = node.getLevel() + 1
  const id = node.getId()

  let html = ''

  html += `<h${level} id="${id}">${node.getTitle()}</h${level}>`
  html += node.getContent()

  return html
}
