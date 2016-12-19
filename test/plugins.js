import { merge } from 'lodash'
import ko from 'knockout'
import isPlainObject from 'is-plain-object'
import Router from '../dist/modules'

ko.components.register('plugins', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class PluginTest {
    constructor({ t, next: _next }) {
      const runner = this.runTests(_next)
      const next = runner.next.bind(runner)

      this.routes = {
        '/component': {
          component: 'component'
        },
        '/data': ['data', {
          data: Promise.resolve(true)
        }],
        '/data-multi': ['data-multi', {
          data: {
            true: Promise.resolve(true),
            false: Promise.resolve(false)
          }
        }],
        '/composed': {
          component: 'composed',
          data: Promise.resolve(true)
        },
      }

      const componentPlugin = function(route) {
        if (route.component) {
          return route.component
        }
      }

      const dataPlugin = function(route) {
        if (route.data) {
          return isPlainObject(route.data)
            ? Object.entries(route.data).map(([k, v]) =>
              (ctx) => v.then((_v) => merge(ctx, { data: { [k]: _v } })))
            : (ctx) => route.data.then((v) => ctx.data = v)
        }
      }

      Router.plugins = [componentPlugin]
      Router.usePlugin(dataPlugin)

      ko.components.register('component', {
        template: '<div></div>',
        viewModel() {
          t.pass('plugin works with returned string')
          next()
        }
      })

      ko.components.register('data', {
        template: '<div></div>',
        viewModel(ctx) {
          t.equals(true, ctx.data, 'plugin works with returned middleware func')
          next()
        }
      })

      ko.components.register('data-multi', {
        template: '<div></div>',
        viewModel(ctx) {
          t.deepEquals({ true: true, false: false }, ctx.data, 'plugin works with returned array of middleware funcs')
          next()
        }
      })

      ko.components.register('composed', {
        template: '<div></div>',
        viewModel(ctx) {
          t.equals(true, ctx.data, 'plugins can be composed')
          next()
        }
      })

      next()
    }

    * async runTests(next) {
      const begin = location.href

      yield history.replaceState(null, null, '/component')

      yield Router.update('/data')
      yield Router.update('/data-multi')
      yield Router.update('/composed')

      Router.update('/').then(() => {
        history.pushState(null, null, begin)
        next()
      })
    }

    dispose() {
      ko.components.unregister('plugins')
      ko.components.unregister('component')
      ko.components.unregister('data')
      ko.components.unregister('data-multi')
      ko.components.unregister('composed')

      Router.plugins = []
    }
  }
})
