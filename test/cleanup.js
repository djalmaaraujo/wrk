const { spawn } = require('child_process')
const path = require('path')

const tmpPath = path.resolve(__dirname, 'tmp/')

spawn('rm', ['-rf', tmpPath, '*'])
spawn('mkdir', [tmpPath])
