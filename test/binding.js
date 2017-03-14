import ko from 'knockout'
import $ from 'jquery'

import Router from '../dist/modules'

ko.components.register('binding', {
  template: `
    <a id="custom-class" data-bind="path: '/a', pathActiveClass: 'custom-active-class'"></a>
    <a id="outer-relative" data-bind="path: '/a'"></a>
    <a id="outer-absolute" data-bind="path: '//a'"></a>
    <a id="outer-deep" data-bind="path: '/a/a'"></a>
    <ko-component-router></ko-component-router>
  `,
  viewModel: class BindingTest {
    constructor({ t, done }) {
      const begin = location.href

      history.replaceState(null, null, '/a/a')

      Router.useRoutes({
        '/a': ['a',
          {
            '/a': 'a-inner'
          }]
      })

      ko.components.register('a', {
        synchronous: true,
        viewModel: class {
          constructor(ctx) {
            ctx.router.$child.initialized.then(() => {
              t.equals('/a', $('#outer-relative').attr('href'))
              t.equals('/a', $('#outer-absolute').attr('href'))

              t.equals('/a/a', $('#inner-relative').attr('href'))
              t.equals('/a', $('#inner-absolute').attr('href'))

              t.equals('/a/a', $('#nested-relative').attr('href'))
              t.equals('/a', $('#nested-relative-up').attr('href'))
              t.equals('/a', $('#nested-absolute').attr('href'))

              t.ok($('#custom-class').hasClass('custom-active-class'))
              t.ok($('#outer-relative').hasClass('active-path'))
              t.ok($('#inner-relative').hasClass('active-path'))
              t.ok($('#nested-relative').hasClass('active-path'))
              t.ok($('#outer-deep').hasClass('active-path'))

              history.pushState(null, null, begin)
              done()
            })
          }
        },
        template: `
          <a id="inner-relative" data-bind="path: './a'"></a>
          <a id="inner-absolute" data-bind="path: '//a'"></a>
          <ko-component-router></ko-component-router>
        `
      })

      ko.components.register('a-inner', {
        synchronous: true,
        template: `
          <a id="nested-relative" data-bind="path: '/a'"></a>
          <a id="nested-relative-up" data-bind="path: '../a'"></a>
          <a id="nested-absolute" data-bind="path: '//a'"></a>
        `
      })
    }
  }
})
