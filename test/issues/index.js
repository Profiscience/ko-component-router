import ko from 'knockout'

import './127'

const issues = [
  '127'
]


ko.components.register('issues', {
  template: `
    <div data-bind="if: test">
      <div data-bind="component: {
          name: test,
          params: { t: t, next: next }
      }"></div>
    </div>
  `,
  viewModel: class IssuesTestSuite {
    constructor({ t, next: _next }) {
      this.test = ko.observable()
      const runner = this.runTests(t, _next)
      this.next = runner.next.bind(runner)
      this.next()
    }

    * async runTests(t, next) {
      for (const issue of issues) {
        const _t = await this.runTest(t, issue)
        yield _t
        _t.end()
      }
      next()
    }

    runTest(tape, test) {
      return new Promise((resolve) =>
        tape.test(test, (t) => {
          this.t = t
          this.test(test)
          resolve(t)
        }))
    }
  }
})
