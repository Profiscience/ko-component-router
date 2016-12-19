/* [path-to-regexp](https://github.com/pillarjs/path-to-regexp) is well tested,
 * so there isn't too much room for error in this as long as the params are being
 * attached to context and the route is working
 **/

 import ko from 'knockout'

ko.components.register('params', {
  template: '<div></div>',
  viewModel: class ParamsTest {
    constructor({ t, next, params }) {
      t.equal('foo', params.foo, 'parses param to ctx.params')
      next()
    }
    dispose() {
      ko.components.unregister('params')
    }
  }
})

export default { '/params/:foo': 'params' }
