const chalk = require('chalk')
const isDev = require('./isDev')
const logger = (isDev) ? { log(x) { return x } } : console

module.exports = {
  l(x) { return logger.log(x) },
  log(x) { return this.l(x) },
  blank() { return this.l('') },

  warning(x) {
    return this.l(`${chalk.bold.red('[!]')} ${x}`)
  },

  docsNewEntry() {
    return this.l(`${chalk.gray('Type:')} ${chalk.bold.yellow('wrk a')} ${chalk.yellow('\'your new report message\'')} ${chalk.gray('to add a new entry')}`)
  },

  default() {
    this.blank()

    return this.l(`${chalk.gray('OR')} ${chalk.bold.yellow('wrk')} ${chalk.yellow('-h')} ${chalk.gray('for all options.')}`)
  }
}