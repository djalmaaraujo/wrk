const fs = require('fs')
const path = require('path')
const userHome = require('user-home')
const GitHubApi = require('github')
const github = new GitHubApi()

module.exports = {
  userFilePath() {
    return path.join(userHome, `.wrklogger${process.env.NODE_ENV}`)
  },

  async getToken() {
    return new Promise((res, rej) => {
      fs.readFile(this.userFilePath(), 'utf8', (err, data) => {
        if (err) rej(err)

        res(data)
      })
    })
  },

  async setToken(token) {
    return new Promise((res, rej) => fs.writeFile(this.userFilePath(), token || '', res))
  },

  async checkToken(ghInstance = false) {
    const gh = (ghInstance) ? ghInstance : github

    gh.authenticate({
      type: 'token',
      token: await this.getToken()
    })

    return new Promise((res, rej) => {
      gh.users.get({}, (err, response) => {
        if (err) rej(new TypeError(err.code))

        res(true)
      })
    })
  }
}