import ko from 'knockout'
import tape from 'tape'

import Router from '../dist/modules'

import './helpers/tape-browser-reporter'
import './helpers/error-reporter'
import './helpers/rebuild-reloader'
import './helpers/ko-overwrite-component-registration'

import './anchor'
import './binding'
import './routing'
import './history'
import './force-update'
import './with'
// import './middleware'
import './queue'
import './before-navigate-callbacks'
import './element'
import './plugins'
// import './issues'

const tests = [
  'routing',
  'history',
  'force-update',
  'with',
  'anchor',
  'binding',
  // 'middleware',
  // 'queue',
  'before-navigate-callbacks',
  'element',
  'plugins',
  // 'issues'
]

class TestRunner {
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
    history.pushState(null, null, '/')
    
    return await new Promise((resolve) =>
      tape(test, (t) => {
        this.t = t
        this.done = () => {
          t.end()
          resolve()
        }
        this.test(test)
      }))
  }
}

ko.applyBindings(new TestRunner())
