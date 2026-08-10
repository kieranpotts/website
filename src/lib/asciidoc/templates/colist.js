/**
 * Custom rendering of callout lists (the numbered list following a code
 * block that explains its `<N>` callout markers). Emits a bare `<ol>` –
 * no `.colist`/table wrapper. Numbering matches the `.conum` badges
 * inline in the code above via source order, not explicit markers.
 */
module.exports = ({ node }) => {
  const parts = []

  parts.push('<ol class="colist">')
  node.getItems().forEach((li) => {
    parts.push(`<li>${li.getText()}${li.getContent()}</li>`)
  })
  parts.push('</ol>')

  return parts.join('')
}
