'use strict'

const { transformStandards } = require('./transform')

/**
 * Antora extension that reshapes the `standards` content source into
 * Antora's `modules/ROOT/{pages,partials,images}` layout at build time.
 *
 * See ./README.md for why this exists instead of authoring `standards`
 * directly in that shape (as `thoughts`/`garden`/`bookmarks` are).
 *
 * Registered under the playbooks' `antora.extensions` (see README.md). Runs
 * on `contentAggregated` — the point at which every content source's raw
 * files have been collected (`contentAggregate`, one entry per component
 * version) but before Antora classifies them into pages/partials/images by
 * path. Mutating file paths here, before classification, is what lets a
 * source that doesn't natively follow Antora's directory convention still
 * produce Antora pages/partials/images.
 */
module.exports.register = function register (context) {
  context.on('contentAggregated', ({ contentAggregate }) => {
    const component = contentAggregate.find((c) => c.name === 'standards')
    if (!component) return
    transformStandards(component)
    context.getLogger('standards-content').info('reshaped standards content into Antora module layout')
  })
}
