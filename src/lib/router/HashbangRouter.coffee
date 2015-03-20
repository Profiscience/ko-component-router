pathUtil = require 'path'

###
HTML4 (hashbang) Router

@extend AbstractRouter
###
class HashbangRouter extends require('./lib/AbstractRouter')

  ###
  Constructs a new HashbangRouter

  @param _ko {Knockout} ko context
  @param routes {Object} routes in the form { '/path': 'foo' }
  @param basePath {String} basepath to begin routing from
  ###
  constructor: (_ko, routes, @_basePath) ->

    @_basePath = pathUtil.join('/', location.pathname, '/#!')
    path = location.hash.replace('#!', '') + location.search || '/'

    redirectUrl = pathUtil.join(@_basePath, path)

    if location.href.indexOf(redirectUrl) < 0

      if history.emulate
        # if the history API is being polyfilled replaceState
        # will not work as expected so we must reload the page
        # to get to the correct URL (IE users don't care about
        # UX, right?)
        location.replace(redirectUrl)

      else
        history.replaceState(history.state, document.title, redirectUrl)

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
    path.split('#!')[1] || '/'

module.exports = HashbangRouter