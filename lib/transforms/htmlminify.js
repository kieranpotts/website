/**
 * Verify that an `.html` file is being processed and, if so,
 * return a minified version.
 */

const htmlmin = require('html-minifier')

module.exports = (content, outputPath = '.html') => {

  if (!String(outputPath).endsWith('.html')) {
    return content
  }

  return htmlmin.minify(content, {
    useShortDoctype: true,
    removeComments: true,
    collapseWhitespace: true
  })

}
