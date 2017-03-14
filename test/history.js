import ko from 'knockout'

import Router from '../dist/modules'

ko.components.register('history', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class History {
    constructor({ t, done }) {
      Router.useRoutes({
        '/a': 'a', // init
        '/b': 'b', // update(path)
        '/c': 'c', // update(path, {})
        '/d': 'd', // update(path, false)
        '/e': 'e'  // update(path, { push: false })
      })

      history.pushState(null, null, '/a')

      const begin = history.length

      if (begin > 48) {
        ko.components.register('a', {})
        t.skip('Unable to test history.length b/c history.length is too long')
        done()
        return
      }

      ko.components.register('a', {
        viewModel: class {
          constructor(ctx) {
            t.equals(history.length, begin, 'does not add history entry on initialization')
            ctx.router.update('/b')
          }
        }
      })

      ko.components.register('b', {
        viewModel: class {
          constructor(ctx) {
            t.equals(history.length, begin + 1, 'adds history entry when no second argument')
            ctx.router.update('/c', {})
          }
        }
      })

      ko.components.register('c', {
        viewModel: class {
          constructor(ctx) {
            t.equals(history.length, begin + 2, 'adds history entry when second argument is object and has undefined push property')
            ctx.router.update('/d', false)
          }
        }
      })

      ko.components.register('d', {
        viewModel: class {
          constructor(ctx) {
            t.equals(history.length, begin + 2, 'does not add history entry with false second argument')
            ctx.router.update('/e', { push: false })
          }
        }
      })

      ko.components.register('e', {
        viewModel: class {
          constructor() {
            t.equals(history.length, begin + 2, 'does not add history entry when second argument is objcet and push property is false')
            done()
          }
        }
      })
    }
  }
})
