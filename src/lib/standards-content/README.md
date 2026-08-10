# Standards content reshaping

Reshapes the `standards` content source (Kieran Potts' technical standards,
TS-1..TS-63) into Antora's `modules/ROOT/{pages,partials,images}` layout at
build time, so it can be published as the `standards` component alongside
`thoughts`, `garden`, and `bookmarks`.

## Why this exists

`thoughts`, `garden`, and `bookmarks` are authored *directly* in Antora's
shape — each is a plain remote content source with no special handling.
`standards` isn't: its content lives at `src/<NNN>/README.adoc` (+ numbered
sub-files, some nested, pulled in via `include::./NN-xxx.adoc[]`), plus a
per-standard `_/` image folder, `AGENTS.md` (a compact per-standard summary
consumed by AI agents), `GAPS.md`, and scratch research material under
`__TODO__/`.

That layout can't just be migrated to the Antora shape, because
`src/<NNN>/AGENTS.md` is a pinned external contract: roughly twenty other
repositories' `AGENTS.md` files link to it by exact path via
`https://raw.githubusercontent.com/kieranpotts/standards/refs/heads/latest/dev/src/<NNN>/AGENTS.md`.
Moving `src/<NNN>/` would break every one of them, and would also require
rewiring the `standards` repo's own AI skills (`agentify`, `deep-dive`,
`gap-analysis`, `fix-cross-references`), which operate on that same layout.

So `standards` stays almost untouched — it gained exactly one new file,
`src/antora.yml`, to make it a valid (if structurally empty) Antora
component — and this extension does the reshaping in memory, here, at
website build time.

## 🗂️ Layout

- `extension.js` \
  The Antora extension entry point. Registered under the playbooks'
  `antora.extensions`. On `contentAggregated` it finds the `standards`
  component-version entry and hands it to `transform.js`.

- `transform.js` \
  The reshaping logic. For each standard `<NNN>`:
  - `<NNN>/README.adoc` → `modules/ROOT/pages/<NNN>-<slug>.adoc` (the
    published page; its `include::./...` targets are rewritten to
    `partial$<NNN>/...` resource IDs).
  - Every other `.adoc` file under `<NNN>/` (however deeply nested, eg.
    `03-issue-types/01-bug.adoc`) → `modules/ROOT/partials/<NNN>/...`,
    same relative path. Sibling-to-sibling `include::` targets inside these
    need no rewriting — Antora resolves bare relative includes within the
    same family/directory, and the structural copy preserves that.
  - `<NNN>/_/**` (images) → `modules/ROOT/images/<NNN>/**`; `image::`/`image:`
    refs are rewritten to match.
  - `src/README.adoc` → `modules/ROOT/pages/index.adoc`; its `== Index` list
    is regenerated from the same per-standard slugs, rather than hand-rewritten,
    so it can't drift out of sync with the generated filenames.
  - `modules/ROOT/nav.adoc` is synthesized from scratch (there's no source
    equivalent): the index page plus all 63 standards in numeric order.

  Cross-references between standards (`link:../009/README.adoc[TS-9: ...]`,
  `link:./10-errors.adoc[...]`, sometimes with a `#fragment`) are common
  throughout the corpus — over a hundred of them. These are rewritten to
  `xref:<NNN>-<slug>.adoc[...]`, always pointing at the *target standard's
  page*, with any `#fragment` dropped. Preserving fragment-level precision
  would mean reimplementing Asciidoctor's section-ID algorithm for marginal
  benefit; landing on the right standard's page is judged good enough.

  Only each file's `path` (and `contents`, where rewritten) is mutated —
  `src`/origin metadata is left alone, so Antora's `edit_url` still points at
  the real source file in `standards` (eg. `src/008/README.adoc`), not a
  synthetic path.

  `AGENTS.md`, `GAPS.md`, and anything under `__TODO__/` are left where they
  are. Their paths don't match a `modules/<mod>/<family>/...` pattern, so
  Antora's classifier silently excludes them from the published site — no
  action needed.

## 🔌 How it's wired

Registered as a site-level extension in both playbooks (unlike
`content-preview`, which is CI-only, this extension is needed for every
build — without it, `standards` pages won't render at all, even locally):

```yaml
antora:
  extensions:
  - ./src/lib/standards-content/extension.js
```

Paired with a `standards` content source, positioned between `thoughts` and
`garden` to match the navmenu order:

```yaml
- url: 'https://github.com/kieranpotts/standards.git'
  branches: latest/dev
  start_path: src
  edit_url: 'https://github.com/kieranpotts/standards/edit/latest/dev/{path}'
```

`contentAggregated` fires after `aggregateContent` has collected every
source's raw files (keyed by component name from each source's `antora.yml`)
but before `classifyContent` sorts those files into pages/partials/images by
path. Mutating paths in this window is what lets a source that doesn't
natively follow Antora's directory convention still produce Antora
pages/partials/images — the same technique used by "collector"-style Antora
extensions generally.

## ✅ Verifying

```sh
npm run build
```

Then inspect `public/standards/` — all 63 pages should render, the index
page's links should resolve, images should load, and standards with nested
includes (eg. TS-8, which pulls in `03-issue-types/`) should render their
sub-sections correctly.

```sh
npm run lint
```

catches unresolved `xref:`/`include::`/`image::` targets — Antora warns on
broken resource IDs.
