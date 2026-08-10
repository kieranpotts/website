/**
 * Custom rendering of inline footnote reference markers
 * (`footnote:[...]`, and repeat references to the same note via
 * `footnote:id[]`/`footnoteref:[id]`). See ./footnotes.js for the
 * endnote list these markers point to.
 */
module.exports = ({ node }) => {
  const index = node.getAttribute('index')
  const isRepeatRef = node.getType() === 'xref'

  if (!index) {
    /* The reference doesn't resolve to any known footnote (a typo'd id). */
    return `<sup class="footnoteref unresolved" title="Unresolved footnote reference.">[${node.getText()}]</sup>`
  }

  if (isRepeatRef) {
    return `<sup class="footnoteref"><a href="#_footnotedef_${index}" title="View footnote.">[${index}]</a></sup>`
  }

  const id = node.getId()
  return `<sup class="footnote"${id ? ` id="_footnote_${id}"` : ''}><a id="_footnoteref_${index}" href="#_footnotedef_${index}" title="View footnote.">[${index}]</a></sup>`
}
