/**
 * Renders preamble content verbatim.
 *
 * NOTE: This converter does not support the placement of TOCs after the
 * preamble, ie. you cannot use this attribute:
 *
 *   :toc: preamble
 */
module.exports = ({ node }) => node.getContent()
