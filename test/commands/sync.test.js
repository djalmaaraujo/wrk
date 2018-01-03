import test from 'ava'
import CmdSync from '../../commands/sync'
import inquirer from 'inquirer'
import sinon from 'sinon'
import opn from '../../utils/opener'
import Sync from '../../services/sync'

// Mock
const bkpInquirer = Object.create(inquirer.prompt)

test.serial('Sync should open the browser with Github personal token URL if first answer is YES', async t => {
  inquirer.prompt = (opts) => Promise.resolve({answer: true})

  sinon.stub(opn, 'open')

  await CmdSync()

  t.truthy(opn.open.calledWith('https://github.com/settings/tokens/new'), 'Browser opened with Github New Token url')

  opn.open.restore()
})

test.serial('Should save the token in file when user input new token', async t => {
  inquirer.prompt = (opts) => Promise.resolve({
    answer: true,
    token: 'my-custom-token'
  })

  sinon.stub(opn, 'open') // prevent opening browser
  sinon.stub(Sync, 'setToken')

  await CmdSync()

  t.truthy(Sync.setToken.calledWith('my-custom-token'))

  opn.open.restore()
  Sync.setToken.restore()
})

test.afterEach(t => inquirer.prompt = bkpInquirer)