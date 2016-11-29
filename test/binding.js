import ko from 'knockout'
import $ from 'jquery'

ko.components.register('binding', {
  template: `
    <a id="root-relative" data-bind="path: '/a'"></a>
    <a id="root-absolute" data-bind="path: '//a'"></a>
    <a id="root-deep" data-bind="path: '/a/a'"></a>
    <ko-component-router params="routes: routes"></ko-component-router>
  `,
  viewModel: class BindingTest {
    constructor({ t, next }) {
      const begin = location.href
      history.replaceState(null, null, '/a/a')

      this.routes = {
        '/a/!': 'a'
      }

      ko.components.register('empty', { template: '<div></div>' })

      ko.components.register('a', {
        viewModel() {
          this.routes = { '/a': 'empty' }

          setTimeout(() => {
            t.equals('/a', $('#root-relative').attr('href'))
            t.equals('/a', $('#root-absolute').attr('href'))

            t.equals('/a/a', $('#nested-relative').attr('href'))
            t.equals('/a', $('#nested-relative-up').attr('href'))
            t.equals('/a', $('#nested-absolute').attr('href'))

            t.ok($('#root-relative').hasClass('active-path'))
            t.ok($('#nested-relative').hasClass('active-path'))
            t.ok($('#root-deep').hasClass('active-path'))

            history.pushState(null, null, begin)
            next()
          })
        },
        template: `
          <a id="nested-relative" data-bind="path: '/a'"></a>
          <a id="nested-relative-up" data-bind="path: '../a'"></a>
          <a id="nested-absolute" data-bind="path: '//a'"></a>
          <ko-component-router params="routes: routes"></ko-component-router>
        `
      })
    }

    dispose() {
      ko.components.unregister('a')
      ko.components.unregister('empty')
      ko.components.unregister('binding')
    }
  }
})
