# GitHub Actions workflows

- `build.yaml` \
  Builds and validates the site, and checks for broken internal links, on
  every change to `latest/dev`.

- `check-broken-links.yaml` \
  Crawls the published site (`kieranpotts.com`) for broken links daily
  (03:00 UTC), one hour after the nightly Netlify rebuild, so it always
  tests the latest deployed content. On failure, opens or updates a single
  tracking issue labelled `ERRATA`. Can also be triggered manually.

- `flag-stale-issues.yaml` \
  Flags old open issues weekly (Monday 05:00 UTC), commenting and labelling
  them once they cross 2, 4, and 8 month age thresholds.

- `netlify-build.yaml` \
  Triggers a Netlify production rebuild nightly (02:00 UTC), so new content
  pushed to the blog/garden/bookmarks sub-repositories is pulled in even
  without a change to this repo. Requires the `NETLIFY_BUILD_HOOK` secret.

- `netlify-preview.yaml` \
  Manually triggered (`workflow_dispatch`). Builds a one-off Netlify preview
  of a draft branch of `kieranpotts/thoughts`, for eyeballing a new blog post
  before merging its PR. Requires a `NETLIFY_PREVIEW_HOOK` secret pointing
  at a dedicated non-production Netlify context.

- `sync-labels.yaml` \
  Syncs this repo's issue labels nightly (04:00 UTC) from
  [kieranpotts/.github](https://github.com/kieranpotts/.github).

- `validate-commit-messages.yaml` \
  Validates commit-message format on every push.
