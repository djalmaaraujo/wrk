import test from 'ava'
import CmdCreate from '../../commands/entry.create'
import inquirer from 'inquirer'
import EntryService from '../../services/entry.js'
import Cleanup from '../cleanup'

// Mock
const bkpInquirer = Object.create(inquirer.prompt)

test.beforeEach(t => {
  inquirer.prompt = (opts) => { return Promise.resolve({entry: 'My simple description'}) }
  EntryService.reset()
})

test.serial('Command Create', async t => {
  const initEntriesAmount = (await EntryService.index()).length

  t.true(initEntriesAmount > 0, 'At least one entry');

  await CmdCreate()

  const afterEntriesAmount = (await EntryService.index()).length

  t.deepEqual(initEntriesAmount + 1, afterEntriesAmount, 'New entry added successfully');
})

test.afterEach(t => {
  inquirer.prompt = bkpInquirer
})