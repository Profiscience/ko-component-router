import ko from 'knockout'
import $ from 'jquery'

import { Router } from '../'

ko.components.register('binding', {
  template: `
    <a id="custom-class" data-bind="path: '/a/a', pathActiveClass: 'custom-active-class'"></a>
    <a id="outer-relative-a" data-bind="path: '/a/a'"></a>
    <a id="outer-deep" data-bind="path: '/a/a'"></a>
    <a id="outer-relative-b" data-bind="path: '/b'"></a>
    <a id="outer-absolute-b" data-bind="path: '//b'"></a>
    <ko-component-router></ko-component-router>
  `,
  viewModel: class BindingTest {
    constructor({ t, done }) {
      history.replaceState(null, null, '/a/a')

      Router.useRoutes({
        '/a': [
          'a',
          {
            '/a': 'a-inner'
          }
        ],
        '/b': 'b'
      })

      ko.components.register('a', {
        synchronous: true,
        viewModel: class {
          constructor(ctx) {
            ctx.$child.router.initialized.then(() => {
              t.equals('/a/a', $('#outer-relative-a').attr('href'))

              t.equals('/a/a', $('#inner-relative').attr('href'))
              t.equals('/a', $('#inner-absolute').attr('href'))

              t.equals('/a/a', $('#nested-relative').attr('href'))
              t.equals('/a', $('#nested-relative-up').attr('href'))
              t.equals('/a', $('#nested-absolute').attr('href'))

              t.ok($('#custom-class').hasClass('custom-active-class'), 'should apply custom active class when used with pathActiveClass binding')
              t.ok($('#outer-relative-a').hasClass('active-path'), 'should apply active class on elements outside routers')
              t.ok($('#inner-relative').hasClass('active-path'), 'should apply active class on relative paths inside routers')
              t.ok($('#nested-relative').hasClass('active-path'), 'should apply active class on nested relative paths')
              t.ok($('#outer-deep').hasClass('active-path'), 'should apply active class on deep paths')

              Router.update('/b')
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

      ko.components.register('b', {
        viewModel: class {
          constructor() {
            done()
          }
        }
      })
    }
  }
})
