import ko from 'knockout'

ko.components.register('static', {
  viewModel: class StaticRouteDefinitionTest {
    constructor({ t, next }) {
      t.pass('navigates to statically defined route')
      next()
    }
    dispose() {
      ko.components.unregister('static')
    }
  }
})

export default { '/static': 'static' }
