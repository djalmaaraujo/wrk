#! /usr/bin/env node

const sade = require('sade')
const prog = sade('wrk')
const figlet = require('figlet')
const chalk = require('chalk')
const clear = require('clear')

// Modules
const version = require('./package.json').version
const commandEntry = require('./commands/entry')

const log = (x) => console.log(x)
const layout = new Promise((rs, rj) => {
  figlet('WrK   logger', (err, data) => {
    if (err) rj(err)

    clear()
    log(chalk.yellow(data))
    rs(true)
  })
})

layout.then(() => {
  prog.version(version)

  prog
    .command('list', '', { default: true })
    .describe('List your entries')
    .action(commandEntry.list)

  prog
    .command('add')
    .describe('Add a new entry')
    .action(commandEntry.create)

  prog
    .command('clean')
    .describe('Deletes all entries. Be careful, there\'s trash can here')
    .action(commandEntry.clean)

    prog.parse(process.argv)
})