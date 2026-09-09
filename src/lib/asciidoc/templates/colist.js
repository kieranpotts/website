/**
 * Custom rendering of callout lists (the numbered list following a code
 * block that explains its `<N>` callout markers). Emits a bare `<ol>` –
 * no `.colist`/table wrapper. Numbering matches the `.conum` badges
 * inline in the code above via source order, not explicit markers. Any
 * role is appended alongside the `colist` class it already carries.
 */
module.exports = ({ node }) => {
  const role = node.getRole()
  const hasRole = typeof role === 'string' && role
  const parts = []

  parts.push(`<ol class="colist${hasRole ? ` ${role}` : ''}">`)
  node.getItems().forEach((li) => {
    parts.push(`<li>${li.getText()}${li.getContent()}</li>`)
  })
  parts.push('</ol>')

  return parts.join('')
}
