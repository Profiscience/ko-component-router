pathUtil = require 'path'

location = window.history?.location ? window.location
history  = window.history

###
HTML4 (hashbang) Router

@extend AbstractRouter
###
class HashbangRouter extends require('./lib/AbstractRouter')

  ###
  Constructs a new HashbangRouter

  @param routes {Object} routes in the form { '/path': 'foo' }
  @param basePath {String} basepath to begin routing from
  ###
  constructor: (routes, @_basePath) ->
    
    @_basePath ?= location.pathname
    @_basePath = pathUtil.join('/', @_basePath, '/#!')

    path = (location.pathname + location.search + location.hash).replace()
    path = path.replace(new RegExp("^#{@_basePath}"), '')

    redirectUrl = pathUtil.join('/', @_basePath, path)

    if location.href.indexOf(redirectUrl) < 0

      if history.emulate
        # if the history API is being polyfilled replaceState
        # will not work as expected so we must reload the page
        # to get to the correct URL (IE users don't care about
        # UX, right?)
        location.replace(redirectUrl)

      else
        history.replaceState(history.state, document.title, redirectUrl)

    # window.addEventListener('contextmenu', @_onContextMenu)

    super

  ###
  Changes URL, clears state, and add history entry

  @note checks for polyfilled History API (which inserts hash automatically)
    otherwise delegates to abstract
  
  @see https://github.com/devote/HTML5-History-API

  @param path {String}
  ###
  _pushState: (path) ->
    if history.emulate
      history.pushState({}, document.title, path)
    else
      super

  ###
  Changes URL, clears state

  @note checks for polyfilled History API (which inserts hash automatically)
    otherwise delegates to abstract

  @see https://github.com/devote/HTML5-History-API

  @param path {String}
  ###
  _replaceState: (path) ->
    if history.emulate
      history.replaceState(history.state, document.title, path)
    else
      super

  ###
  Gets the current path from the URL

  @return {String}
  ###
  _getPathFromUrl: ->
    path = super
    path.split('#!')[1]

module.exports = HashbangRouter