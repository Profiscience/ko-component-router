import ko from 'knockout'
import Router from 'ko-component-router'
import lazyComponentLoaderPlugin from './plugins/lazy-component-loader'

Router.setConfig({ base: '/lazy-loading', hashbang: true })

Router.usePlugin(lazyComponentLoaderPlugin)

Router.useRoutes({
  '/':    'list',
  '/foo': 'foo',
  '/bar': 'bar',
  '/baz': 'baz',
  '/qux': 'qux'
}
)

ko.components.register('app', { template: '<ko-component-router></ko-component-router>' })

ko.applyBindings()
