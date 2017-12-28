const path = require('path')
const Conf = require('conf')
const isDev = require('../utils/isDev')

const defaults = require('../test/fixtures/entries')
const configParams = {
  projectName: `wrklogger`,
  defaults: (isDev) ? defaults : {}
}

if (isDev) {
  const randConfig = `test_${Math.random().toString().replace('.', '_')}`

  configParams.projectName = `wrklogger${isDev ? randConfig : ''}`
  configParams.cwd = path.resolve(__dirname, `../test/tmp/${randConfig}`)
}

module.exports = new Conf(configParams)