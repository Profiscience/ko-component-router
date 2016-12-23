import ko from 'knockout'

ko.components.register('force-update', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class ForceUpdate {
    constructor({ t, next }) {
      let count = 0

      this.routes = {
        '/': 'foo'
      }
      
      history.pushState(null, null, '/')

      ko.components.register('foo', {
        template: '<div></div>',
        viewModel(ctx) {
          if (++count === 1) {
            ctx.router.update('/', { force: true })
          } else {
            t.pass('can force same-route update')
            next()
          }
        }
      })
    }

    dispose() {
      ko.components.unregister('force-update')
      ko.components.unregister('foo')
    }
  }
})
