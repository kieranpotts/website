# 📚 Content sources

The site aggregates four content sources at build time. The blog, garden, and
bookmarks are public repositories referenced by URL in the playbooks.

| Source         | Repository                                                        | Branch       | Published under |
|----------------|-------------------------------------------------------------------|--------------|-----------------|
| Home / about   | This repo                                                         | `HEAD`       | `/`             |
| Blog           | [kieranpotts/thoughts](https://github.com/kieranpotts/thoughts)   | `latest/dev` | `/thoughts/`    |
| Digital Garden | [kieranpotts/garden](https://github.com/kieranpotts/garden)       | `latest/dev` | `/garden/`      |
| Bookmarks      | [kieranpotts/bookmarks](https://github.com/kieranpotts/bookmarks) | `latest/dev` | `/bookmarks/`   |

The look and feel comes from a custom Antora UI theme built in-repo from
`src/ui/`.

Custom AsciiDoc converters are defined in `src/lib/asciidoc/` and evolve
alongside the theme. They override Antora's default markup for certain
AsciiDoc blocks.
