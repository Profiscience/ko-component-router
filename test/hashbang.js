import ko from 'knockout'
import $ from 'jquery'

import Router from '../dist/test'

ko.components.register('hashbang', {
  template: `
    <a id="foo-link" data-bind="path: '/foo/foo'"></a>
    <ko-component-router></ko-component-router>
  `,
  viewModel: class Hashbang {
    constructor({ t, done }) {
      Router.setConfig({
        hashbang: true,
        base: '/base'
      })

      Router.useRoutes({
        '/foo': {
          '/foo': 'foo'
        },
        '/bar': {
          '/bar': 'bar'
        }
      })

      history.pushState(null, null, '/base/#!/foo/foo')

      ko.components.register('foo', {
        viewModel: class {
          constructor(ctx) {
            t.pass('initializes with hashbang')
            t.true(location.href.indexOf('/base/#!/foo/foo') > -1, 'uses hash in url on init')

            ctx.router.initialized.then(() => ko.tasks.schedule(() => {
              t.equals($('#foo-link').attr('href'), '/base/#!/foo/foo', 'sets href correctly in path binding')
              Router.update('/bar/bar')
            }))
          }
        }
      })

      ko.components.register('bar', {
        viewModel: class {
          constructor() {
            t.pass('navigates correctly with hashbang')
            t.true(location.href.indexOf('/base/#!/bar/bar') > -1, 'uses hash in url on update')

            done()
          }
        }
      })
    }

    dispose() {
      Router.setConfig({
        hashbang: false,
        base: ''
      })
    }
  }
})
