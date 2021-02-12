// As with CSS, we're using this `11ty.js` template as a means
// of processing JavaScript. `11ty.js` template are automatically
// processed by Eleventy.

// JavaScript processing with Rollup. Performs tree-shaking
// (removing unused functions) and the terser plugin minifies
// the output.
// Generates a source map in development environments only.

const dev = (process.env.ELEVENTY_ENV === 'development')

const
  jsMain = 'js/main.js',

  rollup = require('rollup'),
  terser = require('rollup-plugin-terser').terser,

  inputOpts = {
    input: './src/' + jsMain
  },

  outputOpts = {

    // We're building ES6 modules rather than transpiling to
    // ES5. The output is small, but browser compatibility will
    // be limited. That's okay because we're applying JS as a
    // progressive enhancement. Use `type="module"` on the
    // importing `<script>` tag.
    format: 'es',

    sourcemap: dev,
    plugins: [
      terser({
        mangle: {
          toplevel: true
        },
        compress: {
          drop_console: !dev,
          drop_debugger: !dev
        },
        output: {
          quote_style: 1
        }
      })
    ]
  }
  ;


module.exports = class {

  data() {

    return {
      permalink: jsMain,
      eleventyExcludeFromCollections: true
    };

  }

  // Rollup processing
  async render() {

    const
      bundle = await rollup.rollup(inputOpts),
      { output } = await bundle.generate(outputOpts),
      out = output.length && output[0];

    let code = '';
    if (out) {

      // JS code
      code = out.code;

      // inline source map
      if (out.map) {
        let b64 = new Buffer.from(out.map.toString());
        code += '//# sourceMappingURL=data:application/json;base64,' + b64.toString('base64');
      }

    }

    return code;

  }
};
