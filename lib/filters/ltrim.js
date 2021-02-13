module.exports = (val, charlist) => {
  return val.toString().replace(new RegExp('^[' + charlist + ']+'), '')
}
