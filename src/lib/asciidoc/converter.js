'use strict'

const templates = require('./templates')
const footnotesTemplate = require('./templates/footnotes')

/**
 * Install our custom HTML templates onto AsciiDoctor's base `Html5Converter`
 * class, which Antora subclasses.
 *
 * We use the base class (not Antora's subclass) deliberately: the subclass is
 * created lazily by Antora and is not reliably present when our extension's
 * register hook first runs, whereas the base class always exists. Reaching into
 * Antora's package internals to force it is blocked by its `exports` map.
 */

const IMG_TAG = /<img\b[^>]*>/i

/* Matches the stock `<div id="footnotes">…</div>` endnote list Asciidoctor
appends to the tail of the page body, if present – see installFootnotesTemplate. */
const FOOTNOTES_DIV = /\n?<div id="footnotes">[\s\S]*$/

function installTemplates (Opal) {
  const html5 = Opal.Asciidoctor.Html5Converter
  if (!html5) {
    throw new Error('Asciidoctor Html5Converter not found; cannot install block templates')
  }

  /* Register runs per file. Install only once. */
  if (html5.$$antora_block_templates_installed) return
  html5.$$antora_block_templates_installed = true

  Object.keys(templates).forEach((nodeName) => {
    const template = templates[nodeName]

    if (nodeName === 'image') {
      /* Preserve the stock base implementation so we can produce the resolved
      <img> and reuse it inside the <figure> wrapping. */
      const baseConvertImage = html5.$$prototype['$convert_image']
      Opal.defn(html5, '$convert_image', function (node) {
        const resolved = baseConvertImage.call(this, node)
        const match = IMG_TAG.exec(resolved)
        const img = match ? match[0] : resolved
        return template({ node, img })
      })
      return
    }

    Opal.defn(html5, `$convert_${nodeName}`, function (node) {
      return template({ node })
    })
  })

  installFootnotesTemplate(Opal, html5)
}

/**
 * The endnote list at the foot of the page (see templates/footnotes.js) isn't
 * a discrete block in the content tree – Asciidoctor's stock converter
 * appends it itself, inline, while rendering the whole page body via
 * `$convert_embedded` (the method Antora calls to get a page's body HTML).
 * There's no smaller method to override just for this, so we wrap the whole
 * method: call the stock implementation, then splice our own markup in over
 * the trailing footnotes div it appended (a no-op if the page has none).
 */
function installFootnotesTemplate (Opal, html5) {
  const baseConvertEmbedded = html5.$$prototype['$convert_embedded']
  Opal.defn(html5, '$convert_embedded', function (node) {
    const resolved = baseConvertEmbedded.call(this, node)
    if (!FOOTNOTES_DIV.test(resolved)) return resolved
    return resolved.replace(FOOTNOTES_DIV, footnotesTemplate({ node }))
  })
}

module.exports = { installTemplates }
