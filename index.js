const sade = require('sade')
const prog = sade('wrk')
const version = require('./package.json').version
const figlet = require('figlet')
const chalk = require('chalk')
const clear = require('clear')
const columnify = require('columnify')
const EntryService = require('./services/entry')

const isDefaultSadeObj = (x) => x.hasOwnProperty('_')
const layout = new Promise((rs, rj) => {
  figlet('WrK   logger', (err, data) => {
    if (err) rj(err)

    clear()
    console.log(chalk.yellow(data))
    rs(true)
  })
})

const createEntry = (description) => {
  return EntryService.create({
    when: new Date().getTime(),
    description
  })
}

layout.then(() => {
  prog.version(version)

  prog
    .command('e <entry>')
    .describe('List your entries')
    .option('-e, --entry')
    .action(async (entryDescription, opts) => {
      if (!isDefaultSadeObj(entryDescription)) {
        createEntry([entryDescription, opts._[0]].join(' '))
      }

      console.log('Your recent entries:')

      const entries = await EntryService.index()
      const columns = columnify(entries, { minWidth: 10 })

      console.log('')
      console.log(columns)
      console.log('')
      console.log(`${chalk.gray('Type:')} ${chalk.bold.yellow('wrk')} ${chalk.yellow('your new report message')} ${chalk.gray('to add a new entry')}`)
      console.log(`${chalk.gray('OR')} ${chalk.bold.yellow('wrk')} ${chalk.yellow('-h')} ${chalk.gray('for all options.')}`)
    })

    prog.parse(process.argv)
})