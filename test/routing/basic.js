import ko from 'knockout'

ko.components.register('basic', {
  viewModel: class BasicRoutingTest {
    constructor({ t, done }) {
      t.pass('navigates to basic route')
      done()
    }
    dispose() {
      ko.components.unregister('basic')
    }
  }
})

export const paths = [
  '/basic'
]

export const routes = {
  '/basic': 'basic'
}
