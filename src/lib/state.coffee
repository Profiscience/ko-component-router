ko            = require 'knockout'
isFunction    = require 'lodash/lang/isFunction'
isPlainObject = require 'lodash/lang/isPlainObject'

location = window.history?.location ? window.location

_initialized = false
_state = ko.observable(history.state)

###
Patch history.pushState and history.replaceState to update
ko.router.state

@private
###
_patchNativeMethods = ->

  history._nativePushState = history.pushState
  history.pushState = (state) ->
    history._nativePushState.apply(this, arguments)
    _state(state)

  history._nativeReplaceState = history.replaceState
  history.replaceState = (state) ->
    history._nativeReplaceState.apply(this, arguments)
    _state(state)

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
      when isPlainObject val then objWithoutFuncs[key] = @removeFuncs val
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

  history.replaceState(_removeFuncs(state), currentTitle, currentUrl)

###
Read state

@private
###
_getState = ->
  _state() ? {}

###
Initialize ko.router.state

@return state {Observable} observable state object
###
init = ->
  _patchNativeMethods()
  _listenForExternalChanges()

  ko.pureComputed
    read:  _state
    write: _writeState

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

  @returns stateObs {Observable} observable `history.state` object
  ###
  constructor: ->
    if !_initialized
      _patchNativeMethods()
      _listenForExternalChanges()
      _initialized = true

    stateObservable = ko.pureComputed
      read:   _getState
      write:  _writeState

    return stateObservable

module.exports = KoRouterState