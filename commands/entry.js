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

const noEntriesToDisplay = (action = 'list') => {
  l.blank()
  l.warning(`You don't have any entries to ${action}. Let's add one?`)
  l.blank()
  l.docsNewEntry()
  return l.default()
}

const listEntries = async () => {
  const entries = await EntryService.index({orderByDay: true})
  const entryKeys = Object.keys(entries)

  if (entryKeys.length === 0) return noEntriesToDisplay()

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
  },

  async destroy(arg, opts) {
    const entries = await EntryService.index({ orderByDay: true })
    const entryKeys = Object.keys(entries)

    if (entryKeys.length === 0) return noEntriesToDisplay('remove')

    const selectEntryByday = (entries, day) => {
      inquirer.prompt([{
        type: 'rawlist',
        name: 'entry',
        message: "Type the number of the entry to delete:",
        choices: parseItemsTime(entries[day]).map((i, index) => {
          return {
            name: `${i.when} - ${i.description}`,
            value: i.description // should be the ID in the future
          }
        })
      }]).then(async answers => {
        // We dont have ID's for entries yet
        // I will match the description
        // If 2 matches, the first index in array will be deleted.
        // We need ID's!

        const allEntries = await EntryService.index()
        const match = allEntries.find((i) => i.description === answers.entry)

        if (match) {
          const deleted = await EntryService.destroy(match)
        }

        listEntries()
      })
    }

    inquirer.prompt([{
      type: 'rawlist',
      name: 'day',
      message: "Select a day first:",
      choices: entryKeys
    }]).then(answers => selectEntryByday(entries, answers.day))
  }
}