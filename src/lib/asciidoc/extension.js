'use strict'

const { installTemplates } = require('./converter')

/**
 * Antora AsciiDoc extension that installs the custom block-level HTML templates.
 *
 * Antora loads each entry in the playbook's `asciidoc.extensions` and calls
 * the exported `register` function once per converted file, before it builds the
 * document converter for that file. We use that hook to define our
 * `$convert_<type>` overrides on Antora's Html5Converter class (idempotently —
 * see ./converter.js).
 */
module.exports.register = function register (registry, context) {
  installTemplates(global.Opal)
  return registry
}
