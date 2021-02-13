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

module.exports = (date) => {
  return (
    date instanceof Date
      ? date.getUTCDate() + ' ' + toMonth.format(date) + ', ' + date.getUTCFullYear()
      : ''
  )
}
