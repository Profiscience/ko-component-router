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

  @param routes {Obj} routes in the form { '/path': 'component' }
  @param basePath {String} basepath to route from
  ###
  constructor: (routes, @_basePath = '') ->

    if @_basePath != ''
      @_basePath = pathUtil.join('/', @_basePath).replace('\/$', '')

    super

  ###
  Handles click events

  @param e {ClickEvent}
  ###
  _onClick: (e) =>
    return if @_ignoreClick(e) || e.metaKey || e.ctrlKey || e.shiftKey

    path = @_getFullPath(e.target)

    e.preventDefault()
    @show(path)

  ###
  Gets the current path from the URL

  @return {String} path
  ###
  _getCurrentPath: ->
    path = super
    if @_basePath != '' then path.split(@_basePath)[1] ? path else path

module.exports = PushstateRouter