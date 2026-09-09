/**
 * Custom rendering of description lists, including the `[qanda]` style.
 *
 * Each item is a `[terms, description]` pair. `description` may be absent
 * (a term with no description at all) – guarded via the `getText` check
 * below, since Asciidoctor.js hands back an Opal nil-like object, not
 * `null`/`undefined`, in that case.
 *
 * `description.getText()` is the principal (first) line; `.getContent()`
 * renders any further nested blocks (continuation paragraphs) – both must
 * be concatenated or nested content is silently dropped, same as in
 * ulist.js/olist.js.
 *
 * A role is carried through as a class – appended alongside `qanda` when
 * both are set (eg. `[qanda.role]`).
 */
module.exports = ({ node }) => {
  const items = node.getItems()
  const isQanda = node.getStyle() === 'qanda'
  const role = node.getRole()
  const hasRole = typeof role === 'string' && role

  let html
  if (isQanda) {
    html = `<ol class="qanda${hasRole ? ` ${role}` : ''}">`
  } else {
    html = `<dl${hasRole ? ` class="${role}"` : ''}>`
  }

  items.forEach(([terms, desc]) => {
    const hasDescription = desc && typeof desc.getText === 'function'
    const text = hasDescription ? desc.getText() : ''
    const content = hasDescription ? desc.getContent() : ''

    if (isQanda) {
      html += '<li>'
      html += `<p class="question">${terms.map((term) => term.getText()).join(', ')}</p>`
      if (text) html += `<p>${text}</p>`
      html += content
      html += '</li>'
    } else {
      terms.forEach((term) => {
        html += `<dt>${term.getText()}</dt>`
      })
      html += '<dd>'
      if (text) html += `<p>${text}</p>`
      html += content
      html += '</dd>'
    }
  })

  html += isQanda ? '</ol>' : '</dl>'

  return html
}
