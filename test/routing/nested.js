import ko from 'knockout'
import Router from '../../dist/modules'

ko.components.register('nested', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class NestedRoutingTest {
    constructor({ t, done }) {
      t.pass('navigates to route with children')
      t.pass('uses specifed component with routes')

      const hLen = history.length

      ko.components.register('root', {
        viewModel: class {
          constructor() {
            t.equals(Router.head, Router.get(0), 'Router.head is top-most router')
            t.pass('initializes nested route')
            t.equals(hLen, history.length, 'child route does not add history entry')
            Router.update('/nested/a')
          }
        }
      })

      ko.components.register('a', {
        viewModel: class {
          constructor(ctx) {
            t.pass('navigates to new child route from parent router')
            ctx.router.update('/b')
          }
        }
      })

      ko.components.register('b', {
        viewModel: class {
          constructor() {
            t.pass('navigates to new child route from child router')
            Router.update('/nested/c')
          }
        }
      })

      ko.components.register('c', {
        viewModel: class {
          constructor(ctx) {
            t.pass('works with implied router component (no specified component)')

            t.equals(Router.head.$parent, undefined, 'root router.$parent is undefined')
            t.equals(Router.head.ctx.$parent, undefined, 'root ctx.$parent is undefined')

            t.equals(ctx.router, Router.tail, 'Router.tail is bottom-most router')
            t.equals(ctx.router.$parent, Router.tail.$parent, 'Router.$parent is parent router')
            t.equals(ctx.$parent.router, Router.tail.$parent, 'ctx.$parent is parent ctx')

            t.equals(ctx.router.$parents[0], Router.tail.$parent, 'Router.$parents is array of parents, 0=$parent')
            t.equals(ctx.router.$parents[1], Router.tail.$parent.$parent, 'Router.$parents is array of parents, 1=$parent.$parent')

            t.equals(ctx.$parents[0].router, Router.tail.$parent, 'ctx.$parents is array of parents, 0=$parent')
            t.equals(ctx.$parents[1].router, Router.tail.$parent.$parent, 'ctx.$parents is array of parents, 1=$parent.$parent')

            t.equals(ctx.$parent.router.$child, ctx.router, 'router.$child child router')
            t.equals(ctx.$parent.router.$children[0], ctx.router, 'router.$children is array of child routers')

            t.equals(ctx.$parent.$child, ctx, 'ctx.$child child ctx')
            t.equals(ctx.$parent.$children[0], ctx, 'ctx.$children is array of child ctxs')

            done()
          }
        }
      })
    }

    dispose() {
      ko.components.unregister('nested')
      ko.components.unregister('root')
      ko.components.unregister('a')
      ko.components.unregister('b')
      ko.components.unregister('c')
    }
  }
})

export const path = '/nested'

export const routes = {
  '/nested': ['nested',
    {
      '/': 'root',
      '/a': 'a',
      '/b': 'b',
      '/c': {
        '/': 'c' // https://www.youtube.com/watch?v=5l-PjIqPOBw
      }
    }
  ]
}
