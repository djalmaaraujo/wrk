// Dependencies
const columnify = require('columnify')
const chalk = require('chalk')

// Modules
const EntryService = require('../services/entry')
const l = require('../utils/logger')
const parseItemsTime = require('../utils/entry').parseItemsTime
const noEntriesToDisplay = require('../utils/entry').noEntriesToDisplay

module.exports = async (noparam, opts) => {
  const entries = await EntryService.index({ orderByDay: true })
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