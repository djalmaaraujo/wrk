// Dependencies
const moment = require('moment')
const inquirer = require('inquirer')

// Services
const EntryService = require('../services/entry')

// Utils
const l = require('../utils/logger')
const parseItemsTime = require('../utils/entry').parseItemsTime
const noEntriesToDisplay = require('../utils/entry').noEntriesToDisplay

// Commands
const commandList = require('./entry.list')

const selectEntryByday = (entries, day) => {
  inquirer.prompt([{
    type: 'rawlist',
    name: 'entry',
    message: "Type the number of the entry to edit:",
    pageSize: 100,
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

    return promptNewDescription(match)
  })
}

const promptNewDescription = (entry) => {
  return inquirer.prompt([{
    type: 'input',
    name: 'entry',
    message: "Type your new entry description:"
  }]).then(async answers => {
    await EntryService.edit(entry, entry.when, answers.entry)

    l.blank()
    commandList()
  })
}

module.exports = async (arg, opts) => {
  const entries = await EntryService.index({ orderByDay: true })
  const entryKeys = Object.keys(entries)

  if (entryKeys.length === 0) return noEntriesToDisplay('remove')

  return inquirer.prompt([{
    type: 'rawlist',
    name: 'day',
    pageSize: 100,
    message: "Select a day first:",
    choices: entryKeys
  }]).then(answers => selectEntryByday(entries, answers.day))
}