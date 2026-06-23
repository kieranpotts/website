'use strict'

/**
 * Antora extension that lets a one-off build preview a draft branch of the
 * `thoughts` content source, instead of always building from latest/dev.
 *
 * Netlify build hooks can't set deploy-time secrets, only a free-text POST
 * body, exposed to the build as INCOMING_HOOK_BODY (a JSON string). The
 * triggering workflow (.github/workflows/netlify-content-preview.yaml) puts
 * the requested branch there; netlify.toml's build command parses it out
 * into THOUGHTS_BRANCH before invoking Antora. This extension is what
 * actually applies that override — it has to run as an Antora extension,
 * not a YAML default, because Antora playbooks do not interpolate env vars
 * into arbitrary content-source fields.
 *
 * Registered only in site-ci.yml; a no-op when THOUGHTS_BRANCH is unset, so
 * normal builds (production, website-repo PR previews) are unaffected.
 */
module.exports.register = function register (context) {
  const branch = process.env.THOUGHTS_BRANCH
  if (!branch) return

  context.on('playbookBuilt', ({ playbook }) => {
    const source = playbook.content.sources.find((s) => /\/thoughts(\.git)?$/.test(s.url))
    if (!source) return
    context.getLogger('content-preview').info(`overriding thoughts branch to '${branch}' for this build`)
    source.branches = branch
  })
}
