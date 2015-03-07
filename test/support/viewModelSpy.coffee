{ expect } = require 'chai'
sinon      = require 'sinon'

module.exports =

  create: (extend = class Foo) ->
    ns = ViewModel: class ViewModel extends extend
    sinon.spy ns, 'ViewModel'

  whenInitialized: (spy, assertions) ->
    interval = setInterval ->
      if spy.calledWithNew
        clearInterval interval
        assertions()
    , 10

  expectToInitialize: (spy, next) ->
    @whenInitialized spy, ->
      expect(spy.calledWithNew).to.be.true
      next()