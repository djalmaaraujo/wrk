// Dependencies
const inquirer = require('inquirer')

// Modules
const EntryService = require('../services/entry')
const l = require('../utils/logger')

module.exports = async (arg, opts) => {
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
}