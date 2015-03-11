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

  @param _ko {Knockout} ko context
  @param routes {Object} routes in the for { '/path': 'component' }
  @return {Router} new router instance
  ###
  constructor: (_ko, routes) ->
    @state = new State(_ko)

    @_routes = []
    @_routes.push(new Route(path, component)) for path, component of routes

    @current = _ko.observable({})

    window.addEventListener('click', @_onClick)
    window.addEventListener('contextmenu', @_onContextMenu)
    _stateSubscriptionReference = @state.subscribe(@_onStateChange)

    path = @_getPathFromUrl()

    @redirect(path)

  ###
  Navigate to the given `path`

  @note `path` should not include base path
  @note clears the state

  @param path {String} path to navigate to
  @return {Boolean} route was handled
  ###
  show: (path) ->
    return false if !@_getComponentAndParamsForPath(path)?
    @_changePage(path)
    @_pushState(path)
    return true

  ###
  Redirects to the given `path`

  @note `path` should not include base path
  @note clears the state

  @param path {String} path to navigate to
  @return {Boolean} route was handled
  ###
  redirect: (path) ->
    return false if !@_getComponentAndParamsForPath(path)?
    @_changePage(path)
    @_replaceState(path)
    return true

  ###
  Disposes of event listeners and subscriptions,
  killing the router

  @private
  ###
  _stop: ->
    window.removeEventListener('click', @_onClick)
    window.removeEventListener('contextmenu', @_onContextMenu)
    _stateSubscriptionReference.dispose()


  ###
  Handles statechange (as abstracted by ko.router.state)

  @private
  ###
  _onStateChange: =>
    path = @_getPathFromUrl()
    @redirect(path)

  ###
  Handles click events

  @private
  @note patches shift/ctrl + click to work with base paths
  @note if route isn't found, the event is passed to the browser
  @param e {ClickEvent}
  ###
  _onClick: (e) =>
    el = @_getParentAnchor(e.target)

    return if @_ignoreClick(e, el)

    path = @_getPathFromAnchor(el)

    if e.metaKey || e.ctrlKey || e.shiftKey
      e.preventDefault()
      target = if e.metaKey || e.ctrlKey then null else '_blank'

      window.open(@_basePath + path, target)
      return

    e.preventDefault() if @show(path)

  ###
  Finds the most specific matching route and sets the `current` properties

  @private
  @param path {String} path to set page
  @return {Boolean} whether or not the route was handled
  ###
  _changePage: (path) ->
    match = @_getComponentAndParamsForPath(path)
    match.path = path

    @current(match)

  ###
  Matches a path to a component

  @private
  @param path {String} path to match
  @return {Object} route component and params
  ###
  _getComponentAndParamsForPath: (path) ->
    params = {}

    matchedRoutes = []
    matchedRoutes.push(route) for route in @_routes when route.matches(path)

    return if matchedRoutes.length == 0

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

    return component: component, routeParams: params

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
  @param el {DOMElement} anchor element clicked
  @return {Boolean} click should be ignored
  ###
  _ignoreClick: ({ detail, defaultPrevented }, el) ->
    path = @_getPathFromAnchor(el)
    return true if !@_getComponentAndParamsForPath(path)?

    detail == 2                                      ||
    defaultPrevented                                 ||
    !@_isLink(el)                                    ||
    el.getAttribute('download')                      ||
    el.getAttribute('rel') == 'external'             ||
    el.pathname == @current().path                   ||
    el.getAttribute('href').indexOf('mailto:') > -1  ||
    el.target                                        ||
    !@_sameOrigin(el.href)

  ###
  Gets the parent link of an element

  @private
  @param el {DOMElement}
  @return {DOMElement} parent anchor
  ###
  _getParentAnchor: (el) ->
    el = el.parentNode while el && 'A' != el.nodeName
    return el

  ###
  Check to see if `el` is a link

  @private
  @param el {DOMElement}
  @return {Boolean} `el` is link
  ###
  _isLink: (el) ->
    el = @_getParentAnchor(el)
    el && 'A' == el.nodeName

  ###
  Gets the current path from the URL

  @private
  @abstract
  @return {String} current path
  ###
  _getPathFromUrl: ->
    location.pathname + location.search + location.hash

  ###
  Get the full (absolute) path for `el`

  @private
  @param el {DOMElement}
  @return {String} full path
  ###
  _getPathFromAnchor: (el) ->
    href = el.getAttribute('href')

    path =
      switch
        when href[0] == '/'
          el.pathname
        when href == '..'
          pathUtil.resolve(@current().path, href)
        else
          pathUtil.resolve(@current().path, "../#{href}")

    path + el.search + (el.hash || '')
    path.replace(@_basePath, '')

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

  ###
  Handle 'contextmenu' (right-click) events

  @private
  @param e {ContextMenuEvent}
  ###
  _onContextMenu: (e) =>
    el = @_getParentAnchor(e.target)
    return if @_ignoreClick(e, el)
    @_patchContextMenu(el)

  ###
  Ensure that context menu options like 'open in new tab/window'
  work correctly

  @private
  @param el {DOMElement}
  ###
  _patchContextMenu: (el) ->
    return if el.hasAttribute('data-orig-href')

    orig = el.getAttribute('href')
    path = @_getPathFromAnchor(el)

    url = @_basePath + path

    el.setAttribute('data-orig-href', orig)
    el.setAttribute('href', url)

    revertPatch = @_revertContextMenuPatch.bind(this, el)
    window.addEventListener('click', revertPatch)

  ###
  Reverts context menu patch when context menu is closed

  @private
  @param el {DOMElement}
  ###
  _revertContextMenuPatch: (el) ->
    orig = el.getAttribute('data-orig-href')

    el.setAttribute('href', orig)
    el.removeAttribute('data-orig-href')

    window.removeEventListener('click', @_revertContextMenuPatch)

module.exports = AbstractRouter