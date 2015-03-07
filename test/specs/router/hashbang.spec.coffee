HashbangRouter = require '../../../src/lib/router/HashbangRouter'
routerSpecs    = require './router.spec'

module.exports = (basePath = '') ->

  routerSpecs(HashbangRouter, basePath + '/#!')