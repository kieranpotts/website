/**
 * This transformation verifies that a `.css` file is being
 * passed and, if so, transforms it using PostCSS plugins,
 * minifies, and adds source map when the build is run in
 * `development` mode.
 */

const env = process.env.ELEVENTY_ENV ?? 'production'

const postcss = require('postcss')
const postcssPlugins = [
  require('postcss-advanced-variables'),
  require('postcss-nested'),
  require('cssnano')
]
const postcssOptions = {
  from: 'src/scss/entry.scss',
  syntax: require('postcss-scss'),
  map: env === 'development' ? { inline: true } : false
}

module.exports = async (content, outputPath) => {

  if (!String(outputPath).endsWith('.css')) {
    return content
  }

  return (
    await postcss(postcssPlugins).process(content, postcssOptions)
  ).css

}
