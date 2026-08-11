# Fix cross-references

Scans this website's Antora components for broken cross-references (including
cross-references between components) and repairs them.

The agent is instructed not to repair anything that's ambiguous. For example, a
reference whose target component has no local checkout to verify against, or
that has more than one plausible target, is reported as unresolved.

## Interactivity

The agent is instructed to prompt when the scope is unclear, but otherwise
runs to completion.

## How to invoke

> Fix cross-references.

> Check for valid cross-references across the Antora modules.

> A link from garden into standards looks broken.

> Fix references in TS-10.

## Recommended models

A small, fast model is sufficient. The workload is purely mechanical.
