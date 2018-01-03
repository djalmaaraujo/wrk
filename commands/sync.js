// Dependencies
const inquirer = require('inquirer')

// Utils
const opn = require('../utils/opener')
const l = require('../utils/logger')

// Commands
const commandList = require('../commands/entry.list')

// Services
const Sync = require('../services/sync')

module.exports = async (arg, opts) => {
  return inquirer.prompt([{
    type: 'confirm',
    name: 'answer',
    message: "I will open the browser so you can generate the Github Personal Token, ok?"
  }]).then(async answers => {
    if (answers.answer) {
      await opn.open('https://github.com/settings/tokens/new')
    }

    return inquirer.prompt([{
      type: 'password',
      name: 'token',
      message: "Paste your generated token here:",
      validate(token) {
        if (!token) return 'Insert a valid token'

        return true
      }
    }]).then(async answers => {
      await Sync.setToken(answers.token)

      l.blank()
      l.success('Github Personal token saved successfully.')
      l.blank()
      l.log('- All your entries will now be synced with Github Gists API')
      l.log('- A gist with the title wrklogger.json will be added to your gists')
      l.log('- If you wish to disable sync, type wrk sync again')
      l.blank()
      l.default()
    })
  })
}