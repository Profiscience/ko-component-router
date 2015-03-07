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

  @note checks for polyfilled History API, otherwise delegates to abstract
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

  @note checks for polyfilled History API, otherwise delegates to abstract
  @see https://github.com/devote/HTML5-History-API

  @param path {String}
  ###
  _replaceState: (path) ->
    if history.emulate
      history.replaceState(history.state, document.title, path)
    else
      super

  ###
  Handles 'click' events

  @note patches context menu so open in new tab/window work as expected
  @note patches shift/ctrl + click for the same reason
  @param e {ClickEvent}
  ###
  _onClick: (e) =>
    return if @_ignoreClick(e)

    path = @_getFullPath(e.target)
    path.replace(@_basePath, '')

    if e.metaKey || e.ctrlKey || e.shiftKey
      e.preventDefault()
      hashbangURL = pathUtil.join('/', @_basePath, '/#!', path)
      target = if e.metaKey || e.ctrlKey then null else '_blank'

      window.open(hashbangURL, target)
      return

    e.preventDefault()
    @show(path)

  ###
  Strips a path of the configured base

  @param path {String}
  @return {String}
  ###
  _stripBasePath: (path) ->
    path.split('#!')[1]

  ###
  Gets the current path from the URL

  @return {String}
  ###
  _getCurrentPath: ->
    path = super
    path.split('#!')[1]

  ###
  Handle 'contextmenu' (right-click menu) events
  # ###
  # _onContextMenu: (e) ->
  #   return if e.defaultPrevented

  #   el = e.target
  #   @_patchContextMenu(el) if @_isLink(el)

  # ###
  # Ensure that context menu options like 'open in new tab/window'
  # work correctly
  # ###
  # _patchContextMenu: (el) ->
  #   return if el.hasAttribute('data-orig-href')

  #   orig = el.getAttribute('href')

  #   path = @_getFullPath(el)
  #           .replace(@_basePath, '')
  #           .replace('#!', '')

  #   hashbangUrl = @_basePath + '#!' + path

  #   el.setAttribute('data-orig-href', orig)
  #   el.setAttribute('href', hashbangUrl)

  #   revertPatch = @_revertContextMenuPatch.bind(this, el)
  #   window.addEventListener('click', revertPatch)

  ###
  Undo context menu patch when context menu is closed
  ###
  # _revertContextMenuPatch: (el) ->
  #   orig = el.getAttribute('data-orig-href')

  #   el.setAttribute('href', orig)
  #   el.removeAttribute('data-orig-href')

  #   window.removeEventListener('click', @_revertContextMenuPatch)

module.exports = HashbangRouter