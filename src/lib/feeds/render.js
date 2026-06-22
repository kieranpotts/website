'use strict'

/**
 * Renders the post list into RSS 2.0, Atom 1.0, and JSON Feed 1.1 documents.
 *
 * The channel/feed envelope (titles, description, self links, author, language)
 * mirrors the previously hand-maintained feeds so subscribers see no change
 * other than fresh, complete item lists. Only the item lists are derived from
 * the content; everything else is fixed site metadata passed in via `meta`.
 */
const XML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }

function xml (value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => XML_ESCAPES[c])
}

/* RFC-822 / RFC-1123 date, e.g. "Sat, 28 Dec 2025 00:00:00 +0000" (RSS pubDate). */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function rfc822 (date) {
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${DAYS[date.getUTCDay()]}, ${d} ${MONS[date.getUTCMonth()]} ${date.getUTCFullYear()} 00:00:00 +0000`
}

/* ISO-8601 UTC, e.g. "2025-12-28T00:00:00Z" (Atom updated, JSON date_published). */
function iso8601 (date) {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z')
}

function renderRss (posts, meta) {
  const items = posts.map((p) => `    <item>
      <title>${xml(p.title)}</title>
      <link>${xml(p.url)}</link>
      <pubDate>${rfc822(p.date)}</pubDate>
      <dc:creator>${xml(p.author || meta.authorName)}</dc:creator>
      <guid>${xml(p.url)}</guid>
      <description>${xml(p.description)}</description>
    </item>`).join('\n')

  return `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="/feeds/rss.xsl" type="text/xsl"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xml:base="${xml(meta.siteUrl)}/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(meta.title)}</title>
    <link>${xml(meta.siteUrl)}/</link>
    <atom:link href="${xml(meta.siteUrl)}/feeds/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xml(meta.description)}</description>
    <language>${xml(meta.language)}</language>

${items}
  </channel>
</rss>
`
}

function renderAtom (posts, meta) {
  const updated = posts.length ? iso8601(posts[0].date) : iso8601(new Date())
  const entries = posts.map((p) => `  <entry>
    <title>${xml(p.title)}</title>
    <link href="${xml(p.url)}"/>
    <id>${xml(p.url)}</id>
    <updated>${iso8601(p.date)}</updated>
    <summary>${xml(p.description)}</summary>
  </entry>`).join('\n')

  return `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="/feeds/atom.xsl" type="text/xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${xml(meta.title)}</title>
  <subtitle>${xml(meta.description)}</subtitle>
  <link href="${xml(meta.siteUrl)}/feeds/atom.xml" rel="self"/>
  <link href="${xml(meta.siteUrl)}/"/>
  <updated>${updated}</updated>
  <id>${xml(meta.siteUrl)}/</id>
  <author>
    <name>${xml(meta.authorName)}</name>
    <email>${xml(meta.authorEmail)}</email>
  </author>

${entries}
</feed>
`
}

function renderJson (posts, meta) {
  const doc = {
    version: 'https://jsonfeed.org/version/1.1',
    title: meta.title,
    language: meta.language,
    home_page_url: `${meta.siteUrl}/`,
    feed_url: `${meta.siteUrl}/feeds/feed.json`,
    description: meta.description,
    author: { name: meta.authorName, url: `${meta.siteUrl}/` },
    items: posts.map((p) => ({
      id: p.url,
      url: p.url,
      title: p.title,
      content_text: p.description,
      date_published: iso8601(p.date),
    })),
  }
  return JSON.stringify(doc, null, 2) + '\n'
}

module.exports = { renderRss, renderAtom, renderJson, rfc822, iso8601 }
