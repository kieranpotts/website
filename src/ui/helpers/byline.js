'use strict'

/**
 * Renders a byline ("By <author> · <date>") from an AsciiDoc author
 * attribute, eg. "Kieran Potts, 24 May 2021". The date substring is matched
 * with the same `D Month YYYY` pattern used by the feed builder (see
 * src/lib/feeds/posts.js) so the two stay in sync. Returns an empty string
 * if no author attribute is present.
 */

const MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
}

const DATE_RX = /\b(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\b/

const ESCAPE_RX = /[&<>"']/g
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
const escapeHtml = (str) => str.replace(ESCAPE_RX, (c) => ESCAPES[c])

module.exports = (author) => {
  if (!author) return ''

  const comma = author.indexOf(',')
  const name = (comma === -1 ? author : author.slice(0, comma)).trim()

  const m = DATE_RX.exec(author)
  let dateHtml = ''
  if (m && MONTHS[m[2].toLowerCase()] !== undefined) {
    const iso = `${m[3]}-${String(MONTHS[m[2].toLowerCase()] + 1).padStart(2, '0')}-${String(Number(m[1])).padStart(2, '0')}`
    dateHtml = ` &middot; <time datetime="${iso}">${m[1]} ${m[2]} ${m[3]}</time>`
  }

  return `By ${escapeHtml(name)}${dateHtml}`
}
