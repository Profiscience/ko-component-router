import $ from 'jquery'
import ko from 'knockout'

ko.components.register('element', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class ElementTest {
    constructor({ t, next }) {
      this.routes = {
        '/': 'foo'
      }

      ko.components.register('foo', {
        template: '<div></div>',
        viewModel(ctx) {
          t.ok(ctx.element)
          t.equals($('.ko-component-router-view.foo')[0], ctx.element, 'attaches view element to ctx.element')
          next()
        }
      })
    }

    dispose() {
      ko.components.unregister('element')
      ko.components.unregister('foo')
    }
  }
})
