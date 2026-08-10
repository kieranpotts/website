'use strict'

/**
 * Registry of template converters.
 *
 * Each entry maps an AsciiDoctor node name, as returned by
 * `node.getNodeName()` and equivalently `node.node_name`, to a
 * function `({ node }) => htmlString`.
 *
 * These are dispatched from the custom converted in
 * `../converter.js`.
 *
 * Any node type NOT listed here falls back to Antora's
 * built-in HTML converter.
 */
module.exports = {
  paragraph: require('./paragraph'),
  ulist: require('./ulist'),
  olist: require('./olist'),
  dlist: require('./dlist'),
  colist: require('./colist'),
  section: require('./section'),
  preamble: require('./preamble'),
  image: require('./image'),
  listing: require('./listing'),
  literal: require('./literal'),
  quote: require('./quote'),
  verse: require('./verse'),
  sidebar: require('./aside'),
  example: require('./aside'),
  open: require('./open'),
  admonition: require('./admonition'),
  table: require('./table'),
  thematic_break: require('./thematic-break'),
  pass: require('./pass'),
}
