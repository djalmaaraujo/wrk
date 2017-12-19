const Conf = require('conf')
const defaults = require('../test/fixtures/entries')

const config = new Conf({
  projectName: `wrklogger${process.env.NODE_ENV === 'test' ? 'test' : ''}`,
  defaults: (process.env.NODE_ENV === 'test') ? defaults : {}
})

module.exports = config