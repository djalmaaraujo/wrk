#! /usr/bin/env node

const sade = require('sade')
const prog = sade('wrk')
const figlet = require('figlet')
const chalk = require('chalk')
const clear = require('clear')

// Modules
const version = require('./package.json').version

// Commands
const commandRemove = require('./commands/entry.remove')
const commandClean = require('./commands/entry.clean')
const commandList = require('./commands/entry.list')
const commandCreate = require('./commands/entry.create')

// Update
require('./services/updater')()

const layout = new Promise((rs, rj) => {
  clear()

  figlet('WrK   logger', (err, data) => {
    if (err) rj(err)

    console.log(chalk.yellow(data))
    rs(true)
  })
})

layout.then(() => {
  prog.version(version)

  prog
    .command('list', '', { default: true })
    .describe('List your entries')
    .action(commandList)

  prog
    .command('add')
    .describe('Add a new entry')
    .action(commandCreate)

  prog
    .command('remove')
    .describe('Remove an entry')
    .action(commandRemove)

  prog
    .command('clean')
    .describe('Deletes all entries. Be careful, there\'s NO trash can here')
    .action(commandClean)

    prog.parse(process.argv)
})