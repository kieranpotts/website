/**
 * Custom rendering of open blocks – a generic grouping construct (`--`)
 * with no chrome of its own. Used, for example, to wrap a verse block
 * with `[%unbreakable]` so it doesn't split across a page break in print.
 *
 * Emitted bare (just the nested content, unwrapped) unless the block
 * carries an id or role, in which case a `<div>` carries those through so
 * they remain addressable/stylable.
 */
module.exports = ({ node }) => {
  const id = node.getId()
  const role = node.getRole()
  const hasRole = typeof role === 'string' && role

  if (!id && !hasRole) return node.getContent()

  const attrs = [id ? ` id="${id}"` : '', hasRole ? ` class="${role}"` : ''].join('')

  return `<div${attrs}>${node.getContent()}</div>`
}
