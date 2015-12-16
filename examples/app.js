'use strict'

require('../src')
require('./views')

const ko = require('knockout')
window.ko = ko

class App {
  constructor() {
    this.routes = {
      '/': 'home',
      '/nested/!': 'nested',
      '/params/:foo/:bar': 'params'
    }
  }
}

ko.components.register('app', {
  viewModel: App,
  template: `
  <div class="container">
    <div class="page-header">
      <h1>
        ko-component-router

        <small>
          demo
        </small>
      </h1>
    </div>

    <div class="row">
      <div class="col-sm-4 col-lg-3">
        <ul class="nav nav-pills nav-stacked">
          <li><a href="/examples">Home</a></li>
          <li><a href="/examples/nested">Nested</a></li>
          <li><a href="/examples/params/lorem/ipsum">Params</a></li>
        </ul>
      </div>
      <div class="col-sm-8 col-lg-9">
        <ko-component-router params="routes: routes, base: '/examples', hashbang: false"></ko-component-router>
      </div>
    </div>
  </div>
  `
})

ko.applyBindings()
