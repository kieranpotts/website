/**
 * Configuration that is shared between all builder tools: Eleventy, Webpack,
 * Tailwind...
 */

module.exports = {
  fs: {

    input: 'src',
    output: 'dist',
    layouts: '_templates',
    includes: '_templates'

  }
}
