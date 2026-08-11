---
name: fix-cross-references
description: >-
  Find and repair broken cross-references between the Antora components
  aggregated into this site — ROOT (this repo), thoughts, standards, garden,
  bookmarks — and within each one. Use when the user says "fix cross-
  references", "check links between the standards/garden/bookmarks/thoughts",
  "a link into <component> is broken", or "check for valid cross-references
  across the Antora modules". Do not use it to restyle references that
  already resolve correctly, or to edit content that has nothing to do with a
  reference.
compatibility: requires Read, Edit, Glob, Grep, Bash (npm)
license: CC0-1.0
---

# Fix cross-references

Find and repair broken cross-references — stale titles, wrong TS numbers,
and `xref:`/`include::` targets that no longer resolve — both *within* one
Antora component of this site and *between* components. Repair only what is
demonstrably broken, and leave anything you cannot resolve with certainty
untouched.

This site is built by aggregating several independently-versioned Git
repositories, each one Antora component, per `site-ci.yml`'s `content.sources`:

- **ROOT** — this repository, home/about pages, `src/content/`.
- **thoughts**, **standards**, **garden**, **bookmarks** — sibling
  repositories, each fetched at build time.

Every component currently defines only a `ROOT` module. A reference within a
component omits the component coordinate; a reference to a different
component MUST state it (`component:module:file.adoc`, or the shorthand
`component::file.adoc` when the module is `ROOT`).

Two distinct reference mechanisms are in play, and a fix MUST use the right
one for the file it's in:

- **`.adoc` files** (pages and partials) use Antora resource IDs via `xref:`,
  and a component's own includes use
  `include::partial$<module>/<file>.adoc[leveloffset=+1]`. Neither is a
  relative filesystem path. `include::` cannot cross a component boundary —
  Antora has no cross-component include; treat one that looks like it's
  trying to as a structural error to report, not a target to "fix" into an
  xref, since that would change what the author meant.

- **`standards`' `AGENTS.md`/`GAPS.md` files** are plain Markdown, outside
  Antora's reach, and keep an older, standards-only convention: a relative
  link to another standard's `AGENTS.md`, eg. `../031/AGENTS.md`. This
  convention doesn't exist in the other components.

- **`standards` alone** also numbers its pages (`TS-<N>`) and requires every
  `xref:`/link naming a standard to carry its *exact* current title, per
  `standards/src/modules/ROOT/pages/index.adoc`. The other components have no
  equivalent numbering or title-index convention — for them, a same- or
  cross-component `xref:` is either resolvable or it isn't; there's no
  separate "title drift" check to run.

## Parameters

Determine the following information from the surrounding context and
environment, if possible. If you're uncertain about the required parameters,
prompt the user for clarification.

- **The scope — REQUIRED.** One component (`ROOT`, `thoughts`, `standards`,
  `garden`, or `bookmarks`), or `all`. For a single component, scan every
  `.adoc`/`.md` file under its `modules/` tree (plus, for `standards`, its
  `AGENTS.md`/`GAPS.md` meta-docs). `all` means every component the registry
  (step 1) can find checked out locally.

## Success criteria

- Every reference in scope — same-component or cross-component — MUST now
  resolve to a page, partial, or (for `standards`) index entry that actually
  exists, checked against the *target* component's own content, not assumed.

- Every `standards` reference that named a `TS-<N>` number or title MUST
  match `standards/src/modules/ROOT/pages/index.adoc` exactly.

- Every reference that could not be resolved with certainty — including one
  whose target component has no local checkout available to verify against —
  MUST still hold its original text, and MUST be listed in the report as
  unresolved. A wrong guess is worse than a flagged uncertainty, because it
  looks fixed.

- References that already resolved correctly MUST be byte-identical to how
  they started, and the surrounding AsciiDoc or Markdown construct MUST be
  unchanged around every reference that was fixed.

- Each fix MUST land in whichever repository actually owns the file the
  broken reference lives in — this skill freely edits any of the site's
  component repositories, not only the one it's installed in. Nothing MUST
  be staged or committed in any of them, and no file outside the identified
  broken references MUST have been modified.

## Instructions

1.  Build the component registry from `site-ci.yml`'s `content.sources` (the
    production source list — more complete than `site-dev.yml`). For the
    local `.` source, the component name comes from `src/content/antora.yml`.
    For each remote `https://github.com/kieranpotts/<repo>.git` source, the
    component name comes from `<start_path>/antora.yml` in that repository.

    Resolve each remote component to a local working copy by matching
    `<repo>` against this session's other working directories (they follow
    the pattern `.../kieranpotts/<repo>/default`, siblings of this repo's own
    checkout). If no matching working directory is available, or its
    `antora.yml` `name:` doesn't match what the playbook expects, that
    component has no local checkout — record it in the registry as
    *unavailable*, not missing; references pointing into it can't be verified
    and MUST be reported, never guessed at.

    For `standards`, additionally read
    `src/modules/ROOT/pages/index.adoc` from its local checkout and build the
    `TS-<N>` → {title, page filename} mapping — the sole authority for
    standards numbers, titles, and slugs.

2.  Resolve the scope to one or more components using the registry.

3.  Enumerate the `.adoc`/`.md` files each in-scope component covers, and
    find candidate references: `xref:` and `include::` targets (same- and
    cross-component forms), `TS-\d{1,3}` mentions, and — in `standards`'
    `AGENTS.md`/`GAPS.md` files only — `../\d{3}/` relative paths.

