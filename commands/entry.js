// Dependencies
const columnify = require('columnify')
const chalk = require('chalk')
const moment = require('moment')
const inquirer = require('inquirer')

// Modules
const EntryService = require('../services/entry')

// Utility
const isDefaultSadeObj = (x) => x.hasOwnProperty('_')
const log = (x) => console.log(x)
const logWarning = (x) => log(`${chalk.bold.red('[!]')} ${x}`)
const logNewLine = () => log('')
const logNewEntryText = () => log(`${chalk.gray('Type:')} ${chalk.bold.yellow('wrk a')} ${chalk.yellow('\'your new report message\'')} ${chalk.gray('to add a new entry')}`)
const createEntry = (description) => {
  return EntryService.create({
    when: new Date().getTime(),
    description
  })
}
const parseItemsTime = (items) => {
  return items.map((item) => {
    item.when = moment(new Date(item.when)).format('HH:mm').replace(':','h')

    return item
  })
}

const defaultLog = () => {
  logNewLine()
  return log(`${chalk.gray('OR')} ${chalk.bold.yellow('wrk')} ${chalk.yellow('-h')} ${chalk.gray('for all options.')}`)
}

const listEntries = async () => {
  const entries = await EntryService.index({orderByDay: true})
  const entryKeys = Object.keys(entries)

  if (entryKeys.length === 0) {
    logNewLine()
    logWarning('You don\'t have any entries to list.')
    return defaultLog()
  }

  log('Your recent entries:')
  logNewLine()

  entryKeys.map((item) => {
    log(chalk.bold.yellow(item))
    logNewLine()
    const columns = columnify(parseItemsTime(entries[item]), { minWidth: 10 })
    log(columns)
    logNewLine()
  })

  logNewEntryText()
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
      logWarning('Please, type something...')
      return defaultLog()
    }

    createEntry([entryDescription, opts._.join(' ')].join(' '))

    listEntries()
  },

  async clean(arg, opts) {
    inquirer.prompt([
      {
        type: 'list',
        name: 'delete',
        message: 'Are you sure about this? You will erase EVERYTHING!',
        choices: [
          { value: true, name: 'Yes, I want to delete all entries' },
          { value: false, name: 'No, cancel' }
        ]
      },
      {
        type: 'input',
        name: 'confirm',
        message: "Type YES to continue and delete everything...",
        when: function (answers) {
          return answers.delete
        },
        validate: function (value) {
          if (value === 'YES') {
            return true
          }

          return 'Please enter YES or press ctrl+c to cancel'
        }
      }
    ]).then(async answers => {
      if ((answers.delete === true) && (answers.confirm === 'YES')) {
        const deleted = await EntryService.clean()

        if (!deleted) return logWarning('Something went wrong, try again.')

        logWarning('You deleted all your entries')
        logNewEntryText()
        defaultLog()
      }
    })
  }
}