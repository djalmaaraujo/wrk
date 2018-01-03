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

test.serial('#userFilePath', t => {
  const uHome = path.join(userHome, `.wrklogger${process.env.NODE_ENV}`)

  t.deepEqual(Sync.userFilePath(), uHome, 'Returns user file config path')
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

test.serial('#setToken writes a token into the .wrklogger user path file', async t => {
  t.falsy(await Sync.getToken(), 'Token is null at first')

  await Sync.setToken('18273918273981723')
  t.deepEqual('18273918273981723', await Sync.getToken(), 'New token is set to file');

  await Sync.setToken('aysiduya18azxlz9231')
  t.deepEqual('aysiduya18azxlz9231', await Sync.getToken(), 'New token is set to file');
})