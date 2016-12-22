import ko from 'knockout'
import $ from 'jquery'

ko.components.register('binding', {
  template: `
    <a id="outer-relative" data-bind="path: '/a'"></a>
    <a id="outer-absolute" data-bind="path: '//a'"></a>
    <a id="outer-deep" data-bind="path: '/a/a'"></a>
    <ko-component-router params="routes: routes"></ko-component-router>
  `,
  viewModel: class BindingTest {
    constructor({ t, next }) {
      const begin = location.href
      history.replaceState(null, null, '/a/a')

      this.routes = {
        '/a/!': ['a', {
          '/a': 'a-inner'
        }]
      }

      ko.components.register('a', {
        viewModel() {
          setTimeout(() => {
            t.equals('/a', $('#outer-relative').attr('href'))
            t.equals('/a', $('#outer-absolute').attr('href'))

            t.equals('/a/a', $('#inner-relative').attr('href'))
            t.equals('/a', $('#inner-absolute').attr('href'))

            t.equals('/a/a', $('#nested-relative').attr('href'))
            t.equals('/a', $('#nested-relative-up').attr('href'))
            t.equals('/a', $('#nested-absolute').attr('href'))

            t.ok($('#outer-relative').hasClass('active-path'))
            t.ok($('#inner-relative').hasClass('active-path'))
            t.ok($('#nested-relative').hasClass('active-path'))
            t.ok($('#outer-deep').hasClass('active-path'))

            history.pushState(null, null, begin)
            next()
          })
        },
        template: `
          <a id="inner-relative" data-bind="path: './a'"></a>
          <a id="inner-absolute" data-bind="path: '//a'"></a>
          <ko-component-router></ko-component-router>
        `
      })

      ko.components.register('a-inner', {
        template: `
          <a id="nested-relative" data-bind="path: '/a'"></a>
          <a id="nested-relative-up" data-bind="path: '../a'"></a>
          <a id="nested-absolute" data-bind="path: '//a'"></a>
        `
      })
    }

    dispose() {
      ko.components.unregister('a')
      ko.components.unregister('a-inner')
      ko.components.unregister('binding')
    }
  }
})
