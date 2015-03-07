ko       = require 'knockout'
pathUtil = require 'path'

location = window.history?.location ? window.location

Route = require './Route'
State = require '../../state'

_stateSubscriptionReference = null

###
Base router class

@abstract
@param routes {Object} routes in the form { '/path': 'component' }
###
class AbstractRouter

  ###
  Initializes a new router

  @param routes {Object} routes in the for { '/path': 'component' }
  @return {Router} new router instance
  ###
  constructor: (routes) ->
    @state = new State

    @_routes = []
    @_routes.push(new Route(path, component)) for path, component of routes

    @current = {}
    @current[prop] = ko.observable() for prop in ['path', 'component', 'routeParams']

    window.addEventListener('click', @_onClick)
    _stateSubscriptionReference = @state.subscribe(@_onStateChange)

    path = @_getCurrentPath()

    @redirect(path)

  ###
  Navigate to the given `path`

  @note `path` should not include base path
  @note clears the state
  @param path {String} path to navigate to
  ###
  show: (path) ->
    @_changePage(path)
    @_pushState(path)

  ###
  Redirects to the given `path`

  @note `path` should not include base path
  @note clears the state
  @param path {String} path to navigate to
  ###
  redirect: (path) ->
    @_changePage(path)
    @_replaceState(path)

  ###
  Disposes of event listeners and subscriptions,
  killing the router

  @private
  ###
  _stop: ->
    window.removeEventListener('click', @_onClick)
    _stateSubscriptionReference.dispose()


  ###
  Handles statechange (as abstracted by ko.router.state)

  @private
  ###
  _onStateChange: =>
    path = @_getCurrentPath()
    @redirect(path)

  ###
  Finds the most specific matching route and sets the `current` properties

  @private
  @param path {String} path to set page
  @return {Boolean} whether or not the route was handled
  ###
  _changePage: (path) ->
    params = {}

    matchedRoutes = []
    matchedRoutes.push(route) for route in @_routes when route.matches(path)

    return false if matchedRoutes.length == 0

    fewestDynamicSegments = Infinity
    component = null
    params    = null

    for route, i in matchedRoutes
      _p = route.params(path)
      numDynamicSegments = Object.keys(_p).length

      if numDynamicSegments < fewestDynamicSegments
        fewestDynamicSegments = numDynamicSegments

        component = route.component
        params = _p

        break if numDynamicSegments == 0

    @current.path(path)
    @current.component(component)
    @current.routeParams(params)

    return true

  ###
  Writes the URL, clears the state, and adds a history entry

  @private
  @note prefixes URL with base path
  @param path {String} path to write
  ###
  _pushState: (path) ->
    history.pushState({}, document.title, @_basePath + path)

  ###
  Writes the URL and clears the state

  @private
  @note prefixes URL with base path
  @param path {String} path to write
  ###
  _replaceState: (path) ->
    history.replaceState({}, document.title, @_basePath + path)

  ###
  Determines if a click should not be handled by the router

  @private
  @param event {ClickEvent}
  @return {Boolean} click should be ignored
  ###
  _ignoreClick: ({ target: el, detail, defaultPrevented}) ->
    detail == 2                                      ||
    defaultPrevented                                 ||
    !@_isLink(el)                                    ||
    el.getAttribute('download')                      ||
    el.getAttribute('rel') == 'external'             ||
    el.pathname == @current.path()          ||
    el.getAttribute('href').indexOf('mailto:') > -1  ||
    el.target                                        ||
    !@_sameOrigin(el.href)

  ###
  Check to see if `el` is a link

  @private
  @param el {DOMElement}
  @return {Boolean} `el` is link
  ###
  _isLink: (el) ->
    el = el.parentNode while el && 'A' != el.nodeName
    el && 'A' == el.nodeName

  ###
  Gets the current path

  @private
  @abstract
  @return {String} current path
  ###
  _getCurrentPath: ->
    location.pathname + location.search + location.hash

  ###
  Get the full (absolute) path for an anchor

  @private
  @param el {DOMElement}
  @return {String} full path
  ###
  _getFullPath: (el) ->
    href = el.getAttribute('href')

    path =
      if href[0] == '/'
        el.pathname
      else if href == '..'
        pathUtil.resolve(@current.path(), href)
      else
        pathUtil.resolve(@current.path(), "../#{href}")

    path + el.search + (el.hash || '')

  ###
  Determines if `href` is on the same origin

  @private
  @param href {String}
  @return {Boolan} is same origin
  ###
  _sameOrigin: (href) ->
    origin = location.protocol + '//' + location.hostname
    if (location.port) then origin += ':' + location.port
    (href && (0 == href.indexOf(origin)))

module.exports = AbstractRouter