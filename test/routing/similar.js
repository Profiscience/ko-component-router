import ko from 'knockout'

ko.components.register('similar', {
  viewModel: class SimilarRoutesTest {
    constructor({ t, done, params }) {
      t.notOk(params.foo, 'should use most restrictive route')
      done()
    }
  }
})

export const path = '/similar/foo/bar'

export const routes = {
  '/similar/:foo/:bar': 'similar',
  '/similar/foo/:bar': 'similar'
}
