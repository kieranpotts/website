# Website — remaining work

The unified Antora site (home/about + blog + garden + bookmarks) is built and
passing `lint:ci` + `linkcheck` on `dev`. Steps 1–10 and the README are done.
What's left:

- [ ] **Push `dev`** to origin.
- [ ] **Netlify preview deploy** — connect the repo, deploy to a branch/preview
  URL (not the apex yet), and verify `_redirects` (e.g. `/blog` 301) and the
  HSTS header are honoured.
- [ ] **Production cutover** — point `kieranpotts.com` at the Netlify deploy,
  set `site.url` to the apex in `site-ci.yml`, then audit every `_redirects`
  rule against the live domain.
- [ ] **Profile project table** — bump `website` 🚧 → 🚀 in the `kieranpotts`
  profile README once live.
- [ ] **CV/résumé link** — add to the navbar (the theme's `header.hbs` in the
  website-ui repo) when the published résumé URL is known.

## Deferred (separate plans)

- **Feeds rework** — proper feed generation if the hand-maintained `/feeds/`
  files need it.

## Build gotchas worth remembering

- Content repos (blog/garden/bookmarks) are submodules → referenced by **public
  remote URL**; commits must be **pushed** before the unified build sees them.
- Antora resolves `xref:` **module-root-relative**, not page-relative.
- `linkcheck` must **serve the site first** (handled by the `linkcheck` script).
- Overlay files land under `_/` unless listed in `overlay/ui.yml` `static_files`.
