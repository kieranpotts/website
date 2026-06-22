'use strict'

/**
 * Build pipeline for the in-repo Antora UI theme (src/ui/).
 *
 *   gulp bundle   -> processes src/ui/ and writes the unzipped UI into src/ui/dist/
 *   gulp preview  -> builds a sample site (src/ui/preview/) into www/
 *   gulp lint     -> lints the stylesheets
 *
 * The output layout under src/ui/dist/ mirrors what Antora expects at the root
 * of a UI bundle: css/, font/, helpers/, img/, js/, layouts/, partials/, ui.yml.
 * The site playbooks (site-dev.yml, site-ci.yml) consume that directory directly
 * via `ui.bundle.url: ./src/ui/dist` — there is no zip step.
 */

const { src, dest, series, parallel } = require('gulp')
const autoprefixer = require('autoprefixer')
const concat = require('gulp-concat')
const fs = require('fs-extra')
const postcss = require('gulp-postcss')
const postcssImport = require('postcss-import')
const terser = require('gulp-terser')

const SRC = 'src/ui'
const DIST = 'src/ui/dist'

/* Files copied into the bundle verbatim (no transformation). */
const STATIC_GLOBS = [
  `${SRC}/{layouts,partials,helpers}/**/*.hbs`,
  `${SRC}/helpers/**/*.js`,
  `${SRC}/font/**/*`,
  `${SRC}/img/**/*`,
  `${SRC}/ui.yml`,
]

function clean () {
  return fs.remove(DIST)
}

/* Inline @import, then autoprefix. Output a single site.css at css/. */
function css () {
  return src(`${SRC}/css/site.css`)
    .pipe(postcss([postcssImport(), autoprefixer()]))
    .pipe(dest(`${DIST}/css`))
}

/* Concatenate and minify any theme scripts into js/site.js. Vendor scripts (if
any) are copied through untouched. */
function js () {
  return src([`${SRC}/js/+([0-9])-*.js`, `${SRC}/js/*.js`], { allowEmpty: true })
    .pipe(terser())
    .pipe(concat('site.js'))
    .pipe(dest(`${DIST}/js`))
}

function vendorJs () {
  return src(`${SRC}/js/vendor/**/*.js`, { allowEmpty: true })
    .pipe(dest(`${DIST}/js/vendor`))
}

function statics () {
  return src(STATIC_GLOBS, { base: SRC, encoding: false, allowEmpty: true })
    .pipe(dest(DIST))
}

const bundle = series(clean, parallel(css, js, vendorJs, statics))

/*
Antora's content aggregator reads content from a Git source. It uses
isomorphic-git (https://isomorphic-git.org/), a pure-JavaScript Git
implementation, to open the repository. Unfortunately, isomorphic-git has a
limitation. It cannot open a Git worktree, because a worktree's `.git` path
is a pointer file rather than a real `.git` directory – and isomorphic-git
only recognizes the latter.

This repository is checked out as a Git worktree, so the standalone theme
preview cannot read its content source (src/ui/preview/) directly. The
workaround is to snapshot the preview content into a throwaway plain Git repo:
before each preview build we copy src/ui/preview/ into tmp/ and commit it. That
tmp/ repo is the content source in preview-ui.yml.

In summary: we snapshot the preview content into a throwaway Git repository,
and that's the content source for the preview playbook. It's a bit messy, but
it works reliably.
*/

const PREVIEW_SRC = `${SRC}/preview`

async function previewSrc () {
  const { execFileSync } = require('child_process')
  const dir = 'tmp'
  const git = (...args) => execFileSync('git', ['-C', dir, ...args], { stdio: 'ignore' })

  await fs.ensureDir(dir)
  if (!(await fs.pathExists(`${dir}/.git`))) {
    git('init', '-q')
    git('config', 'user.email', 'preview@localhost')
    git('config', 'user.name', 'preview')
    git('config', 'commit.gpgsign', 'false')
  }
  for (const entry of await fs.readdir(dir)) {
    if (entry !== '.git') await fs.remove(`${dir}/${entry}`)
  }
  await fs.copy(PREVIEW_SRC, dir)

  /* Use `--allow-empty` so an unchanged snapshot still produces a commit. */
  git('add', '-A')
  git('commit', '-q', '--allow-empty', '-m', 'snapshot')
}

/*
Standalone preview: build the sample site against the freshly built theme so the
UI can be iterated without a full site build. Reads content from the tmp/
snapshot (see previewSrc).
*/
async function preview () {
  const generateSite = require('@antora/site-generator')
  await generateSite(['--playbook', 'preview-ui.yml', '--stacktrace'], process.env)
}

function lint () {
  const gulpStylelint = require('gulp-stylelint-esm').default
  return src(`${SRC}/css/**/*.css`).pipe(
    gulpStylelint({ reporters: [{ formatter: 'string', console: true }] })
  )
}

exports.clean = clean
exports.css = css
exports.js = series(js, vendorJs)
exports.bundle = bundle
exports.preview = series(bundle, previewSrc, preview)
exports.lint = lint
exports.default = bundle
