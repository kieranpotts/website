---
name: fix-xrefs
description: >-
  Find and repair broken cross-references within and between the Antora
  components that are aggregated into this website. Use this skill when the
  user says something like "fix cross-references", "check links",
  "check for valid cross-references", or "a link into <component> is broken".
compatibility: requires Read, Edit, Glob, Grep, Bash (npm)
license: CC0-1.0
---

# Fix cross-references

Find and repair broken cross-references, both _within_ one Antora component of
this website site and _between_ components. Repair only what is demonstrably
broken, and leave untouched anything you cannot resolve with certainty.

## Parameters

Determine the following information from the surrounding context and
environment, if possible. If you're uncertain about the required parameters,
prompt the user for clarification.

- **The scope — REQUIRED.** One component, which might be `website`, `thoughts`,
  `standards`, `garden`, or `bookmarks`. If not specified, assume _all_ Antora
  components that are aggregated into the website are in play. Per in-scope
  component, scan every `.adoc` file under its `modules/` tree.

## Success criteria

- Every reference in scope MUST now resolve to a page, partial, or index entry.
  Don't assume the target exists – validate by checking the target component's
  own content.

- Every reference that you cannot resolve with certainty — for example,
  if the target component is not checked out in the current workspace,
  providing you with content to verify against — MUST NOT be changed.

- References that already resolved correctly MUST be byte-identical to how
  they started.

- The surrounding AsciiDoc content MUST be unchanged around every reference
  that was fixed.

- Each fix MUST be applied in the relevant local repository, but MUST NOT be
  committed.

## Instructions

1.  Build the component registry from `content.sources` in `site-ci.yml`. For the
    local `.` source, the component name comes from `src/content/antora.yml`.
    For each remote `https://github.com/kieranpotts/<repo>.git` source, the
    component name comes from `<start_path>/antora.yml` in that repository.

    Resolve each remote component to a local working copy by matching
    `<repo>` against this session's other working directories — they are siblings
    of this repository, following the pattern `.../kieranpotts/<repo>/default`.
    If no matching working directory is available, or its `antora.yml` `name:`
    doesn't match what the playbook expects, that component has no local checkout.
    Record it in the registry as _unavailable_. Do not attempt to verify
    any cross-references pointing to unavailable components.

2.  Resolve the scope to one or more components using the registry.

3.  Enumerate the `.adoc` files each in-scope component covers, and
    find candidate references, eg. `xref:` and `include::` targets.

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
