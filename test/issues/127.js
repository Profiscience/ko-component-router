import ko from 'knockout'

ko.components.register('127', {
  template: '<ko-component-router params="routes: routes, hashbang: true"></ko-component-router>',
  viewModel: class Issue127 {
    constructor({ t, next }) {
      this.begin = location.href
      history.pushState(null, null, '/#!/a/b')

      this.routes = {
        '/a': {
          '/b': 'foo'
        }
      }

      ko.components.register('foo', {
        viewModel() {
          t.pass('nested routers work with hashbang routing')
          next()
        }
      })
    }

    dispose() {
      ko.components.unregister('127')
      ko.components.unregister('foo')
      history.pushState(null, null, this.begin)
    }
  }
})
