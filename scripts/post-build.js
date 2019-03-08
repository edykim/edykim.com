const { copyPublic } = require('./copy-public')
const { copyStatic } = require('./copy-static')
const { collectRedirects } = require('./collect-redirects')

const cwd = process.cwd()

copyPublic(cwd)
copyStatic(cwd)
collectRedirects(cwd)
