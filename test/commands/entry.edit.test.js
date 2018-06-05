import test from 'ava'
import CmdEdit from '../../commands/entry.edit'
import inquirer from 'inquirer'
import EntryService from '../../services/entry.js'

// Mock
const bkpInquirer = Object.create(inquirer.prompt)

test.serial('Edit one specific entry', async t => {
  EntryService.reset()

  const edited = { day: '2017/12/09', entry: 'Went to the supermarket' }

  inquirer.prompt = (opts) => Promise.resolve(edited)

  const initEntriesAmount = (await EntryService.index()).length

  await CmdEdit()

  const when = new Date().getTime()
  const updatedList = await EntryService.index()
  const updatedLength = updatedList.length

  t.is(updatedList[updatedLength - 1].description, edited.entry, 'Description changed')
})

test.afterEach(t => inquirer.prompt = bkpInquirer)