# Feed generation

Generates the site's web feeds — `/feeds/rss.xml` (RSS 2.0), `/feeds/atom.xml`
(Atom 1.0), and `/feeds/feed.json` (JSON Feed 1.1) — from the aggregated blog
content at build time.

## 🗂️ Layout

- `extension.js` \
  The Antora extension entry point. Registered under the playbooks'
  `antora.extensions` (see below). On the `beforePublish` lifecycle event
  it collects the posts, renders the three feeds, and adds them to the site
  catalog so they publish under `/feeds/`.

- `posts.js` \
  Selects the blog posts from the content catalog and extracts each one's
  title, description, URL, author, and date.

- `render.js` \
  Renders the post list into the RSS, Atom, and JSON documents (with XML
  escaping and the correct RFC-822 / ISO-8601 date formats).

## 🔌 How it's wired

Registered as a site-level extension in both playbooks:

```yaml
antora:
  extensions:
  - ./src/lib/feeds/extension.js
```

Note this is `antora.extensions`, not `asciidoc.extensions`. The latter is for
Asciidoctor extensions, like the block converters. The two extension systems
are distinct. Asciidoctor extensions affect how a single document converts to
HTML. Antora extensions listen for whole-build lifecycle events.

The extension runs on `beforePublish`, the point at which every page has been
converted (so each page file carries its parsed `asciidoc` metadata and
computed `pub.url`) and the site catalog is still open for new files. It
mirrors how Antora's own redirect and sitemap producers add generated files
to the site.

## 📰 Post selection and metadata

Posts are the pages in the `thoughts` component that have a date. The
date is the non-obvious part:

- The posts use an author line like `Kieran Potts, 28 December 2025`.
  Asciidoctor parses that whole line as a single _author_ whose name contains
  the date — there is no separate revision line — so the date is not in
  `revdate` or `docdate` (`docdate` is just the build date, anyway).
  `posts.js` therefore parses the `D Month YYYY` date out of the `author`
  attribute string, and takes the author name as the text before the
  first comma.

- Pages without such a date (eg. `index.adoc`, whose author is just
  `Kieran Potts`, and `404.adoc`, which has no author) are not posts and
  are excluded automatically — no per-post opt-in/opt-out attribute is needed.

- Author lines with a trailing clause
  (eg. `Kieran Potts, 9 September 2017, republished from Medium.com`)
  are handled — the date is matched anywhere in the string.

Posts are sorted newest-first and capped at the 20 most recent
(`FEED_LIMIT` in `extension.js`).

URLs are absolute, built from the playbook's `site.url` plus the page's
canonical `pub.url` (`https://kieranpotts.com/thoughts/<slug>.html`). On
dev preview builds `site.url` differs (e.g. `http://localhost:8080`), which
only affects local feed correctness.

## 🎨 Presentation

The feed _documents_ are generated here; the `.xsl` stylesheets that render
them as a readable HTML page in the browser remain static files under
[../../static/feeds/](../../static/feeds/) (`rss.xsl`, `atom.xsl`), referenced
from each feed's `<?xml-stylesheet?>` instruction. The channel/feed envelope
(title, description, author, language) is fixed site metadata in `extension.js`
(`FEED_META`); only the item lists are derived from content.

## ✅ Verifying

```sh
npm run build
```

Then inspect the generated feeds at `public/feeds/rss.xml`,
`public/feeds/atom.xml`, and `public/feeds/feed.json`.
