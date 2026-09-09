/**
 * Custom rendering of plain paragraphs. Emitted bare (just the `<p>`, no
 * wrapper) unless the block carries an id or role – eg. `[.lead]` or
 * `[.text-center]` – in which case a `<div class="paragraph …">` wrapper
 * carries those through, matching the shape Asciidoctor's stock converter
 * uses, so role-scoped rules (see asciidoc.css) have something to match.
 */
module.exports = ({ node }) => {
  const id = node.getId()
  const role = node.getRole()
  const hasRole = typeof role === 'string' && role
  const p = `<p>${node.getContent()}</p>`

  if (!id && !hasRole) return p

  const idAttr = id ? ` id="${id}"` : ''
  const classAttr = ` class="paragraph${hasRole ? ` ${role}` : ''}"`

  return `<div${idAttr}${classAttr}>${p}</div>`
}
