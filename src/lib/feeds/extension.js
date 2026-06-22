'use strict'

const File = require('vinyl')
const { collectPosts } = require('./posts')
const { renderRss, renderAtom, renderJson } = require('./render')

/**
 * Antora extension that generates the site's web feeds (RSS, Atom, JSON Feed)
 * from the aggregated blog content, replacing the previously hand-maintained
 * static feed files.
 *
 * Registered under the playbook's `antora.extensions` (NOT `asciidoc.extensions`
 * — that key is for Asciidoctor extensions like src/lib/asciidoc/). Antora calls
 * the exported `register` with the generator context; we subscribe to the
 * `beforePublish` lifecycle event, at which point every page has been converted
 * (so `file.asciidoc` metadata and `file.pub.url` are available) and the
 * siteCatalog is still open for new files.
 *
 * The post list is derived from the `thoughts` component pages — see ./posts.js
 * for selection and date parsing. The feeds are added to the siteCatalog so they
 * publish to /feeds/rss.xml, /feeds/atom.xml, and /feeds/feed.json alongside the
 * themed .xsl stylesheets (which remain static, as the browser presentation
 * layer).
 */

/* Fixed site/channel metadata (mirrors the former hand-maintained feeds). */
const FEED_META = {
  title: 'Kieran Potts',
  description:
    'Kieran Potts is a software developer and former technology journalist. ' +
    'His blog is a commentary on methods and tools for developing and ' +
    'maintaining software systems.',
  language: 'en-US',
  authorName: 'Kieran Potts',
  authorEmail: 'code@kieranpotts.com',
}

/* Most-recent N posts to include in each feed. */
const FEED_LIMIT = 20

module.exports.register = function register (context) {
  context.on('beforePublish', ({ playbook, contentCatalog, siteCatalog }) => {
    const siteUrl = (playbook.site && playbook.site.url) || ''
    const meta = Object.assign({ siteUrl: siteUrl.replace(/\/+$/, '') }, FEED_META)

    const posts = collectPosts(contentCatalog, siteUrl, FEED_LIMIT)

    const outputs = [
      ['feeds/rss.xml', renderRss(posts, meta)],
      ['feeds/atom.xml', renderAtom(posts, meta)],
      ['feeds/feed.json', renderJson(posts, meta)],
    ]

    siteCatalog.addFiles(
      outputs.map(([path, contents]) => new File({ contents: Buffer.from(contents), out: { path } }))
    )

    context.getLogger('feeds').info(`generated ${posts.length} feed item(s)`)
  })
}
