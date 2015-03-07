ko = require 'knockout'

HashbangRouter  = require '../router/HashbangRouter'
PushstateRouter = require '../router/PushstateRouter'

###
Viewmodel class for <ko-component-router>

@private
###
class KoComponentRouterViewModel

  ###
  Constructs a new viewmodel

  @param params {Object} component params
  @option routes {Object} routes in the format { '/path': 'component-name' }
  @option options {Object} router options { HTML5: false, basePath: '/' }
  ###
  constructor: ({ routes, options }) ->

    HTML5    = options?.HTML5 ? false
    basePath = options?.basePath ? ''

    Router    = if HTML5 then PushstateRouter else HashbangRouter
    ko.router = new Router(routes, basePath)

    { @component, @routeParams } = ko.router.current

  ###
  ko `dispose` callback to destroy bindings and subscriptions

  @note called automatically when a component is destroyed
  ###
  dispose: ->
    ko.router._stop()

module.exports = KoComponentRouterViewModel