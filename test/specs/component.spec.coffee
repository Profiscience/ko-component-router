ko = require 'knockout'
component = require '../../src/main'

{ expect } = require 'chai'

stage    = require '../support/stage'
tc       = require '../support/testComponents'
VMSpy    = require '../support/viewModelSpy'

stateSpecs = require './state.spec'

module.exports = ->

  spies = {}

  before ->

    spies =
      init:   VMSpy.create()
      params: VMSpy.create()

    routes =
      '/init':             tc.register(ko, spies.init, '<span id="init-comp"></span')
      '/params/:foo/:bar': tc.register(ko, spies.params)

    history.pushState({}, null, '/#!/init')
    component.start(ko, routes)
    stage.init(ko, routes)

  after ->
    tc.unregister(ko)
    stage.destroy(ko)

  it 'should load the correct viewmodel', (next) ->
    VMSpy.expectToInitialize spies.init, next

  it 'should load the correct template', ->
    el = document.getElementById('init-comp')
    expect(el).to.exist

  it 'should be called only once', ->
    expect(spies.init.calledOnce).to.be.true

  it 'should pass in the correct params', (next) ->
    ko.router.show '/params/foo/bar/'

    VMSpy.whenInitialized spies.params, ->
      expect(spies.params.calledWith foo: 'foo', bar: 'bar').to.be.true
      next()