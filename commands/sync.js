// Dependencies
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')

// Utils
const opn = require('../utils/opener')
const l = require('../utils/logger')

// Commands
const commandList = require('../commands/entry.list')

// Services
const Sync = require('../services/sync')

const validateToken = async (token) => {
  const spinner = ora('Verifying your token against Github API...').start()

  await Sync.setToken(token)

  try {
    const isValid = await Sync.checkToken()
    spinner.succeed('Token verified.')

    return isValid
  } catch(err) {

    spinner.fail(`${chalk.bold.red('🛑 ')} Token invalid. Github returned bad credentials status code. Provide a valid personal access token`)
  }
}

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
      validate: validateToken
    }]).then(async answers => {
      await Sync.setToken(answers.token)

      l.blank()
      l.success('Github Personal token saved successfully')
      l.log('  - All your entries will now be synced with Github Gists API')
      l.log('  - A gist with the title wrklogger.json will be added to your gists')
      l.log('  - If you wish to disable sync, type wrk sync again')
      l.blank()
      l.default()
    })
  })
}