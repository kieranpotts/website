/**
 * Custom rendering of ordered lists.
 */
module.exports = ({ node }) => {
  const parts = []

  parts.push('<ol>')
  node.getItems().forEach((li) => {
    parts.push(`<li>${li.getText()}</li>`)
  })
  parts.push('</ol>')

  return `${parts.join('')}`
}
