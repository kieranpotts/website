# Plan — kieranpotts.com, unified Antora site

## Goal

Build the next iteration of **kieranpotts.com** in this `website` repo: a single
static site, built with **Antora**, that aggregates the `blog`, `garden`, and
`bookmarks` content (plus a new home/about/hub) into one site, deployed to
Netlify, **preserving all existing live URLs and redirects**. The build mirrors
the proven `hacksltd/tools/workbook` Antora pattern.

## Locked decisions (from design Q&A)

- **Target repo:** this `website` repo. Trunk branch is **`dev`** (already the
  repo default; matches the workbook's build branch).
- **Engine:** Antora 3.x, mirroring the workbook (`site-local.yml` /
  `site-ci.yml` playbooks, `run/*` Docker wrapper scripts, `overlay/`, custom
  extensions, containerised dev via `Dockerfile` + `docker-compose.yml`, pinned
  Node via `.nvmrc`).
- **UI:** stock **default Antora UI** for now. A personal themed UI bundle is a
  separate future plan — explicitly out of scope here.
- **Content absorption:** `blog`, `garden`, `bookmarks` referenced as **Antora
  content sources** in the playbook. Those repos stay independent; the site
  aggregates them at build time. No physical content migration.
- **Layout:** full Antora layout — `src/modules/ROOT/...` is the content root;
  root-publish files (`_redirects`, `_headers`, `robots.txt`, `favicon`) move to
  **`overlay/`** (Antora `ui.supplemental_files`), relocated from their current
  `src/` location with contents preserved exactly.
- **Fonts:** the existing iA Writer fonts in `vendor/` are **served via the
  overlay** now (available to the publish output), even though the default UI
  doesn't yet reference them.
- **Deploy:** Netlify, `kieranpotts.com`. Live site exists → existing URLs and
  the `_redirects` rules MUST be preserved.

## Repo starting state (already present)

- `src/_redirects`, `src/_headers`, `src/favicon.ico`, `src/robots.txt`
  — the publish-root files to relocate into `overlay/`.
- `vendor/fonts/iA Fonts/...` — iA Writer Duo/Mono webfonts.
- `.github/workflows/sync-labels.yaml`, `validate-commit-messages.yaml`.
- `.editorconfig`, `.gitattributes`, `.vscode/`, `LICENSE.txt`, `README.md`.

## URL-preservation contract (from existing `src/_redirects`)

```
/about                       /hello-world            301
/blog                        /                       301
/blog/hello-world            /hello-world            301
/blog/rebranding-javascript  /rebranding-javascript  301
/blog/rebranding-rest        /rethinking-rest        301
/rebranding-rest             /rethinking-rest        301
/contact                     /                       301
/*                           /404.html               404
```
Plus `_headers`: `Strict-Transport-Security` (HSTS preload). Both must survive
into the Netlify publish dir via the Antora `overlay/`.

---

## Steps

Risk-ordered: the build engine + Netlify aggregation is the unknown; URL
preservation is correctness-critical; per-source absorption is repetitive;
polish is last.

### 1. step: Antora walking skeleton — engine builds one local page  [AFK]
Add `package.json` (antora deps), `.nvmrc`, `site-local.yml` with a **single
local content source** (`src/`, one `index.adoc`), default UI bundle URL,
`output.dir: public`. Bare `npx antora` is enough to prove it (no Docker yet).
Add `public`, `cache`, `node_modules` to `.gitignore`.
**Pass:** `npx antora --fetch site-local.yml` produces `public/index.html`;
`npx http-server public` serves the home page locally.
**Depends on:** none. Start on `temp/website-antora-skeleton`.
**Files:** `package.json`, `.nvmrc`, `site-local.yml`,
`src/antora.yml`, `src/modules/ROOT/pages/index.adoc`,
`src/modules/ROOT/nav.adoc`, `.gitignore`.

### 2. step: relocate publish-root files into `overlay/`  [AFK]
Move `src/_redirects`, `src/_headers`, `src/robots.txt`, `src/favicon.ico` into
`overlay/` (contents byte-preserved) and wire `ui.supplemental_files: overlay`
in the playbook. Also serve the iA Writer fonts: copy/route `vendor/fonts/...`
into the overlay so they land in the publish output.
**Note:** the personal `robots.txt` must stay **allow** — do NOT copy the
workbook's disallow-all.
**Pass:** after build, `public/_redirects`, `public/_headers`,
`public/robots.txt`, `public/favicon.ico` present with original contents; an iA
Writer `.woff2` is reachable under the publish output.
**Depends on:** Step 1.

### 3. step: containerised dev wrapper (mirror workbook `run/*`)  [AFK]
Add `Dockerfile` (`node:<pinned>-bookworm-slim` + git), `docker-compose.yml`
(bind mount, port 8080), and `run/install`, `run/build`, `run/serve`,
`run/preview` adapted from the workbook. Add `clean`/`serve`/`watch`/`preview`
npm scripts (`http-server`, `chokidar-cli`, `concurrently`).
**Pass:** `./run/install && ./run/build` produces `public/` owned by host user;
`./run/serve` serves at `http://localhost:8080`; `./run/preview` rebuilds on
edit.
**Depends on:** Steps 1–2.
**Files:** `Dockerfile`, `docker-compose.yml`, `run/*`, `package.json` scripts.

### 4. step: `site-ci.yml` + GitHub Actions build/validate  [AFK]
Add `site-ci.yml` (production `site.url: https://kieranpotts.com`) and
`.github/workflows/build.yaml` mirroring the workbook: setup-node from `.nvmrc`,
`npm ci`, `npm audit --audit-level=high`, `lint:ci`
(`--log-failure-level=warn`), then `linkcheck` (`linkinator`). Existing
`sync-labels` + `validate-commit-messages` workflows stay.
**Pass:** CI green on a PR to `dev`; a deliberately broken xref fails `lint:ci`.
**Depends on:** Steps 1–3.
**Files:** `site-ci.yml`, `.github/workflows/build.yaml`, `package.json`
(`lint`, `lint:ci`, `linkcheck`).

### 5. step: Netlify deploy of the skeleton (no cutover)  [HITL]
Wire Netlify to build from `dev` (build command `npm run build`, publish
`public/`). Deploy to a **Netlify preview/branch URL**, NOT the apex domain yet.
Verify Netlify honours `_redirects`/`_headers` on that preview.
**Pass:** preview URL serves the home page; `/blog` 301s per `_redirects`; HSTS
header present.
**Depends on:** Steps 1–4.
**HITL because:** needs the user's Netlify account access + deploy-config
decision.

### 6. step: home / hello-world / about content  [AFK]
Author the hub pages as real content in `src/modules/ROOT/pages/`: home
(`index.adoc`), `hello-world.adoc` (the `/about` + `/blog/hello-world` redirect
target), 404 page. Match the existing site's voice (cf. `blog/src/index.adoc`).
**Pass:** built site has `/`, `/hello-world`, `/404.html`; every redirect
target in the contract resolves to a real page (no 404).
**Depends on:** Steps 1–2.

### 7. step: absorb `blog` as a content source  [AFK]
Add the `blog` repo as an Antora content source in both playbooks. Resolve the
`.adoc` → Antora module mapping so existing blog URLs (`/rethinking-rest`,
`/php-is-30`, …) are preserved exactly. Reconcile blog feeds
(`feeds/*.xml|json`) via overlay or a feed step.
**Pass:** every URL in the `_redirects` blog rules resolves; spot-checked posts
render; `linkcheck` passes.
**Depends on:** Steps 1, 4. **Independent of Steps 8–9.**
**Risk note:** blog uses bare-Asciidoctor conventions (`docinfo`, custom
attributes) that may not map 1:1 to Antora — riskiest absorption, so it goes
first of the three.

### 8. step: absorb `garden` as a content source  [AFK]
Add `garden` repo as a content source / component. Decide its URL namespace
(e.g. `/garden/*`) and nav.
**Pass:** garden pages render under their namespace; `linkcheck` passes; no
route collision with blog/home.
**Depends on:** Step 7's mapping conventions. **Independent of Step 9.**

### 9. step: absorb `bookmarks` as a content source  [AFK]
Add `bookmarks` repo (nested `src/` tree) as a content source / component with
its nav.
**Pass:** bookmark sections render; `linkcheck` passes.
**Depends on:** Step 7's conventions. **Independent of Step 8.**

### 10. step: unified navigation + cross-links between sections  [AFK]
Wire top-level nav tying home + blog + garden + bookmarks together; add external
links (LinkedIn, Bluesky, CV/résumé, email) from the `kieranpotts` profile
README.
**Pass:** every section reachable from home in ≤2 clicks; nav renders on all
components; `linkcheck` clean.
**Depends on:** Steps 6–9.

### 11. feature: production cutover to kieranpotts.com  [HITL]
Point the apex domain at the new Netlify deploy; confirm `site.url` is the apex
in `site-ci.yml`; final full-site `linkcheck` + manual redirect audit of every
`_redirects` rule against the live domain.
**Pass:** `https://kieranpotts.com/` serves the new site; all legacy URLs 301
correctly; HSTS present; no regression vs the old site's indexed URLs.
**Depends on:** Steps 1–10.
**HITL because:** DNS / production cutover — needs user sign-off; the one
externally-visible behaviour change.

### 12. chore: update README + profile project table  [AFK]
Replace the placeholder `README.md` with real build/run docs (mirror the
workbook README's quick-start + docs sections). Update the `kieranpotts` profile
project table status for `website` (🚧 → 🚀).
**Pass:** README documents `./run/*` and `npm run build`; no dead references.
**Depends on:** Step 11.

---

## Deferred / separate plans (named, not in scope)

- **Personal Antora UI bundle** — a `kieranpotts/antora-ui` equivalent of
  `hacksltd/components__antora-ui` (gulp + Handlebars + a11y tests), themed for
  kieranpotts.com using the iA Writer fonts already in `vendor/`. Own repo, own
  plan; replaces the default UI.
- **Feeds rework** — unifying RSS/Atom/JSON feeds across aggregated content if
  the blog's existing feeds don't transplant cleanly in Step 7.

## Pressure-test

- **If step N fails, can N+1 still merge?** Steps 7/8/9 are mutually independent
  (each its own content source). Steps 1–6 are a linear skeleton; each leaves a
  buildable site.
- **Stop after step K → coherent?** After Step 6, a deployable personal hub (no
  aggregated content) — coherent. After Step 10, full site on a preview URL —
  coherent. Nothing on the apex changes until Step 11.
- **Behaviour changes only where intended?** Only Step 11 changes what
  kieranpotts.com serves. Steps 5 and 11 are the sole HITL deploy gates.
