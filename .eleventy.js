/**
 * Configuration for the Eleventy static site generator.
 *
 * @param {*} config
 */

const fs = require('fs')

const env = process.env.ELEVENTY_ENV ?? 'production'
const now = new Date()

/**
 *
 * @param {*} config
 */
module.exports = (config) => {

  /* --- VERBATIM COPY --- */

  // Copy over Nelify's redirects config file as-is.
  config.addPassthroughCopy('src/_redirects');

  // Copy over these standard root-level files as-is.
  eleventyConfig.addPassthroughCopy('src/favicon.ico')
  eleventyConfig.addPassthroughCopy('src/robots.txt')
  eleventyConfig.addPassthroughCopy('src/site.webmanifest')

  /* --- TEMPLATE ALIASES --- */

  // Aliases help to make templates a bit more portable.
  config.addLayoutAlias('base', 'templates/base.njk')
  config.addLayoutAlias('page', 'templates/page.njk')
  config.addLayoutAlias('post', 'templates/post.njk')

  /* --- PLUGINS --- */

  // Main navigation
  config.addPlugin( require('@11ty/eleventy-navigation') )
  config.addPlugin( require('@11ty/eleventy-plugin-syntaxhighlight') )

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
      .filter((p) => env === 'development' || (!p.data.draft && p.date <= now))
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
