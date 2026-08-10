/**
 * Custom rendering of thematic breaks (`'''` or `---`). Asciidoctor's
 * stock converter already emits a bare `<hr>` here with no wrapper to
 * strip, but the block is still listed explicitly in ./index.js (rather
 * than left to the fallback) so every block type this site uses has an
 * owned, intentional template.
 */
module.exports = () => '<hr />'
