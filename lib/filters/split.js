module.exports = (val, delimiter = '/') => {
  return val.toString().split(delimiter)
}
