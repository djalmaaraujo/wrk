const path = require('path')
const Conf = require('conf')
const isDev = require('../utils/isDev')

const configParams = { projectName: `wrklogger` }

if (isDev) {
  const defaults = require('../test/fixtures/entries')
  const randConfig = `test_${Math.random().toString().replace('.', '_')}`

  configParams.defaults = defaults
  configParams.projectName = `wrklogger${isDev ? randConfig : ''}`
  configParams.cwd = path.resolve(__dirname, `../test/tmp/${randConfig}`)
}

module.exports = new Conf(configParams)