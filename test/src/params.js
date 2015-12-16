'use strict'

const test = require('tape')
const Context = require('../../src/context')
const Route = require('../../src/route')

test('params', (t) => {
  t.plan(3)
  const ctx = new Context({ base: '', hashbang: false })
  const route = new Route('/:foo', 'foo')

  ctx.update(route, '/foo')
  ctx.update = function(route, url, state, push) {
    t.equal(url, '/bar', 'should set url')
    t.equals(push, false, 'uses history.replaceState')
    ctx.params.unsubscribe()
    t.pass('unsubscribe is ok')
  }

  ctx.params.foo('bar')
})
