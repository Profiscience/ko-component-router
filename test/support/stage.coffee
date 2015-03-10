$  = require 'jquery'

_createDOM = ->
  $('body').append "
    <div id='test-stage'>
      <ko-component-router params='routes: routes'>
      </ko-component-router>
    </div>
  "

_bindRouterParams = (context, routes) ->
  routes['/test'] = 'placeholder'

  context.components.register 'placeholder',
    template: '<span id="placeholder"></span>'

  context.applyBindings
    routes: routes
  , document.getElementById 'test-stage'

_destroyViewModel = (context) ->
  el = document.getElementById 'test-stage'

  context.components.unregister 'placeholder'

  return if !el
  context.cleanNode el

_destroyDOM = ->
  $('#test-stage').remove()

module.exports =

  class Stage

    @init: (_ko, routes) ->
      @destroy(_ko)

      _createDOM()
      _bindRouterParams(_ko, routes)

    @destroy: (_ko) ->
      _destroyViewModel(_ko)
      _destroyDOM()