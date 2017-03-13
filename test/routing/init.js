import ko from 'knockout'

ko.components.register('init', {
  viewModel: class RoutingInitializationTest {
    constructor({ t, done }) {
      t.pass('initializes')
      done()
    }
  }
})

export const path = '/init'

export const routes = {
  '/init': 'init'
}
