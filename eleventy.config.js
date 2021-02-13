/**
 * Configuration for the Eleventy static site generator.
 *
 * @param {*} config
 */

// Import Node.js APIs.
const fs = require('fs')

// Import vendor dependencies.
const pluginNavigation = require('@11ty/eleventy-navigation')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')

// Import local dependencies: shared config.
const config = require('./shared.config.js')

// Import local dependencies.
const filters = require('./lib/filters')
const transforms = require('./lib/transforms')
const shortcodes = require('./lib/shortcodes')

// Other variable initializations.
const env = process.env.ELEVENTY_ENV ?? 'production'
const now = new Date()

/**
 *
 * @param {*} config
 */
module.exports = (eleventyConfig) => {

  /**
   * Passthrough file copy
   *
   * @link https://www.11ty.io/docs/copy/
   */
  eleventyConfig.addPassthroughCopy('src/_redirects')
  eleventyConfig.addPassthroughCopy('src/favicon.ico')
  eleventyConfig.addPassthroughCopy('src/robots.txt')
  eleventyConfig.addPassthroughCopy('src/site.webmanifest')

  eleventyConfig.addPassthroughCopy('src/assets/favicon')
  eleventyConfig.addPassthroughCopy('src/assets/fonts')
  eleventyConfig.addPassthroughCopy('src/assets/images')

  /* --- TEMPLATE ALIASES --- */

  // Aliases help to make templates a bit more portable.
  eleventyConfig.addLayoutAlias('base', 'pages/base.njk')
  eleventyConfig.addLayoutAlias('page', 'pages/page.njk')
  eleventyConfig.addLayoutAlias('post', 'pages/post.njk')

  /**
   * Add plugins
   *
   * @link https://www.11ty.dev/docs/plugins/
   */
  eleventyConfig.addPlugin(pluginNavigation)
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(pluginSyntaxHighlight)

  /**
   * Add filters
   *
   * @link https://www.11ty.io/docs/filters/
   */
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName])
  })

  /**
   * Add transforms
   *
   * @link https://www.11ty.io/docs/config/#transforms
   */
  Object.keys(transforms).forEach((transformName) => {
    eleventyConfig.addTransform(transformName, transforms[transformName])
  })

  /**
   * Add shortcodes
   *
   * @link https://www.11ty.io/docs/shortcodes/
   */
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
  })

  /* --- COLLECTIONS --- */

  // Blogpost collection (in src/blog).
  // Don't publish posts until non-draft and publication date has passed.
  eleventyConfig.addCollection('blogposts', (collection) => {
    return collection
      .getFilteredByGlob('./src/blog/*.md')
      .filter((p) => env === 'development' || (!p.data.draft && p.date <= now))
  })

  /**
   * Add custom watch targets
   *
   * @link https://www.11ty.dev/docs/config/#add-your-own-watch-targets
   */
  // eleventyConfig.addWatchTarget('./src/scss/')
  // eleventyConfig.addWatchTarget('./src/js/')

  /**
   * Override BrowserSync Server options
   *
   * @link https://www.11ty.dev/docs/config/#override-browsersync-server-options
   */
  eleventyConfig.setBrowserSyncConfig({
    notify: true,

    // Set calback to handle 404s in local dev environment (`eleventy --serve`).
    callbacks: {
      ready: function(err, browserSync) {

        // Grab 404 page content from built page.
        const content = fs.readFileSync('dist/404.html')

        browserSync.addMiddleware("*", (req, res) => {

          // Return 404 HTTP status code.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" })

          // Send the 404 content, without a redirect.
          res.write(content)
          res.end()

        })

      }
    }
  })

  /**
   * Eleventy configuration
   *
   * @see https://www.11ty.dev/docs/config/
   */
  return {
    dir: {

      // @see https://www.11ty.dev/docs/config/#input-directory
      input: config.fs.input,

      // @see https://www.11ty.dev/docs/config/#output-directory
      output: config.fs.output,

      // @see https://www.11ty.dev/docs/config/#directory-for-layouts-(optional)
      layouts: config.fs.layouts,

      // @see https://www.11ty.dev/docs/config/#directory-for-includes
      includes: config.fs.includes
    },

    // @see https://www.11ty.dev/docs/config/#template-formats
    templateFormats: ['njk', 'md'],

    // @see https://www.11ty.dev/docs/config/#default-template-engine-for-html-files
    htmlTemplateEngine: 'njk'
  }

}
