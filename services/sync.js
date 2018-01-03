const fs = require('fs')
const path = require('path')
const userHome = require('user-home')

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
  }
}