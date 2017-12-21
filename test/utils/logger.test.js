import chalk from 'chalk'
import test from 'ava'
import Logger from '../../utils/logger'

test('l existance', t => {
  t.truthy(Logger.l, 'l shortcut exists')
})

test('log existance', t => {
  t.truthy(Logger.log, 'log shortcut exists')
})

test('l', t => {
  t.deepEqual(Logger.l('message'), 'message', 'l shortcut prints what you pass')
})

test('blank', t => {
  t.deepEqual(Logger.blank(), '', 'blank returns an empty line')
})

test('docsNewEntry', t => {
  const expectedString = `${chalk.gray('Type:')} ${chalk.bold.yellow('wrk add')} ${chalk.gray('to add a new entry')}`

  t.deepEqual(Logger.docsNewEntry(), expectedString, 'docsNewEntry returns some default instructions on how to add a new entry')
})

test('default', t => {
  const expectedString = `${chalk.gray('OR')} ${chalk.bold.yellow('wrk')} ${chalk.yellow('-h')} ${chalk.gray('for all options.')}`

  t.deepEqual(Logger.default(), expectedString, 'default returns some default instructions about all options')
})

test('warning', t => {
  const expectedString = `${chalk.bold.red('[!]')} pay attention`

  t.deepEqual(Logger.warning('pay attention'), expectedString, 'warning returns a red exclamation + test')
})
