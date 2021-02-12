/**
 * This filter counts the number of words in an article
 * and outputs an estimated read time.
 */

const roundTo = 10
const readPerMin = 200
const numFormat = new Intl.NumberFormat('en')

module.exports = (count) => {
  const words = Math.ceil(count / roundTo) * roundTo
  const mins = Math.ceil(count / readPerMin)

  return `${ numFormat.format(words) } words, ${ numFormat.format(mins) }-minute read`
}
