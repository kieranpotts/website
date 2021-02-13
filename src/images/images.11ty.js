/**
 * Image minification.
 *
 * Rather than use `config.addPassthroughCopy('src/images')` to
 * straight copy images from `src` to `dist`, we use this custom
 * template script to run an optimisation pipeline over all our
 * source images, on every build.
 */

const dest = './dist/images'

const fsp = require('fs').promises
const imagemin = require('imagemin')
const plugins = [
  require('imagemin-mozjpeg')(),                 // JPEG processor
  require('imagemin-pngquant')({ strip: true }), // PNG processor
  require('imagemin-svgo')()                     // SVG processor
]

module.exports = class {

  data() {
    return {
      permalink: false,
      eleventyExcludeFromCollections: true
    }

  }

  async render() {

    // Always copy all images, even if the destination directory
    // already exists.

    // try {
    //   let dir = await fsp.stat(dest);
    //   if (dir.isDirectory()) return true;
    // }
    // catch(e){}

    console.log('optimizing images')
    await imagemin(['src/images/*', '!src/images/*.js'], {
      destination: dest,
      plugins
    })

    return true

  }
}
