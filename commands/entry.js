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

const defaultLog = () => {
  log('')
  return log(`${chalk.gray('OR')} ${chalk.bold.yellow('wrk')} ${chalk.yellow('-h')} ${chalk.gray('for all options.')}`)
}

const listEntries = async () => {
  const entries = await EntryService.index()
  const columns = columnify(entries, { minWidth: 10 })

  log('Your recent entries:')
  log('')
  log(columns)
  log('')
  log(`${chalk.gray('Type:')} ${chalk.bold.yellow('wrk a')} ${chalk.yellow('\'your new report message\'')} ${chalk.gray('to add a new entry')}`)
  defaultLog()
}

module.exports = {
  async list(entryDescription, opts) {
    if (!isDefaultSadeObj(entryDescription)) {
      createEntry([entryDescription, opts._.join(' ')].join(' '))
    }

    listEntries()
  },

  async create(entryDescription, opts) {
    if (isDefaultSadeObj(entryDescription)) {
      log(`${chalk.bold.red('[!]')} Please, type something...`)
      return defaultLog()
    }

    createEntry([entryDescription, opts._.join(' ')].join(' '))

    listEntries()
  }
}