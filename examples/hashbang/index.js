
import ko from 'knockout'
import Router from '../../src/index'

function createTemplate(foo) {
  return `
    <a data-bind="path: '/'">back</a>
    <h1>${foo}</h1>
  `
}

ko.components.register('app', {
  template: `
    <ko-component-router></ko-component-router>
  `
})

ko.components.register('index', {
  template: `
    <ul>
      <li><a data-bind="path: '/foo'">foo</a></li>
      <li><a data-bind="path: '/bar'">bar</a></li>
      <li><a data-bind="path: '/baz'">baz</a></li>
      <li><a data-bind="path: '/qux'">qux</a></li>
    </ul>
  `
})

ko.components.register('foo', { template: createTemplate('foo') })
ko.components.register('bar', { template: createTemplate('bar') })
ko.components.register('baz', { template: createTemplate('baz') })
ko.components.register('qux', { template: createTemplate('qux') })

Router.useRoutes({
  '/': 'index',
  '/foo': 'foo',
  '/bar': 'bar',
  '/baz': 'baz',
  '/qux': 'qux'
})

Router.setConfig({
  base: '/hashbang',
  hashbang: true
})

ko.applyBindings()
