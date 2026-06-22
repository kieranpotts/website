'use strict'

/**
 * Extracts the list of blog posts (for the feeds) from the aggregated content.
 *
 * Each post is an AsciiDoc page in the `thoughts` component. Its feed metadata
 * comes from the parsed document model Antora attaches to every page file as
 * `file.asciidoc` ({ doctitle, attributes }) plus the computed `file.pub.url`.
 *
 * IMPORTANT — where the date lives. The posts use an author line like:
 *
 *   = The Mythical Man-Month at 50
 *   Kieran Potts, 28 December 2025
 *
 * Asciidoctor treats that whole line as a single *author* whose name happens to
 * contain the date (there is no separate revision line), so the date is NOT in
 * `revdate`/`docdate` — `docdate` is just the build date. We therefore parse the
 * date out of the `author` attribute string. The part before the first comma is
 * the author name; a `D Month YYYY` date is pulled from the remainder. Pages
 * without such a date (eg. 404.adoc, index.adoc) are not posts and are dropped.
 */

const MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
}

/* Matches a `D Month YYYY` (or `DD Month YYYY`) date anywhere in the string,
eg. in "Kieran Potts, 9 September 2017, republished from Medium.com". */
const DATE_RX = /\b(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\b/

/* Parse the post date from the author attribute. Returns a Date (UTC midnight)
or null if no recognisable date is present. */
function parsePostDate (author) {
  if (!author) return null
  const m = DATE_RX.exec(author)
  if (!m) return null
  const day = Number(m[1])
  const month = MONTHS[m[2].toLowerCase()]
  const year = Number(m[3])
  if (month === undefined) return null
  return new Date(Date.UTC(year, month, day))
}

/* The author name is the text before the first comma ("Kieran Potts, 28 …" →
"Kieran Potts"). Falls back to the whole string if there is no comma. */
function parseAuthorName (author) {
  if (!author) return undefined
  const comma = author.indexOf(',')
  return (comma === -1 ? author : author.slice(0, comma)).trim()
}

/**
 * Build the ordered list of posts for the feeds.
 *
 * @param {*} contentCatalog - the Antora content catalog (from a lifecycle event)
 * @param {*} siteUrl        - playbook site.url, used to build absolute URLs
 * @param {*} limit          - max number of (most-recent) posts to include
 *
 * @returns Array<{ url, title, description, author, date }>, newest first
 */
function collectPosts (contentCatalog, siteUrl, limit) {
  const base = (siteUrl || '').replace(/\/+$/, '')
  const pages = contentCatalog.findBy({ component: 'thoughts', family: 'page' })

  const posts = []
  for (const file of pages) {
    const meta = file.asciidoc || {}
    const attrs = meta.attributes || {}
    const date = parsePostDate(attrs.author)
    if (!date) continue /* not a dated post (404, index, etc.) */
    if (!file.pub || !file.pub.url) continue

    posts.push({
      url: base + file.pub.url,
      title: meta.doctitle || '',
      description: attrs.description || '',
      author: parseAuthorName(attrs.author),
      date,
    })
  }

  posts.sort((a, b) => b.date - a.date)
  return typeof limit === 'number' ? posts.slice(0, limit) : posts
}

module.exports = { collectPosts, parsePostDate, parseAuthorName }
