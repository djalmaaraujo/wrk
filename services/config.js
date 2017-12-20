const path = require('path')
const Conf = require('conf')

const defaults = require('../test/fixtures/entries')
const isDev = (['test', 'development'].indexOf(process.env.NODE_ENV.toLowerCase()) > -1)
const configParams = {
  defaults: (process.env.NODE_ENV === 'test') ? defaults : {}
}

if (isDev) {
  configParams.projectName = `wrklogger${process.env.NODE_ENV === 'test' ? 'test' : ''}`
  configParams.cwd = path.resolve(__dirname, '../test/tmp')
}

module.exports = new Conf(configParams)