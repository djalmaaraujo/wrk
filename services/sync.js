const fs = require('fs')
const path = require('path')
const userHome = require('user-home')

module.exports = {
  async getToken() {
    const filePath = path.join(userHome, `.wrklogger${process.env.NODE_ENV}`)

    return new Promise((res, rej) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) rej(err)

        res(data)
      })
    })
  }
}