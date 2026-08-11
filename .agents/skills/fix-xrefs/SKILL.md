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
this website and _between_ components. Fix only what is demonstrably broken.
Leave anything you can't resolve with certainty untouched, and report it.

## Parameters

Determine the following from the surrounding context and environment, if
possible. Ask the user if it's unclear.

- **The scope — REQUIRED.** One component — `website`, `thoughts`,
  `standards`, `garden`, or `bookmarks` — or, if unspecified, all of them.
  For each in-scope component, scan every `.adoc` file under its `modules/`
  tree.

## Success criteria

- Every in-scope reference MUST resolve to a page, partial, or index entry —
  verified against the target component's own content, never assumed.

- A reference you can't resolve with certainty (eg. its target component has
  no local checkout) MUST NOT be changed.

- A reference that already resolved MUST come out byte-identical.

- The AsciiDoc content around a fixed reference MUST otherwise be unchanged.

- Each fix MUST be applied in the reference's owning repository, and MUST NOT
  be committed.

## Instructions

1.  Build the component registry from `content.sources` in `site-ci.yml`.
    For the local `.` source, the name comes from `src/content/antora.yml`.
    For each remote `https://github.com/kieranpotts/<repo>.git` source, the
    name comes from `<start_path>/antora.yml` in that repo.

    Resolve each remote component to a local checkout by matching `<repo>`
    against this session's other working directories (siblings of this repo,
    at `.../kieranpotts/<repo>/default`). If there's no match, or its
    `antora.yml` `name:` disagrees, mark the component _unavailable_ in the
    registry — don't try to verify references into it.

2.  For each in-scope component, find every `xref:` and `include::` target in
    its `.adoc` files. These are the candidate cross-references to validate.

3.  Validate each candidate.

    - Cross-component `xref:` — Check if the component is in the registry.
      Is a checkout available? Does the file resolve under that component's
      `modules/<module>/pages/` (or `partial$` under `partials/`)?

    - Same-component `xref:`/`include::` — Does the target resolve within
      this component's own content?

4.  Fix only what failed validation. Fix only the cross-reference itself,
    not the linking text, title, or TS-* number. Never convert `xref:` ↔
    `link:`. Write the fix into the file in its _owning_ repository, which
    may not be this one. Do NOT commit.

6.  Report your fixes, grouped by repository then file, followed by every
    unresolved reference and why (including ones left alone because their
    component has no local checkout).

## Rules

- The registry MUST come from `site-ci.yml`.

- You MUST NOT invent a component or module name. A `component:module:file`
  reference naming something outside the registry is either external content
  (leave it) or a typo (report it) — don't guess which.

- You MUST NOT touch a reference that already resolves.

- An `xref:` slug MUST be recalculated from the target page's _current_
  title, never copied from a stale one. Titles can change without warning.

- You MUST NOT guess. A reference with more than one plausible target, or
  whose target component has no checkout, stays untouched and gets reported.

## Edge cases

- A reference targets something outside this site entirely (other standards
  bodies, vendor docs, RFCs — anything not naming one of the five
  components). Leave it alone, even if the syntax looks wrong (eg. an
  `xref:` that should be a `link:`). Report it, don't silently convert it.

- A cross-component reference names a module other than `ROOT`. No component
  currently defines a second module, so check it against the target
  component's real `modules/` tree rather than assuming either way.
