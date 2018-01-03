// Dependencies
import test from 'ava'
import is from '@sindresorhus/is'
import Sync from '../../services/sync'
import userHome from 'user-home'
import fs from 'fs'
import path from 'path'

const setTokenFile = async (token) => {
  const filePath = path.join(userHome, `.wrklogger${process.env.NODE_ENV}`)

  return new Promise((res, rej) => {
    fs.writeFile(filePath, token || '', res)
  })
}

test.beforeEach(t => setTokenFile())

// Tests
test('Sync service exists', async t => {
  t.truthy(is.object(Sync), 'Sync is an object')
})

test.serial('#getToken returns token from .wrklogger user path file', async t => {
  let token;

  token = await Sync.getToken()
  t.falsy(token, 'Token is null at first')

  await setTokenFile('123456')
  token = await Sync.getToken()

  t.deepEqual('123456', token, 'Token comes from user home dir');

  await setTokenFile('654321')
  token = await Sync.getToken()

  t.deepEqual('654321', token, 'Token comes from user home dir');
})