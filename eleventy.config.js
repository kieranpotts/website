/**
 * Configuration for the Eleventy static site generator.
 *
 * @param {*} config
 */

// Import Node.js APIs.
const fs = require('fs')

// Import vendor dependencies.
const pluginNavigation = require('@11ty/eleventy-navigation')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')

// Import local dependencies: shared config.
const config = require('./shared.config.js')

// Import local dependencies: transforms.
const transformInline = require('./lib/transforms/inline')
const transformHtmlMinify = require('./lib/transforms/htmlminify')
const transformPostCss = require('./lib/transforms/postcss')

// Import local dependencies: filters.
const filterDateForm = require('./lib/filters/dateformat')
const filterReadTime = require('./lib/filters/readtime')

// Import local dependencies: shortcodes.
const shortcodeNavList = require('./lib/shortcodes/navlist.js')

// Other variable initializations.
const env = process.env.ELEVENTY_ENV ?? 'production'
const now = new Date()

/**
 *
 * @param {*} config
 */
module.exports = (eleventyConfig) => {

  /* --- VERBATIM COPY --- */

  // Copy over Nelify's redirects config file as-is.
  eleventyConfig.addPassthroughCopy('src/_redirects');

  // Copy over these standard root-level files as-is.
  eleventyConfig.addPassthroughCopy('src/favicon.ico')
  eleventyConfig.addPassthroughCopy('src/robots.txt')
  eleventyConfig.addPassthroughCopy('src/site.webmanifest')

  /* --- TEMPLATE ALIASES --- */

  // Aliases help to make templates a bit more portable.
  eleventyConfig.addLayoutAlias('base', 'pages/base.njk')
  eleventyConfig.addLayoutAlias('page', 'pages/page.njk')
  eleventyConfig.addLayoutAlias('post', 'pages/post.njk')

  /* --- PLUGINS --- */

  // Main navigation
  eleventyConfig.addPlugin( pluginNavigation )
  eleventyConfig.addPlugin( pluginSyntaxHighlight )

  /* --- TRANSFORMS --- */

  // Inline assets.
  eleventyConfig.addTransform('inline', transformInline)

  // Minify HTML.
  eleventyConfig.addTransform('htmlminify', transformHtmlMinify)

  // CSS processing.
  eleventyConfig.addTransform('postcss', transformPostCss);

  /* --- FILTERS --- */

  // Date formatting
  eleventyConfig.addFilter('datefriendly', filterDateForm.friendly)
  eleventyConfig.addFilter('dateymd', filterDateForm.ymd)

  // Reading time
  eleventyConfig.addFilter('readtime', filterReadTime)

  /* --- SHORTCODES --- */

  // Customises the main navigation
  eleventyConfig.addShortcode('navlist', shortcodeNavList)

  /* --- COLLECTIONS --- */

  // Blogpost collection (in src/blog).
  // Don't publish posts until non-draft and publication date has passed.
  eleventyConfig.addCollection('blogposts', (collection) => {
    return collection
      .getFilteredByGlob('./src/blog/*.md')
      .filter((p) => env === 'development' || (!p.data.draft && p.date <= now))
  })

  /* --- WATCH TARGETS --- */

  eleventyConfig.addWatchTarget('./src/scss/')
  eleventyConfig.addWatchTarget('./src/js/')

  /* --- BROWSERSYNC CONFIG --- */

  // When using `eleventy --serve`, we need to configure BrowserSync
  // to do 404 routing.

  eleventyConfig.setBrowserSyncConfig({
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
      input: config.fs.input,
      output: config.fs.output,
      layouts: config.fs.layouts,
      includes: config.fs.includes
    }
  }

}
