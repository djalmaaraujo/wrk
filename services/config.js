const path = require('path')
const Conf = require('conf')
const isDev = require('../utils/isDev')

const defaults = require('../test/fixtures/entries')
const configParams = {
  projectName: `wrklogger`,
  defaults: (isDev) ? defaults : {}
}

if (isDev) {
  configParams.projectName = `wrklogger${isDev ? 'test' : ''}`
  configParams.cwd = path.resolve(__dirname, '../test/tmp')
}

module.exports = new Conf(configParams)