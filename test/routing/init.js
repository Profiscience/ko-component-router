import ko from 'knockout'

ko.components.register('init', {
  viewModel: class RoutingInitializationTest {
    constructor({ t, done }) {
      t.pass('initializes')
      done()
    }
    dispose() {
      ko.components.unregister('init')
    }
  }
})

export const paths = [
  '/init'
]

export const routes = {
  '/init': 'init'
}
