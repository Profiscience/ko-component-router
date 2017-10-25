import ko from 'knockout'

import { Router } from '../'

ko.components.register('force-update', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class ForceUpdate {
    constructor({ t, done }) {
      let count = 0

      Router.useRoutes({
        '/': 'foo'
      })

      history.pushState(null, null, '/')

      ko.components.register('foo', {
        viewModel: class {
          constructor(ctx) {
            if (++count === 1) {
              ctx.router.update('/', { force: true })
            } else {
              t.pass('can force same-route update')
              done()
            }
          }
        }
      })
    }
  }
})
