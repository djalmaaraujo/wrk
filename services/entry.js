const config = require('./config')
const defaults = require('../test/fixtures/entries')

module.exports = {
  index() {
    return Promise.resolve(config.get('entries'))
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
  }
}