// Dependencies
import test from 'ava'
import is from '@sindresorhus/is'
import Sync from '../../services/sync'
import userHome from 'user-home'
import fs from 'fs'
import path from 'path'
import sinon from 'sinon'
import GitHubApi from 'github'

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

test.serial('#checkToken throws an error if no token is found', async t => {
  await Sync.setToken()

  const error = await t.throws(Sync.checkToken())
  t.is(error.message, 'Token authentication requires a token to be set')
})

test.serial('#checkToken returns falsy for what ever token is', async t => {
  await Sync.setToken('XXX')

  const error = await t.throws(Sync.checkToken());

  t.is(error.message, '401')
})

test.serial('#checkToken returns true for a valid token', async t => {
  await Sync.setToken('XXX')

  const github = new GitHubApi()
  const ghBkp = Object.create(github.users)
  github.users = { get(x,cb) { return cb(null, {status: 200}) } }

  t.truthy(await Sync.checkToken(github), 'Token is valid')

  github.users = ghBkp
})