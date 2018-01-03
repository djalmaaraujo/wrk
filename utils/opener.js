const opn = require('opn')

module.exports = {
  async open(x) { return opn(x) }
}