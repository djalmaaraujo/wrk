// Dependencies
const columnify = require('columnify')
const chalk = require('chalk')
const moment = require('moment')
const inquirer = require('inquirer')
const clear = require('clear')

// Modules
const EntryService = require('../services/entry')
const l = require('../utils/logger')

// Utility
const isDefaultSadeObj = (x) => x.hasOwnProperty('_')
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

const noEntriesMessage = () => {
  l.blank()
  l.warning('You don\'t have any entries to list. Let\'s add one?')
  l.blank()
  l.docsNewEntry()
  return l.default()
}

const listEntries = async () => {
  const entries = await EntryService.index({orderByDay: true})
  const entryKeys = Object.keys(entries)

  if (entryKeys.length === 0) return noEntriesMessage()

  l.log('Your recent entries:')
  l.blank()

  entryKeys.map((item) => {
    const columns = columnify(parseItemsTime(entries[item]), { minWidth: 10 })

    l.log(chalk.bold.yellow(item))
    l.blank()
    l.log(columns)
    l.blank()
  })

  l.docsNewEntry()
  l.default()
}

module.exports = {
  async list(entryDescription, opts) { listEntries() },
  async create(entryDescription, opts) {
    inquirer.prompt([{
      type: 'input',
      name: 'entry',
      message: "Type your entry description:"
    }]).then(answers => {
      createEntry(answers.entry)
      l.blank()
      listEntries()
    });
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
          if (value === 'YES') return true

          return 'Please enter YES or press ctrl+c to cancel'
        }
      }
    ]).then(async answers => {
      if ((answers.delete === true) && (answers.confirm === 'YES')) {
        const deleted = await EntryService.clean()

        if (!deleted) return l.warning('Something went wrong, try again.')

        l.blank()
        l.warning('You deleted all your entries')
        l.blank()
        l.docsNewEntry()
        l.default()
      }
    })
  }
}