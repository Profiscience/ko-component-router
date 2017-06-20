/* [path-to-regexp](https://github.com/pillarjs/path-to-regexp) is well tested,
 * so there isn't too much room for error in this as long as the params are being
 * attached to context and the route is working
 **/

import ko from 'knockout'

ko.components.register('params', {
  viewModel: class ParamsTest {
    constructor({ t, done, params }) {
      t.equal('foo', params.foo, 'parses param to ctx.params')
      done()
    }
  }
})

export const path = '/params/foo'

export const routes = {
  '/params/:foo': 'params'
}
