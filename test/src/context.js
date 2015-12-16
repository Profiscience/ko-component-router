'use strict'

const test = require('tape')
const Context = require('../../src/context')
const Route = require('../../src/route')

function runTests(config) {
  test('ctx initialization', (t) => {
    t.plan(7)
    t.comment(`using config: ${JSON.stringify(config)}`)
    stubPushState()

    const ctx = new Context(config)
    const route = new Route('/test/:foo', 'test')
    const state = { bar: 'bar' }

    ctx.update(route, config.base + '/test/foo#hash', state, true)

    t.equal(ctx.route(), route, 'sets route')
    t.equal(ctx.component(), 'test', 'sets component')
    t.deepEqual(ctx.state(), state, 'sets state')
    t.equal(ctx.canonicalPath(), config.base + (config.hashbang ? '/#!' : '') + '/test/foo#hash', 'sets canonicalPath')
    t.equal(ctx.path(), '/test/foo', 'sets path')
    t.equal(ctx.hash(), 'hash', 'sets hash')
    t.equal(ctx.params.foo(), 'foo', 'sets params')
    // t.equal(ctx.query(), { baz: 'qux', num: 1, arr: [1, 2, 3] }, 'sets query')
    restorePushState()
  })

  test('ctx.params should be writable', (t) => {
    t.plan(1)
    stubPushState()
    const _replaceState = history.replaceState
    const ctx = new Context(config)
    const route = new Route('/:foo', 'foo')

    history.replaceState = function stub(state, title, url) {
      t.equal(url, config.base + (config.hashbang ? '/#!' : '') + '/bar', 'updates url')
    }

    ctx.update(route, '/foo')
    ctx.params.foo('bar')

    history.replaceState = _replaceState
    restorePushState()
  })

  test('ctx.dispose should be ok', (t) => {
    t.plan(1)
    stubPushState()
    const ctx = new Context(config)
    const route = new Route('/:foo', 'foo')

    ctx.update(route, '/foo')
    ctx.dispose()
    t.pass()
    restorePushState()
  })
}

runTests({ base: '', hashbang: false })
runTests({ base: '', hashbang: true })
runTests({ base: '/base', hashbang: false })
runTests({ base: '/base', hashbang: true })

const _pushState = history.pushState
function stubPushState() {
  history.pushState = function() {}
}
function restorePushState() {
  history.pushState = _pushState
}
