ko         = require 'knockout'
sinon      = require 'sinon'
{ expect } = require 'chai'

State = require '../../src/lib/state'

module.exports = (opts = {}) ->

  state = null

  before ->
    state = new State(ko)

  it 'should be readable', ->
    expect(state()).to.be.ok

  it 'should be writeable', ->
    state(foo: 'bar')
    expect(state()).to.deep.equal(foo: 'bar')

  it 'should be subscribeable', ->
    spy = sinon.spy(sinon.stub())
    sub = state.subscribe(spy)
    state(baz: 'qux')
    expect(spy.calledWith(baz: 'qux')).to.be.true
    sub.dispose()

  it 'should update on pushstate', ->
    history.pushState(pushState: true, null, '/test')
    expect(state()).to.deep.equal(pushState: true)

  it 'should update on replacestate', ->
    history.replaceState(replaceState: true, null, '/test')
    expect(state()).to.deep.equal(replaceState: true)

  it 'should update on popstate', (next) ->
    performAssertions = ->
      window.removeEventListener('popstate', performAssertions)
      expect(state()).to.deep.equal(popstate: true)
      next()

    window.addEventListener('popstate', performAssertions)

    history._nativePushState(popstate: true, null, '/test')
    history._nativePushState({}, null, '/test')
    history.back()


