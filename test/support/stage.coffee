ko = require 'knockout'
$  = require 'jquery'

ko.components.register 'placeholder',
  template: '<span id="placeholder"></span>'

_createDOM = ->
  $('body').append "
    <div id='test-stage'>
      <ko-component-router params='routes: routes'>
      </ko-component-router>
    </div>
  "

_bindRouterParams = (routes) ->
  routes['/test'] = 'placeholder'

  ko.applyBindings
    routes: routes
  , document.getElementById 'test-stage'

_destroyViewModel = ->
  el = document.getElementById 'test-stage'

  return if !el
  ko.cleanNode el

_destroyDOM = ->
  $('#test-stage').remove()

module.exports =

  class Stage

    @init: (routes) ->
      @destroy()

      _createDOM()
      _bindRouterParams(routes)

    @destroy: ->
      _destroyViewModel()
      _destroyDOM()