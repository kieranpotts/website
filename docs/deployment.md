# 🚢 Deployment

The site deploys to [Netlify](https://www.netlify.com/). The build command is
`npm run build:ci` and the publish directory is `public/` (see `netlify.toml`).

The `_redirects` and `_headers` files emitted into `public/` from `src/static/`
preserve the site's legacy URLs and set the HSTS policy.

Production is also rebuilt nightly (02:00 UTC) by the `netlify-build.yaml`
workflow, which POSTs to a Netlify build hook, stored in the `NETLIFY_BUILD_HOOK`
secret. This pulls in new content pushed to the blog/garden/bookmarks
sub-repositories.

Production builds can also be run manually from the GitHub Actions UI.

## Deployment previews

Netlify Deploy Previews are built from PRs. Work on a branch off `latest/dev`
and open a pull request. Netlify automatically builds the branch and posts a
temporary preview URL (`deploy-preview-<n>--kieranpotts.netlify.app`).

Merging the PR into `latest/dev` promotes the change to production as normal.

Preview builds use the same `npm run build:ci` command as production, so
`site.url` resolves to `https://kieranpotts.com`. On previews this only affects
absolute links and the sitemap.

Netlify automatically serves previews with `X-Robots-Tag: noindex`, keeping
preview URLs out of search engines.

## Previewing a draft `thoughts` branch

A website-repo preview only reflects changes in _this_ repo. The blog, garden,
and bookmarks are pulled from their published branches at build time. However,
there is a way to preview draft blog posts.

To preview an unmerged `thoughts` branch within the aggregated site — rather
than waiting for it to land on `latest/dev` — trigger the `Netlify Preview`
workflow.

1.  Push the draft branch to `kieranpotts/thoughts`.
2.  In this repo on GitHub, go to **Actions → Netlify Preview → Run workflow**.
3.  Enter the `thoughts` branch name in the `thoughts_branch` input, and run.
4.  The workflow's job summary prints the preview URL once triggered, eg.
    `https://latest-netlify-preview--kieranpotts.netlify.app` (the branch
    `latest/netlify-preview` is slugified).

## Replicating the Netlify Deploy Previews configuration

The preview workflow depends on Netlify dashboard configuration that isn't
stored in this repo or anywhere else. The following instruction explain how to
set it up from scratch .

1.  Create the `latest/netlify-preview` branch in this repo. It can be identical
    to `latest/dev`.

    ```sh
    git push origin latest/dev:latest/netlify-preview
    ```

2.  Add it as a branch-deploy context. From the Netlify dashboard, select this
    site, then go to **site configuration** → **build & deploy** →
    **continuous deployment**. Confirm the production branch is `latest/dev`.
    Under **branch deploys**, add `latest/netlify-preview`.

3.  Create a build hook scoped to the deploy branch. Go to **site configuration**
    → **build & deploy** → **build hooks** → **add build hook**. Name it, eg.
    `content-preview`. Set the **branch to build** to `latest/netlify-preview`.
    Save and copy the generated URL.

4.  Store the hook URL as a GitHub secret. In this GitHub repo, go to **settings**
    **secrets and variables** → **actions** → **new repository secret**. Set
    the name of the secret to `NETLIFY_PREVIEW_HOOK`.

No Netlify API token or site ID is needed. The build hook URL alone is enough
to trigger a build via `curl`.
