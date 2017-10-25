import ko from 'knockout'

import { Router } from '../'

ko.components.register('with', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class With {
    constructor({ t, done }) {
      Router.useRoutes({
        '/a': 'a',
        '/b': 'b'
      })

      history.pushState(null, null, '/a')

      ko.components.register('a', {
        viewModel: class {
          constructor(ctx) {
            ctx.router.update('/b', { with: { foo: 'foo' } })
          }
        }
      })

      ko.components.register('b', {
        viewModel: class {
          constructor(ctx) {
            t.equals(ctx.foo, 'foo', 'can pass data using with')
            done()
          }
        }
      })
    }
  }
})