4.  Validate each candidate on the axes that apply to its mechanism and
    target:

    - **Cross-component `xref:`.** Does the named component exist in the
      registry? Is a local checkout available to verify against? Does the
      module (almost always `ROOT`) and the file resolve within that
      component's own `modules/<module>/pages/` (or `partial$` under
      `partials/`)?
    - **Same-component `xref:`/`include::`.** Does the target resolve within
      the source component's own content?
    - **`standards` title.** Where the link text states a TS number or
      title, does it match `standards`' index exactly?
    - **`standards` `AGENTS.md`/`GAPS.md` relative path.** Is it exactly
      `../NNN/AGENTS.md` — one level, never more — and does that file exist?
      (A same-standard `../../pages/NNN-slug.adoc` "(source)" self-link is a
      different, legitimate pattern — leave it alone.)

5.  As a confirming pass — time permitting, and only when checking `ROOT` or
    the whole site — run `npm run lint` (`antora --log-failure-level=warn
    site-ci.yml`) in this repository. It performs a real Antora build and
    fails on any unresolved `xref:`, which is the most authoritative check
    there is. Its blind spot: `content.sources` for every component but
    `ROOT` reads each repo's *pushed* branch, so it won't see local,
    uncommitted fixes from step 6 or unpushed sibling-repo work — treat its
    output as confirmation of the static pass, not a replacement for it.

6.  Apply a fix only where a check failed, correcting the number, the title,
    or the target, and leaving the link syntax around it as it was. Never
    convert `xref:` to `link:` or vice versa. Write the fix into the file in
    its *owning* repository (which may not be this one).

7.  Confirm every reference you changed now resolves against the target
    component's actual content, then report the fixes grouped by repository
    and then file, followed by the unresolved references and why each one
    could not be settled (including any reported as unverifiable because a
    target component has no local checkout).

## Rules

- The component registry MUST come from `site-ci.yml`, not be hardcoded —
  a component added to or removed from the playbook changes what's in scope
  on the next run without the skill itself needing an edit.

- You MUST NOT invent a component or module name. A `component:module:file`
  reference naming something outside the registry is either external content
  (leave it) or a typo (report it as unresolved) — never guess which.

- You MUST treat `standards/src/modules/ROOT/pages/index.adoc` as the single
  source of truth for TS numbers, titles, and slugs. It governs `standards`
  only; the other components have no equivalent index to check titles
  against.

- You MUST NOT modify a reference that already resolves. Restyling a correct
  but inconsistent reference is out of scope unless the user asks for it,
  because it inflates the diff and hides the real repairs in it.

- An `xref:` target's slug MUST be recalculated from the target page's
  *current* title/filename, not copied from the stale reference. A page's
  title can change without warning, which silently breaks every `xref:` that
  named its old slug.

- A reference inside a `standards` `AGENTS.md` MUST point at the target
  standard's `AGENTS.md`, so that agent context chains stay compact. A
  reference inside an `.adoc` file MUST point at the target's page via
  `xref:`.

- You MUST NOT guess. Where a reference has more than one plausible target,
  or its target component has no local checkout to verify against, leave it
  alone and report it as unresolved.

## Edge cases

- The reference is to something outside this site entirely.

  References to external standards, other websites, RFCs, ISO standards,
  vendor specifications — anything not naming one of this site's five
  components — MUST be left alone, even where they look superficially
  similar (eg. `xref:` used by mistake for what should be a `link:`, in a
  file where that's simply wrong — report it, don't silently convert it).

- A `standards` `xref:` carries a `#fragment` or a custom, descriptive link
  text instead of the standard's exact title (eg.
  `[TS-32: Bash → Functions]`, `[TS-1: Use cases]`).

  This is not a stylistic variant to leave alone — `standards`' style guide
  (`docs/style-guide.md` in that repo) explicitly bans section-fragment links
  between standards, because a standard is published as one merged page.
  Antora itself supports `#anchor` fragments and free-form link text
  generally — that's platform capability, not `standards`' convention — but
  there the link text MUST always be normalized to the plain `TS-N: Title`
  form and any `#anchor` dropped. This rule is specific to `standards`; the
  other components have no equivalent ban to enforce.

- The link text has malformed nested emphasis, eg.
  `*xref:011-versioning.adoc[TS-11: *Versioning*]*`.

  The inner `*...*` around the title is never intentional. Strip it so the
  title text is exactly `TS-N: Title`.

- A `standards` `AGENTS.md`/`GAPS.md` link targets `../../pages/NNN-slug.adoc`
  instead of another standard's `AGENTS.md`.

  This is the standard's own "(source)" self-link back to its `.adoc` page —
  a different, legitimate pattern. Only `../NNN/AGENTS.md`-shaped links to a
  *different* standard fall under the relative-path check; leave a
  same-standard `../../pages/` self-link untouched.

- A cross-component reference names a module other than `ROOT`.

  No component in the registry currently defines a second module, so this is
  more likely a typo than a real target — check it against the target
  component's actual `modules/` tree rather than assuming either way.

- The registry lists a component with no local checkout among this session's
  working directories.

  You cannot verify references pointing into it, or fix anything inside it.
  Report every such reference as unresolved, naming the component, rather
  than silently skipping it or guessing it's fine.
