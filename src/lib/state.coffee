isFunction    = require 'lodash/lang/isFunction'
isPlainObject = require 'lodash/lang/isPlainObject'
objectsMatch  = require 'lodash/utility/matches'

_initialized = false
_state       = null
_currentUrl  = ''

###
Patch history.pushState and history.replaceState to update
ko.router.state

@private
###
_patchNativeHistoryMethods = ->

  history._nativePushState = history.pushState
  history.pushState = (state = {}, title, url) ->
    stateChanged = !objectsMatch(state)(_state() ? {})
    pathChanged  = _currentUrl != url

    history._nativePushState.apply(this, arguments)

    _state(state) if stateChanged || pathChanged
    _currentUrl = url

  history._nativeReplaceState = history.replaceState
  history.replaceState = (state = {}, title, url) ->
    stateChanged = !objectsMatch(state)(_state() ? {})
    pathChanged  = _currentUrl != url

    history._nativeReplaceState.apply(this, arguments)

    _state(state) if stateChanged || pathChanged
    _currentUrl = url

###
Update state when url is changed or browser back/forward

@private
###
_listenForExternalChanges = ->
  window.addEventListener 'popstate', ->
    _state(history.state)

###
Recursively remove functions from an object

@private
@param obj {Object} object to remove functions from
@return {Object} object w/o functions
###
_removeFuncs = (obj) ->
  objWithoutFuncs = {}

  for key, val of obj
    switch
      when isFunction    val then continue
      when isPlainObject val then objWithoutFuncs[key] = _removeFuncs val
      else objWithoutFuncs[key] = val

  return objWithoutFuncs

###
Update state

@private
@param state {Object} state object to write to ko.router.state
###
_writeState = (state) ->
  currentUrl = location.pathname + location.search + location.hash
  currentTitle = document.title

  currentUrl = currentUrl.split('#!')[1] if history.emulate

  history.replaceState(_removeFuncs(state), currentTitle, currentUrl)

###
Read state

@private
###
_getState = ->
  _state() ? {}

###
ko history.state abstraction

@example reading state
  ko.router.state()

@example writing state
  ko.router.state({ foo: 'bar' })

@example subscribing to state
  function handleStatechange(newState) {
    console.log(newState)
  }
  ko.router.state.subscribe(handleStatechange)
###
class KoRouterState

  ###
  Initializes state object

  @param _ko {Knockout} ko context
  @returns stateObs {Observable} observable `history.state` object
  ###
  constructor: (_ko) ->

    _state = _ko.observable(history.state)

    if !_initialized
      _patchNativeHistoryMethods()
      _listenForExternalChanges()
      _initialized = true

    stateObservable = _ko.pureComputed
      read:   _getState
      write:  _writeState

    return stateObservable

module.exports = KoRouterState