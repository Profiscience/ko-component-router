import ko from 'knockout'
import Router from '../../dist/modules'

ko.components.register('nested', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class NestedRoutingTest {
    constructor({ t, next: _next }) {
      t.pass('navigates to route with children')

      const runner = this.runTests(_next)
      const next = runner.next.bind(runner)

      this.routes = {
        '/a': 'a',
        '/b': 'b',
        '/c': 'c',
        '/d': { // https://www.youtube.com/watch?v=5l-PjIqPOBw
          '/e': 'e'
        },
        '/f': [
          'f',
          {
            '/g': 'g'
          }
        ]
      }

      const hLen = history.length

      // this should be the initial call, and is responsible for calling
      // `next()` to start the test runner
      ko.components.register('a', {
        viewModel() {
          t.pass('initializes nested route')
          t.equals(hLen, history.length, 'child route does not add history entry')
          next()
        }
      })

      ko.components.register('b', {
        viewModel() {
          t.pass('navigates to new child route from parent router')
          next()
        }
      })

      ko.components.register('c', {
        viewModel() {
          t.pass('navigates to new child route from child router')
          next()
        }
      })

      ko.components.register('e', {
        viewModel() {
          t.pass('nested router shorthand works')
          next()
        }
      })

      ko.components.register('f', {
        template: '<ko-component-router></ko-component-router>',
        viewModel() {
          t.pass('nested router shorthand uses supplied component')
        }
      })

      ko.components.register('g', {
        viewModel() {
          t.pass('anonymous router in route using shorthand works')
          next()
        }
      })
    }

    * async runTests(next) {
      yield Router.update('/nested/b')
      yield Router.get(1).update('/c')
      yield Router.get(1).update('/d/e')
      yield Router.get(1).update('/f/g')
      next()
    }

    dispose() {
      ko.components.unregister('a')
      ko.components.unregister('b')
      ko.components.unregister('c')
      ko.components.unregister('d')
      ko.components.unregister('e')
      ko.components.unregister('f')
      ko.components.unregister('g')
      ko.components.unregister('nested')
    }
  }
})

export default { '/nested/!': 'nested' }
