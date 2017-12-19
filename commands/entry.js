const columnify = require('columnify')
const chalk = require('chalk')

const EntryService = require('../services/entry')
const isDefaultSadeObj = (x) => x.hasOwnProperty('_')
const log = (x) => console.log(x)

const createEntry = (description) => {
  return EntryService.create({
    when: new Date().getTime(),
    description
  })
}

module.exports = {
  async list(entryDescription, opts) {
    if (!isDefaultSadeObj(entryDescription)) {
      createEntry([entryDescription, opts._[0]].join(' '))
    }

    log('Your recent entries:')

    const entries = await EntryService.index()
    const columns = columnify(entries, { minWidth: 10 })

    log('')
    log(columns)
    log('')
    log(`${chalk.gray('Type:')} ${chalk.bold.yellow('wrk')} ${chalk.yellow('your new report message')} ${chalk.gray('to add a new entry')}`)
    log(`${chalk.gray('OR')} ${chalk.bold.yellow('wrk')} ${chalk.yellow('-h')} ${chalk.gray('for all options.')}`)
  }
}