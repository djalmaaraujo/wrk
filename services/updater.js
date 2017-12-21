// CLI Updates
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

module.exports = () => {
  updateNotifier({ pkg, isGlobal: true }).notify()
}

