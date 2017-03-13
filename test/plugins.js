import { isPlainObject, merge } from 'lodash-es'
import ko from 'knockout'

import Router from '../dist/modules'

ko.components.register('plugins', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class PluginTest {
    constructor({ t, done }) {
      history.replaceState(null, null, '/component')

      Router.usePlugin(
        function(route) {
          if (route.component) {
            return route.component
          }
        },
        function(route) {
          if (route.data) {
            return isPlainObject(route.data)
              ? Object.entries(route.data).map(([k, v]) =>
                (ctx) => v.then((_v) => merge(ctx, { data: { [k]: _v } })))
              : (ctx) => route.data.then((v) => ctx.data = v)
          }
        }
      )

      Router.useRoutes({
        '/component': {
          component: 'component'
        },
        '/data': ['data', { // eslint-disable-line
          data: Promise.resolve(true)
        }],
        '/data-multi': ['data-multi', { // eslint-disable-line
          data: {
            true: Promise.resolve(true),
            false: Promise.resolve(false)
          }
        }],
        '/composed': {
          component: 'composed',
          data: Promise.resolve(true)
        },
      })

      ko.components.register('component', {
        viewModel: class {
          constructor() {
            t.pass('plugin works with returned string')
            Router.update('/data')
          }
        }
      })

      ko.components.register('data', {
        viewModel: class {
          constructor(ctx) {
            t.equals(true, ctx.data, 'plugin works with returned middleware func')
            Router.update('/data-multi')
          }
        }
      })

      ko.components.register('data-multi', {
        viewModel: class {
          constructor(ctx) {
            t.deepEquals({ true: true, false: false }, ctx.data, 'plugin works with returned array of middleware funcs')
            Router.update('/composed')
          }
        }
      })

      ko.components.register('composed', {
        viewModel: class {
          constructor(ctx) {
            t.equals(true, ctx.data, 'plugins can be composed')
            done()
          }
        }
      })
    }

    dispose() {
      Router.plugins = []
    }
  }
})
