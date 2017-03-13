import $ from 'jquery'
import ko from 'knockout'

import Router from '../dist/modules'

ko.components.register('element', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class ElementTest {
    constructor({ t, done }) {
      Router.useRoutes({
        '/': 'foo'
      })

      ko.components.register('foo', {
        viewModel: class {
          constructor(ctx) {
            t.ok(ctx.element)
            t.equals($('.ko-component-router-view.foo')[0], ctx.element, 'attaches view element to ctx.element')
            done()
          }
        }
      })
    }
  }
})
