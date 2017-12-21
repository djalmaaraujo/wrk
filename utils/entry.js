const moment = require('moment')
const l = require('./logger')

module.exports = {
  parseItemsTime(items) {
    return items.map((item) => {
      item.when = moment(new Date(item.when)).format('HH:mm').replace(':', 'h')

      return item
    })
  },

  noEntriesToDisplay(action = 'list') {
    l.blank()
    l.warning(`You don't have any entries to ${action}. Let's add one?`)
    l.blank()
    l.docsNewEntry()
    return l.default()
  }
}