pathUtil = require 'path'

location = window.history?.location ? window.location
history  = window.history

###
HTML5 (pushstate) Router

@extend AbstractRouter
###
class PushstateRouter extends require('./lib/AbstractRouter')

  ###
  Constructs a new PushstateRouter

  @param _ko {Knockout} ko context
  @param routes {Obj} routes in the form { '/path': 'component' }
  @param basePath {String} basepath to route from
  ###
  constructor: (_ko, routes, @_basePath = '') ->

    if @_basePath != ''
      @_basePath = pathUtil.join('/', @_basePath).replace('\/$', '')

    super

  ###
  Gets the current path from the URL

  @return {String} path
  ###
  _getPathFromUrl: ->
    path = super
    if @_basePath != '' then path.split(@_basePath)[1] ? path else path

module.exports = PushstateRouter