import $ from 'jquery'
import ko from 'knockout'
import tape from 'tape'

import Router from '../dist/modules'

import './anchor'
import './binding'
import './routing'
import './middleware'
import './before-navigate-callbacks'
import './element'
import './passthrough'
import './plugins'
import './issues'

const tests = [
  'routing',
  'anchor',
  'binding',
  'middleware',
  'before-navigate-callbacks',
  'element',
  'passthrough',
  'plugins',
  'issues'
]

class Test {
  constructor() {
    this.test = ko.observable()

    $('body').append(`
      <div data-bind="if: test">
        <div id="test-container" data-bind="component: {
            name: test,
            params: { t: t, next: next }
        }"></div>
      </div>
    `)

    const runner = this.runTests()
    this.next = runner.next.bind(runner)
    this.next()
  }

  * async runTests() {
    for (const test of tests) {
      const t = await this.runTest(test)
      yield t
      t.end()
    }
  }

  runTest(test) {
    Router.config = { base: '', hashbang: false }
    Router.middleware = []
    Router.plugins = []
    Router.routes = {}

    return new Promise((resolve) =>
      tape(test, (t) => {
        this.t = t
        this.test(test)
        resolve(t)
      }))
  }
}

$(() => ko.applyBindings(new Test()))
