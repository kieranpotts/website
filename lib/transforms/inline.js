/**
 * Inline some assets such as SVGs.
 *
 * `<img>`, `<link>` and `<script>` tags that have the `inline`
 * attribute will have their referenced assets inlined automagically.
 */

const { inlineSource } = require('inline-source')

module.exports = async (content, outputPath) => {

  if (!String(outputPath).endsWith('.html')) {
    return content
  }

  return await inlineSource(content, {
    compress: true,
    rootpath: './dist/'
  })

}
