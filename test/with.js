import ko from 'knockout'

ko.components.register('with', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class With {
    constructor({ t, next }) {
      this.routes = {
        '/a': 'a',
        '/b': 'b'
      }

      history.pushState(null, null, '/a')

      ko.components.register('a', {
        viewModel(ctx) {
          ctx.router.update('/b', { with: { foo: 'foo' } })
        }
      })

      ko.components.register('b', {
        viewModel(ctx) {
          t.equals(ctx.foo, 'foo', 'can pass data using with')
          next()
        }
      })
    }

    dispose() {
      ko.components.unregister('with')
      ko.components.unregister('a')
      ko.components.unregister('b')
    }
  }
})
