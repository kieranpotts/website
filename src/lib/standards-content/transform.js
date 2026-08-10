'use strict'

const path = require('path').posix
const File = require('vinyl')

/**
 * Reshapes the raw `standards` content source into Antora's expected
 * `modules/ROOT/{pages,partials,images}` layout.
 *
 * The `standards` repo is not authored in Antora's shape — see
 * ./README.md for why — so this module does at build time what hand-authoring
 * would otherwise do: for each technical standard `src/<NNN>/`, its
 * `README.adoc` becomes one published page (`modules/ROOT/pages/<NNN>-<slug>.adoc`),
 * its numbered sub-files become partials the page includes, and its `_/`
 * folder becomes module images. `AGENTS.md`, `GAPS.md`, and `__TODO__/`
 * scratch material are left where they are, which excludes them from
 * publishing (their paths don't match any Antora family pattern).
 *
 * Operates on one component-version entry from Antora's `contentAggregate`
 * (see extension.js) — mutates `component.files` in place.
 */

const STANDARD_README_RX = /^(\d{3})\/README\.adoc$/
const STANDARD_ADOC_RX = /^(\d{3})\/(.+)\.adoc$/
const STANDARD_IMAGE_RX = /^(\d{3})\/(?:(.+)\/)?_\/(.+)$/
const TODO_SEGMENT_RX = /(^|\/)__TODO__(\/|$)/
const TITLE_RX = /^=\s*TS-\d+:\s*(.+?)\s*$/m
const LINK_TO_STANDARD_RX = /link:((?:\.\.?\/)+[\w./-]*?\.adoc)(?:#[^[]*)?\[([^\]]*)\]/g

function slugify (text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* One entry per standard: { num, title, slug, pageName }, keyed by NNN. Built
up-front so link-rewriting and nav/index generation can resolve any standard
number to its generated page filename, regardless of processing order. */
function buildStandardsIndex (files) {
  const index = {}
  for (const file of files) {
    const m = STANDARD_README_RX.exec(file.path)
    if (!m) continue
    const num = m[1]
    const titleMatch = TITLE_RX.exec(file.contents.toString('utf8'))
    const title = titleMatch ? titleMatch[1].trim() : `TS-${Number(num)}`
    const slug = slugify(title)
    index[num] = { num, title, slug, pageName: `${num}-${slug}.adoc` }
  }
  return index
}

/* Rewrites `link:../NNN/whatever.adoc[text]` (any number of `../` segments,
same-standard or cross-standard, with or without a `#fragment`) to
`xref:NNN-slug.adoc[text]` — landing on the target standard's page. Sub-file
precision (the fragment) is deliberately dropped: once every standard is one
merged page, faithfully replaying old fragments would mean reimplementing
Asciidoctor's section-ID algorithm, for marginal benefit over "land on the
right standard's page". */
function rewriteStandardLinks (text, fileDir, standardsIndex) {
  return text.replace(LINK_TO_STANDARD_RX, (whole, relPath, linkText) => {
    const resolved = path.normalize(path.join(fileDir, relPath))
    const m = /^(\d{3})\//.exec(resolved)
    const target = m && standardsIndex[m[1]]
    if (!target) return whole // not a cross-standard link (or unresolvable) — leave as-is
    return `xref:${target.pageName}[${linkText}]`
  })
}

/* Rewrites `include::./sub-file.adoc[...]` (only ever used, in this corpus,
by the standard's own README.adoc) to the partial resource ID it becomes. */
function rewritePageIncludes (text, num) {
  return text.replace(/include::\.\//g, `include::partial$${num}/`)
}

/* Rewrites `image::./_/foo.svg[]` / `image:_/sub/foo.svg[]` to the
family-relative resource ID `image::NNN/[sub/]foo.svg[]`. `fileDir` is the
file's own directory relative to the repo root (eg. `009` or `008/03-issue-types`);
images are always referenced relative to that same directory's `_/` folder. */
function rewriteImageRefs (text, fileDir, num) {
  const relDir = fileDir === num ? '' : fileDir.slice(num.length + 1)
  const prefix = relDir ? `${num}/${relDir}/` : `${num}/`
  return text.replace(/(image:{1,2})(?:\.\/)?_\//g, (whole, macro) => `${macro}${prefix}`)
}

/* Moves a file to `newPath`. Setting `file.path` alone is enough for
classification (`allocateSrc` reads `file.path`), but NOT enough for nested
includes to resolve correctly: Antora's include resolver looks up a bare
relative include target relative to `file.src.path` — the path captured at
*aggregation* time, before this extension ever runs — not `file.path`. Left
stale, a second-level include (eg. `008/03-issue-types/README.adoc`, itself
included from `008/README.adoc`, including further sub-files of its own)
resolves relative to the pre-relocation directory and fails to find its
target. `.src.editUrl`/`.src.fileUri` are unaffected by this — they're
already-computed strings by this point, not re-derived from `.src.path`. */
function relocate (file, newPath) {
  file.path = newPath
  Object.assign(file.src, { path: file.path, basename: file.basename, stem: file.stem, extname: file.extname })
}

/* Builds a Vinyl file for content that has no source-file equivalent (only
`nav.adoc` — everything else relocates an existing file). Every other file in
the aggregate gets its `src` populated by Antora's aggregator before this
extension ever sees it; `classifyContent` reads `file.src.extname` and
requires it to be set, so a from-scratch file needs the same treatment. */
function newFile (filePath, contents, origin) {
  const file = new File({ path: filePath, contents: Buffer.from(contents, 'utf8') })
  file.src = { path: file.path, basename: file.basename, stem: file.stem, extname: file.extname, origin }
  return file
}

function transformStandards (component) {
  const files = component.files
  const standardsIndex = buildStandardsIndex(files)
  const numsInOrder = Object.keys(standardsIndex).sort()

  let rootReadme

  for (const file of files) {
    if (file.path === 'README.adoc') {
      rootReadme = file
      continue
    }

    if (TODO_SEGMENT_RX.test(file.path)) continue // scratch research material — not published

    const imageMatch = STANDARD_IMAGE_RX.exec(file.path)
    if (imageMatch) {
      const [, num, subdir, rest] = imageMatch
      relocate(file, subdir ? `modules/ROOT/images/${num}/${subdir}/${rest}` : `modules/ROOT/images/${num}/${rest}`)
      continue
    }

    const readmeMatch = STANDARD_README_RX.exec(file.path)
    if (readmeMatch) {
      const num = readmeMatch[1]
      let text = file.contents.toString('utf8')
      text = rewritePageIncludes(text, num)
      text = rewriteStandardLinks(text, num, standardsIndex)
      text = rewriteImageRefs(text, num, num)
      file.contents = Buffer.from(text, 'utf8')
      relocate(file, `modules/ROOT/pages/${standardsIndex[num].pageName}`)
      continue
    }

    const adocMatch = STANDARD_ADOC_RX.exec(file.path)
    if (adocMatch) {
      const [, num, rest] = adocMatch
      const fileDir = path.dirname(file.path)
      let text = file.contents.toString('utf8')
      text = rewriteStandardLinks(text, fileDir, standardsIndex)
      text = rewriteImageRefs(text, fileDir, num)
      file.contents = Buffer.from(text, 'utf8')
      relocate(file, `modules/ROOT/partials/${num}/${rest}.adoc`)
      continue
    }

    // Anything else under a standard's directory (AGENTS.md, GAPS.md) is left
    // untouched — its path won't match a `modules/<mod>/<family>` pattern, so
    // Antora's classifier drops it from the publishable set.
  }

  if (rootReadme) {
    let text = rootReadme.contents.toString('utf8')
    const indexHeading = text.indexOf('== Index')
    if (indexHeading !== -1) {
      const before = text.slice(0, indexHeading + '== Index'.length)
      const indexList = numsInOrder
        .map((num) => {
          const { pageName, num: tsNum, title } = standardsIndex[num]
          return `* xref:${pageName}[TS-${Number(tsNum)} *${title}*]`
        })
        .join('\n')
      text = `${before}\n\n${indexList}\n`
    }
    rootReadme.contents = Buffer.from(text, 'utf8')
    relocate(rootReadme, 'modules/ROOT/pages/index.adoc')
  }

  const navLines = ['* xref:index.adoc[Technical Standards]']
  for (const num of numsInOrder) {
    const { pageName, num: tsNum, title } = standardsIndex[num]
    navLines.push(`** xref:${pageName}[TS-${Number(tsNum)}: ${title}]`)
  }
  const origin = component.origins && component.origins[0]
  files.push(newFile('modules/ROOT/nav.adoc', navLines.join('\n') + '\n', origin))
}

module.exports = { transformStandards, buildStandardsIndex, slugify, rewriteStandardLinks, rewritePageIncludes, rewriteImageRefs }
