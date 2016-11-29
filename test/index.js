import $ from 'jquery'
import ko from 'knockout'
import tape from 'tape'

import '../src'

import './anchor'
import './routing'
import './middleware'
import './before-navigate-callbacks'
import './element'
import './passthrough'

const tests = [
  'routing',
  'anchor',
  'middleware',
  'before-navigate-callbacks',
  'element',
  'passthrough'
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
    return new Promise((resolve) =>
      tape(test, (t) => {
        this.t = t
        this.test(test)
        resolve(t)
      }))
  }
}

$(() => ko.applyBindings(new Test()))
