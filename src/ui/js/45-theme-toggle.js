/**
 * THEME TOGGLE
 *
 * A button in the navbar lets visitors override their OS light/dark
 * preference. The choice is written to `localStorage` and applied as
 * `data-theme` on the root element (see `_/properties.css`), which takes
 * precedence over the `prefers-color-scheme` media query. An inline
 * script in `head.hbs` re-applies any saved choice before first paint,
 * so this file only needs to handle clicks after the fact.
 *
 * Wrapped in a block so its `const`/`let` bindings stay local: the build
 * concatenates every `src/js/*.js` into one `site.js`, and block scope keeps
 * these files from colliding without needing an IIFE.
 */
{
  const init = () => {
    const button = document.querySelector('.NavBar__ThemeToggle')
    if (!button) return

    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const effectiveTheme = () =>
      root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light')

    button.addEventListener('click', () => {
      const next = effectiveTheme() === 'dark' ? 'light' : 'dark'
      root.setAttribute('data-theme', next)
      try {
        localStorage.setItem('theme', next)
      } catch (e) {}
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
}
