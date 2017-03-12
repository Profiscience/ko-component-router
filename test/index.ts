import ko from 'knockout'
import tape, { Test } from 'tape'

import './helpers/empty-template-loader'
import './helpers/tape-browser-reporter'

import Router from '../src'

// import './anchor'
// import './binding'
// import './routing'
// import './history'
// import './force-update'
// import './with'
// import './middleware'
// import './queue'
// import './before-navigate-callbacks'
// import './element'
// import './passthrough'
// import './plugins'
// import './issues'

const tests = [
  'routing',
  // 'history',
  // 'force-update',
  // 'with',
  // 'anchor',
  // 'binding',
  // 'middleware',
  // 'queue',
  // 'before-navigate-callbacks',
  // 'element',
  // 'passthrough',
  // 'plugins',
  // 'issues'
]


class TestRunner {
  test: KnockoutObservable<string>
  t: Test
  next: Function

  constructor() {
    this.test = ko.observable(null)
    this.runTests()
  }

  async runTests() {
    for (const test of tests) {
      await this.runTest(test)
    }
  }

  async runTest(test) {
    // reset defaults
    // Router.config = { base: '', hashbang: false, activePathCSSClass: 'active-path' }
    // Router.middleware = []
    // Router.plugins = []
    // Router.routes = {}

    return await new Promise((resolve) =>
      tape(test, (t) => {
        this.t = t
        this.next = resolve
        this.test(test)
      }))
  }
}

ko.applyBindings(new TestRunner())
