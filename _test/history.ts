import ko from 'knockout'

ko.components.register('history', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class History {
    constructor({ t, next }) {
      this.routes = {
        '/a': 'a', // init
        '/b': 'b', // update(path)
        '/c': 'c', // update(path, {})
        '/d': 'd', // update(path, false)
        '/e': 'e'  // update(path, { push: false })
      }

      history.pushState(null, null, '/a')

      const begin = history.length

      ko.components.register('a', {
        viewModel(ctx) {
          t.equals(history.length, begin, 'does not add history entry on initialization')
          ctx.router.update('/b')
        }
      })

      ko.components.register('b', {
        viewModel(ctx) {
          t.equals(history.length, begin + 1, 'adds history entry when no second argument')
          ctx.router.update('/c', { })
        }
      })

      ko.components.register('c', {
        viewModel(ctx) {
          t.equals(history.length, begin + 2, 'adds history entry when second argument is object and has undefined push property')
          ctx.router.update('/d', false)
        }
      })

      ko.components.register('d', {
        viewModel(ctx) {
          t.equals(history.length, begin + 2, 'does not add history entry with false second argument')
          ctx.router.update('/e', { push: false })
        }
      })

      ko.components.register('e', {
        viewModel() {
          t.equals(history.length, begin + 2, 'does not add history entry when second argument is objcet and push property is false')
          next()
        }
      })
    }

    dispose() {
      ko.components.unregister('history')
      ko.components.unregister('a')
      ko.components.unregister('b')
      ko.components.unregister('c')
      ko.components.unregister('d')
      ko.components.unregister('e')
    }
  }
})
