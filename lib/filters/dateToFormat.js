const { DateTime } = require('luxon')

const defaultZone = 'UTC'

module.exports = (date, format, timezone = defaultZone) => {
  return DateTime.fromJSDate(date, { timezone }).toFormat(String(format))
}
