import ko from 'knockout'

ko.components.register('nested', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class {
    constructor({ t, next: _next }) {
      t.pass('navigates to route with children')

      const runner = this.runTests(_next)
      const next = runner.next.bind(runner)

      this.routes = {
        '/a': 'a',
        '/b': 'b',
        '/c': 'c',
        '/': { // https://www.youtube.com/watch?v=5l-PjIqPOBw
          '/d': 'd'
        }
      }

      const hLen = history.length

      // this should be the initial call, and is responsible for calling
      // `next()` to start the test runner
      ko.components.register('a', {
        template: '<div></div>',
        viewModel() {
          t.pass('initializes nested route')
          t.equals(hLen, history.length, 'child route does not add history entry')
          next()
        }
      })

      ko.components.register('b', {
        template: '<div></div>',
        viewModel() {
          t.pass('navigates to new child route from parent router')
          next()
        }
      })

      ko.components.register('c', {
        template: '<div></div>',
        viewModel() {
          t.pass('navigates to new child route from child router')
          next()
        }
      })

      ko.components.register('d', {
        template: '<div></div>',
        viewModel() {
          t.pass('nested router shorthand works')
          next()
        }
      })
    }

    * async runTests(next) {
      yield ko.router.update('/nested/b')
      yield ko.router.$child.update('/c')
      const p = ko.router.$child.update('/d')
      yield p
      next()
    }

    dispose() {
      ko.components.unregister('a')
      ko.components.unregister('b')
      ko.components.unregister('c')
      ko.components.unregister('d')
      ko.components.unregister('nested')
    }
  }
})

export default { '/nested/!': 'nested' }
