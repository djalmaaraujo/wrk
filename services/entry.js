const config = require('./config')
const defaults = require('../test/fixtures/entries')
const groupBy = require('lodash/groupBy')
const moment = require('moment')
const DEFAULT_FORMAT = 'Y/M/DD'

module.exports = {
  index(options = {}) {
    let entries = config.get('entries')

    if (options.orderByDay) {
      entries = groupBy(entries, (entry) => moment(new Date(entry.when)).format(DEFAULT_FORMAT))
    }

    return Promise.resolve(entries)
  },

  create(entryParams) {
    const oldState = config.get('entries')
    oldState.push(entryParams)
    config.set('entries', oldState)

    return Promise.resolve(entryParams)
  },

  destroy(entry) {
    const entryString = JSON.stringify(entry).toString()
    const oldState = config.get('entries')

    const newState = oldState.filter((item) => {
      const currentString = JSON.stringify(item).toString()

      if (currentString !== entryString) return item
    })

    config.set('entries', newState)

    return Promise.resolve(true)
  },

  reset() {
    config.set('entries', defaults.entries)
  },

  clean() {
    config.set('entries', [])

    return Promise.resolve(true)
  }
}