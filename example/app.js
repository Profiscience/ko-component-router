'use strict'

// polyfills
require('es6-promise').polyfill()
require('html5-history-api')
if (history.emulate) {
  history.redirect('!/', '')
}
if (!window.requestAnimationFrame) {
  const raf = require('raf')
  window.requestAnimationFrame = raf
  window.cancelAnimationFrame = raf.cancel
}

const $ = require('jquery')
const ko = require('knockout')
window.ko = ko // attach for debugging purposes

require('../src')
require('./views')
require('./bindings')
require('./styles')

const { inTransition, outTransition } = require('./lib/animate')

class App {
  constructor() {
    this.base = window.location.pathname.substring(0, window.location.pathname.length - 1)
    this.hashbang = true

    this.inTransition = inTransition
    this.outTransition = outTransition

    this.routes = {
      '/': 'getting-started',
      '/config': 'config',
      '/nested-routing/!': 'nested-routing',
      '/bindings': 'bindings',
      '/context': 'context'
    }
  }
}

ko.components.register('app', {
  synchronous: true,
  viewModel: App,
  template: `
    <div class="container">
      <div class="page-header">
        <small class="text-muted text-right pull-right">
          <p>
            <img src="https://img.shields.io/npm/v/ko-component-router.svg" alt="NPM" title="" />
            <img src="https://img.shields.io/bower/v/ko-component-router.svg" alt="Bower" title="" />
            <img src="https://img.shields.io/npm/l/ko-component-router.svg" alt="MIT" title="" />
            <a href="https://travis-ci.org/caseyWebb/ko-component-router"><img src="https://img.shields.io/travis/caseyWebb/ko-component-router.svg" alt="Travis" title="" /></a>
            <a href="https://codeclimate.com/github/caseyWebb/ko-component-router"><img src="https://img.shields.io/codeclimate/github/caseyWebb/ko-component-router.svg" alt="CodeClimate" title="" /></a>
            <a href="https://codeclimate.com/github/caseyWebb/ko-component-router/coverage"><img src="https://img.shields.io/codeclimate/coverage/github/caseyWebb/ko-component-router.svg" alt="Test Coverage" title="" /></a>
          </p>
          pssst... this documentation is built using knockout + this router,
          <a href="https://github.com/caseyWebb/ko-component-router/tree/gh-pages/example">source</a>
        </small>
        <h1>
          ko-component-router

          <small>
            / caseyWebb
          </small>
        </h1>
      </div>

      <div class="row">
        <div class="side-nav col-sm-4 col-lg-2">
          <div data-bind="affix">
            <ul class="nav nav-stacked">
              <li><a data-bind="path: '/'">getting started</a></li>
              <li>
                <a data-bind="path: '/config'">config</a>
                <ul class="nav-sublist" data-bind="async: { collapsed: ko.pureComputed(function() { return $router.route().matches('/config') === null }) }">
                  <li><a data-bind="path: '/config#routes'">routes</a></li>
                  <li><a data-bind="path: '/config#base'">base</a></li>
                  <li><a data-bind="path: '/config#hashbang'">hashbang</a></li>
                  <li><a data-bind="path: '/config#persistQuery'">persistQuery</a></li>
                  <li><a data-bind="path: '/config#persistState'">persistState</a></li>
                  <li><a data-bind="path: '/config#inTransition'">inTransition</a></li>
                  <li><a data-bind="path: '/config#outTransition'"">outTransition</a></li>
                </ul>
              </li>
              <li>
                <a data-bind="path: '/context'">ctx</a>
                <ul class="nav-sublist" data-bind="async: { collapsed: ko.pureComputed(function() { return $router.route().matches('/context') === null }) }">
                  <li><a data-bind="path: '/context#params'">params</a></li>
                  <li><a data-bind="path: '/context#query'">query</a></li>
                  <li><a data-bind="path: '/context#state'">state</a></li>
                  <li><a data-bind="path: '/context#route'">route</a></li>
                  <li><a data-bind="path: '/context#applyDefaultRoute'">applyDefaultRoute</a></li>
                  <li><a data-bind="path: '/context#path'">path</a></li>
                  <li><a data-bind="path: '/context#pathname'">pathname</a></li>
                  <li><a data-bind="path: '/context#canonicalPath'">canonicalPath</a></li>
                  <li><a data-bind="path: '/context#hash'">hash</a></li>
                  <li><a data-bind="path: '/context#update'">update</a></li>
                  <li><a data-bind="path: '/context#parent'">$parent</a></li>
                  <li><a data-bind="path: '/context#child'">$child</a></li>
                </ul>
              </li>
              <li>
                <a data-bind="path: '/bindings'">bindings</a>
                <ul class="nav-sublist"data-bind="async: { collapsed: ko.pureComputed(function() { return $router.route().matches('/bindings') === null }) }">
                  <li><a data-bind="path: '/bindings#path'">path</a></li>
                  <li><a data-bind="path: '/bindings#state'">state</a></li>
                  <li><a data-bind="path: '/bindings#query'">query</a></li>
                </ul>
              </li>
              <li><a data-bind="path: '/nested-routing/foo'">nested routing</a></li>
            </ul>
            <hr>
            <div class="text-center">
              <a href="https://github.com/caseyWebb/ko-component-router">
                <i class="fa fa-github"></i> View on Github
              </a>
            </div>
          </div>
        </div>
        <div class="col-sm-8 col-lg-8">
          <ko-component-router params="
            routes: routes,
            base: base,
            hashbang: hashbang,
            inTransition: inTransition,
            outTransition: outTransition">
          </ko-component-router>
        </div>
      </div>
    </div>
  `
})

$(() => {
  ko.applyBindings()
})
