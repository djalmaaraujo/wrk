import test from 'ava'
import CmdClean from '../../commands/entry.clean'
import inquirer from 'inquirer'
import EntryService from '../../services/entry.js'

// Mock
const bkpInquirer = Object.create(inquirer.prompt)

// Reset db after every test
test.beforeEach(t => EntryService.reset())

test.serial('Clean all entries if user confirms with YES', async t => {
  inquirer.prompt = (opts) => Promise.resolve({ delete: true, confirm: 'YES' })

  const initEntriesAmount = (await EntryService.index()).length

  t.true(initEntriesAmount > 0, 'At least one entry');

  await CmdClean()

  const afterEntriesAmount = (await EntryService.index()).length

  t.deepEqual(afterEntriesAmount, 0, 'All entries were gone');
})

test.serial('Dont clean entries if user dont answer YES', async t => {
  inquirer.prompt = (opts) => Promise.resolve({
    delete: true,
    confirm: 'SCOOBY'
  })

  const initEntriesAmount = (await EntryService.index()).length

  t.true(initEntriesAmount > 0, 'At least one entry');

  await CmdClean()

  const afterEntriesAmount = (await EntryService.index()).length

  t.deepEqual(afterEntriesAmount, initEntriesAmount, 'All entries were gone');
})

test.afterEach(t => inquirer.prompt = bkpInquirer)
