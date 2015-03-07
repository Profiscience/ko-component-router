PushstateRouter = require '../../../src/lib/router/PushstateRouter'
routerSpecs     = require './router.spec'

module.exports = (basePath = '') ->

  routerSpecs(PushstateRouter, basePath)