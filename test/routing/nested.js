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

      let parentRouter

      // this should be the initial call, and is responsible for calling
      // `next()` to start the test runner
      ko.components.register('a', {
        viewModel() {
          t.equals(Router.head, Router.get(0), 'Router.head is top-most router')
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
        viewModel(ctx) {
          parentRouter = ctx.router
          t.pass('nested router shorthand uses supplied component')
        }
      })

      ko.components.register('g', {
        viewModel(ctx) {
          t.equals(Router.head.$parent, undefined, 'root router.$parent is undefined')
          t.equals(Router.head.ctx.$parent, undefined, 'root ctx.$parent is undefined')

          t.equals(ctx.router, Router.tail, 'Router.tail is bottom-most router')
          t.equals(ctx.router.$parent, Router.tail.$parent, 'Router.$parent is parent router')
          t.equals(ctx.$parent.router, Router.tail.$parent, 'ctx.$parent is parent ctx')

          t.equals(ctx.router.$parents[0], Router.tail.$parent, 'Router.$parents is array of parents, 0=$parent')
          t.equals(ctx.router.$parents[1], Router.tail.$parent.$parent, 'Router.$parents is array of parents, 1=$parent.$parent')

          t.equals(ctx.$parents[0].router, Router.tail.$parent, 'ctx.$parents is array of parents, 0=$parent')
          t.equals(ctx.$parents[1].router, Router.tail.$parent.$parent, 'ctx.$parents is array of parents, 1=$parent.$parent')

          t.equals(parentRouter.$child, ctx.router, 'router.$child child router')
          t.equals(parentRouter.$children[0], ctx.router, 'router.$children is array of child routers')

          t.equals(parentRouter.ctx.$child, ctx, 'ctx.$child child ctx')
          t.equals(parentRouter.ctx.$children[0], ctx, 'ctx.$children is array of child ctxs')

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
