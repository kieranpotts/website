/**
 * Configuration for the Eleventy static site generator.
 *
 * @param {*} config
 */

const fs = require('fs')

const dev = (process.env.ELEVENTY_ENV === 'development')
const now = new Date()

/**
 *
 * @param {*} config
 */
module.exports = (config) => {

  /* --- PLUGINS --- */

  // Main navigation
  config.addPlugin( require('@11ty/eleventy-navigation') )

  /* --- TRANSFORMS --- */

  // Inline assets.
  config.addTransform('inline', require('./lib/transforms/inline'))

  // Minify HTML.
  config.addTransform('htmlminify', require('./lib/transforms/htmlminify'))

  // CSS processing.
  config.addTransform('postcss', require('./lib/transforms/postcss'));

  /* --- FILTERS --- */

  // Date formatting
  const dateformat = require('./lib/filters/dateformat')
  config.addFilter('datefriendly', dateformat.friendly)
  config.addFilter('dateymd', dateformat.ymd)

  // Reading time
  config.addFilter('readtime', require('./lib/filters/readtime'))

  /* --- SHORTCODES --- */

  // Customises the main navigation
  config.addShortcode('navlist', require('./lib/shortcodes/navlist.js'))

  /* --- COLLECTIONS --- */

  // Blogpost collection (in src/blog).
  // Don't publish posts until non-draft and publication date has passed.
  config.addCollection('blogposts', (collection) => {
    return collection
      .getFilteredByGlob('./src/blog/*.md')
      .filter((p) => dev || (!p.data.draft && p.date <= now))
  })

  /* --- WATCH TARGETS --- */

  config.addWatchTarget('./src/scss/')
  config.addWatchTarget('./src/js/')

  /* --- BROWSERSYNC CONFIG --- */

  // When using `eleventy --serve`, we need to configure BrowserSync
  // to do 404 routing.

  config.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware("*", (req, res) => {
          const content = fs.readFileSync('dist/404.html')

          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" })

          // Provides the 404 content without redirect.
          res.write(content)
          res.end()
        })

      }
    }
  })

  /* --- CONFIGURATION --- */

  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  }

}
