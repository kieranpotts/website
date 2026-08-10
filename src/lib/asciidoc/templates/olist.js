/**
 * Custom rendering of ordered lists. An optional `.Title` line above
 * the list is rendered as a `<div class="title">` before the `<ol>`.
 *
 * `li.getContent()` renders only an item's nested blocks (sub-lists,
 * continuation paragraphs) – it's empty when an item is just text. The
 * principal text comes from `li.getText()` separately, so both must be
 * concatenated or nested content is silently dropped.
 */
module.exports = ({ node }) => {
  const parts = []

  if (node.getTitle()) parts.push(`<div class="title">${node.getTitle()}</div>`)
  parts.push('<ol>')
  node.getItems().forEach((li) => {
    parts.push(`<li>${li.getText()}${li.getContent()}</li>`)
  })
  parts.push('</ol>')

  return `${parts.join('')}`
}
