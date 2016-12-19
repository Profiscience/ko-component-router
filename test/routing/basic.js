import ko from 'knockout'

ko.components.register('basic', {
  template: '<div></div>',
  viewModel: class BasicRoutingTest {
    constructor({ t, next }) {
      t.pass('navigates to basic route')
      next()
    }
    dispose() {
      ko.components.unregister('basic')
    }
  }
})

export default { '/basic': 'basic' }
