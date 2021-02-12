/**
 * Filters to convert date formats.
 *
 * This module exports two functions:
 *
 * - `ymd()`, which converts a date to a machine-readable
 *   `YYYY-MM-DD` format, ideal for using in HTML's `datetime`
 *   attribute.
 *
 * - `friendly()`, which converts a date to a human-friendly
 *   format, eg `1 January, 2020`.
 */

const toMonth = new Intl.DateTimeFormat('en', { month: 'long' })

module.exports.ymd = (date) => {
  return (
    date instanceof Date
      ? `${ date.getUTCFullYear() }-${ String(date.getUTCMonth() + 1).padStart(2, '0') }-${ String(date.getUTCDate()).padStart(2, '0') }`
      : ''
  )
}

module.exports.friendly = (date) => {
  return (
    date instanceof Date
      ? date.getUTCDate() + ' ' + toMonth.format(date) + ', ' + date.getUTCFullYear()
      : ''
  )
}
