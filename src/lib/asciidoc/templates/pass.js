/**
 * Custom rendering of passthrough blocks (`++++`) – used on this site to
 * embed raw HTML, e.g. the <video> element in asciidoc.adoc. The author
 * already wrote exactly the markup they want, so this is a no-op:
 * Asciidoctor's stock converter emits the raw content unwrapped, and we
 * do the same. Listed explicitly in ./index.js anyway, rather than left
 * to the fallback, so every block type this site uses has an owned,
 * intentional template.
 */
module.exports = ({ node }) => node.getContent()
