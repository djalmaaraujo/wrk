// Dependencies
const inquirer = require('inquirer')

// Modules
const EntryService = require('../services/entry')

// Utils
const l = require('../utils/logger')

// Commands
const commandList = require('./entry.list')

module.exports = async (noparam, opts) => {
  inquirer.prompt([{
    type: 'input',
    name: 'entry',
    message: "Type your entry description:"
  }]).then(answers => {
    EntryService.create({
      when: new Date().getTime(),
      description: answers.entry
    })

    l.blank()
    commandList()
  })
}