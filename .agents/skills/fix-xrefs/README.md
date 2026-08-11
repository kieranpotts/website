# Fix cross-references

Scans this site's Antora components for broken cross-references and repairs
them, so that every reference — inside one component or between two of them —
carries a target that actually resolves, and, for `standards`, the right TS
number and title too.

The site is aggregated from several sibling repositories, one per Antora
component (`ROOT` in this repo, plus `thoughts`, `standards`, `garden`, and
`bookmarks`). The agent builds a registry of those components from
`site-ci.yml`, matches each one to its local checkout among the session's
working directories, then sweeps the `.adoc`/`.md` files in scope — one
component, or all of them — for anything that looks like a reference to
another page, either in the same component or across a component boundary.

Each candidate is checked against the *target* component's own content: does
the file it names actually exist there, and — for `standards` — does the
stated TS number and title match that repository's index. Only what fails a
check gets touched, and a fix always lands in whichever repository owns the
broken reference, not necessarily this one.

Anything ambiguous is deliberately not repaired. A reference whose target
component has no local checkout to verify against, or that has more than one
plausible target, keeps its original text and is reported as unresolved — a
wrong guess is worse than a flagged uncertainty, because it looks fixed.

## Interactivity

Interactive, but only barely. The agent prompts when the scope is unclear —
one component, or the whole site — and otherwise runs to completion,
reporting fixes and unresolved references at the end rather than asking about
them along the way.

## How to invoke

> Fix cross-references.

> Check for valid cross-references across the Antora modules.

> A link from garden into standards looks broken.

> Fix references in TS-10.

## Recommended models

A small, fast model is sufficient. The work is mechanical validation against
each component's own content, and the skill is written to escalate anything
ambiguous to the report rather than to reason about it.

## Related skills

Both of these live in the `standards` repository, not this one.

- **agentify** \
  That skill validates cross-references only within the one file it writes.
  This one sweeps every component on the site.

- **deep-dive** \
  Broken cross-references are a conventions-tier finding in a deep dive. Run
  this skill to clear them in one pass, rather than one at a time.
