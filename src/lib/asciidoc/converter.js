'use strict'

const templates = require('./templates')

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
}

module.exports = { installTemplates }
