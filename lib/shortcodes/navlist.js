/**
 * This Eleventy shortcode recursively examines all pages
 * to generate appropriate HTML for the main navigation.
 */

const listType = 'ul'
const elementActive = 'strong'
const classActive = 'active'
const classOpen = 'open'

// Pass in collections.all | eleventyNavigation, (current) page, and maximum depth level
module.exports = (pageNav, page, maxLevel = 999) => {

  function navRecurse(entry, level = 1) {

    let childPages = ''

    if (level < maxLevel) {
      for (let child of entry.children) {
        childPages += navRecurse(child, level++)
      }
    }

    let active = (entry.url === page.url)
    let classList = []

    if ((active && childPages) || childPages.includes(`<${ elementActive }>`)) {
      classList.push(classOpen)
    }
    if (active) {
      classList.push(classActive)
    }

    return (
      '<li'
      + (classList.length ? ` class="${ classList.join(' ') }"` : '')
      + '>'
      + (active ? `<${ elementActive }>` : `<a href="${ entry.url }">`)
      + entry.title
      + (active ? `</${ elementActive }>` : '</a>')
      + (childPages ? `<${ listType }>${ childPages }</${ listType }>` : '')
      + '</li>'
    )

  }

  let nav = ''
  for (let entry of pageNav) {
    nav += navRecurse(entry)
  }

  return `<${ listType }>${ nav }</${ listType }>`

}
