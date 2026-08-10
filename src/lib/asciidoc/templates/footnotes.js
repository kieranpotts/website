/**
 * Custom rendering of the endnote list at the foot of the page – the
 * definitions the inline `footnote:[...]` markers point to (see
 * ./inline-footnote.js). Emits a bare `<ol id="footnotes">`, numbered by
 * the list itself rather than a repeated "N." prefix in each item, with
 * a `↩` back-link returning to the inline reference – no `#footnotes`/
 * `.footnote` div-per-item wrapper.
 *
 * Unlike every other template here, this isn't dispatched by node name –
 * there's no discrete "footnotes" block in the content tree to hook.
 * Asciidoctor's stock converter appends this list itself while rendering
 * the whole page body. See ../converter.js, which wraps that whole-page
 * method and splices this in over the tail of its output.
 */
module.exports = ({ node }) => {
  const attr = node.attributes["$$smap"]
  if (!node.hasFootnotes() || attr["nofootnotes"]) return ""

  let html = ""

  html += '<hr class="footnotes">'
  html += '<ol id="footnotes">'
  node.getFootnotes().forEach((footnote) => {
    const index = footnote.getIndex()
    html += `<li id="_footnotedef_${index}">${footnote.getText()} <a href="#_footnoteref_${index}" title="Back to content">↩</a></li>`
  })
  html += "</ol>"

  return html
}
