'use strict'

require('../src')
require('./views')

const ko = require('knockout')
window.ko = ko

class App {
  constructor() {
    this.routes = {
      '/home': 'home',
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
          <li><a href="/home">Home</a></li>
          <li><a href="/nested">Nested</a></li>
          <li><a href="/params/lorem/ipsum">Params</a></li>
        </ul>
      </div>
      <div class="col-sm-8 col-lg-9">
        <ko-component-router params="routes: routes, default: '/home', hashbang: false"></ko-component-router>
      </div>
    </div>
  </div>
  `
})

ko.applyBindings()
