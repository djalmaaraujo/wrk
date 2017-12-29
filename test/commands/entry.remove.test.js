import test from 'ava'
import CmdRemove from '../../commands/entry.remove'
import inquirer from 'inquirer'
import EntryService from '../../services/entry.js'

// Mock
const bkpInquirer = Object.create(inquirer.prompt)

test.serial('Erase one specific entry', async t => {
  EntryService.reset()

  inquirer.prompt = (opts) => Promise.resolve({ day: '2017/12/09', entry: 'Went to the supermarket'})

  const initEntriesAmount = (await EntryService.index()).length

  await CmdRemove()

  const afterEntriesAmount = (await EntryService.index()).length

  t.deepEqual(initEntriesAmount - 1, afterEntriesAmount, 'Specific entry removed successfully');
})

test.afterEach(t => inquirer.prompt = bkpInquirer)