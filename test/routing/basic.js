import ko from 'knockout'

ko.components.register('basic', {
  viewModel: class BasicRoutingTest {
    constructor({ t, done }) {
      t.pass('navigates to basic route')
      done()
    }
  }
})

export const path = '/basic'

export const routes = {
  '/basic': 'basic'
}
