'use strict'

const ko = require('knockout')

class NestedRouter {
  constructor() {
    this.routes = {
      '/foo': 'foo',
      '/bar': 'bar',
      '/baz': 'baz',
      '/qux': 'qux',
      '/params/:foo/:bar': 'params'
    }
  }
}

ko.components.register('nested', {
  viewModel: NestedRouter,
  template: `
    <h3>Nested Router</h3>
    <ul class="nav nav-pills nav-justified">
      <li><a href="/examples/nested/foo">Foo</a></li>
      <li><a href="/examples/nested/bar">Bar</a></li>
      <li><a href="/examples/nested/baz">Baz</a></li>
      <li><a href="/examples/nested/qux">Qux</a></li>
      <li><a href="/examples/nested/params/lorem/ipsum">Params</a></li>
    </ul>
    <ko-component-router params="routes: routes"></ko-component-router>
  `
})

for (const foo of ['foo', 'bar', 'baz', 'qux']) {
  ko.components.register(foo, { template: `<h6>${foo.toUpperCase()}</h6>`})
}
