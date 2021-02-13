/**
 * Configuration that is shared between all builder tools: Eleventy, Webpack,
 * Tailwind...
 */

module.exports = {
  fs: {

    // ⬇ Eleventy uses these

    input: 'src',
    output: 'dist',
    layouts: '_templates',
    includes: '_templates',
    // data: 'data',

    // ⬇ These are custom and used by various utilities etc.

    // assets: 'assets',
    // styles: 'assets/styles',
    // media: 'media',

  }
}
