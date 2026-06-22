/**
 * Custom rendering of unordered lists.
 */
module.exports = ({ node }) => {
  const parts = []

  parts.push('<ul>')
  node.getItems().forEach((li) => {
    parts.push(`<li>${li.getText()}</li>`)
  })
  parts.push('</ul>')

  return `${parts.join('')}`
}
