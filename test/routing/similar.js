import ko from 'knockout'

ko.components.register('similar', {
  template: '<div></div>',
  viewModel: class SimilarRoutesTest {
    constructor({ t, next, params }) {
      t.notOk(params.foo, 'should use most restrictive route')
      next()
    }
    dispose() {
      ko.components.unregister('similar')
    }
  }
})

export default {
  '/similar/:foo/:bar': 'similar',
  '/similar/foo/:bar': 'similar'
}
