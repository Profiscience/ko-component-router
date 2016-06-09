import history from 'html5-history-api'
import promise from 'es6-promise'
import raf from 'raf'
if (history.emulate) {
  history.redirect('!/', '')
}
if (!window.Promise) {
  promise.polyfill()
}
if (!window.requestAnimationFrame) {
  raf.polyfill()
}

import $ from 'jquery'
import ko from 'knockout'

import '../src'
import './views'
import './bindings'
import './styles'
import { inTransition, outTransition } from './lib/animate'

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
          pssst... this documentation is built using knockout + this router,
          <a href="https://github.com/Profiscience/ko-component-router/tree/gh-pages/example">source</a>
        </small>
        <h1>
          ko-component-router

          <small>
            / Profisciencē
          </small>
        </h1>
        <p>
          <img src="https://img.shields.io/npm/v/ko-component-router.svg" alt="NPM" title="" />
          <img src="https://img.shields.io/npm/l/ko-component-router.svg" alt="WTFPL" title="" />
          <a href="https://travis-ci.org/Profiscience/ko-component-router">
            <img src="https://img.shields.io/travis/Profiscience/ko-component-router.svg" alt="Travis" title="" />
          </a>
          <a href="https://coveralls.io/github/Profiscience/ko-component-router">
            <img src="https://img.shields.io/coveralls/Profiscience/ko-component-router.svg?maxAge=2592000" alt="Coveralls" title="" />
          </a>
          <a href="https://david-dm.org/Profiscience/ko-component-router">
            <img src="https://img.shields.io/david/Profiscience/ko-component-router.svg" alt="Dependency Status" title="" />
          </a>
          <a href="https://david-dm.org/Profiscience/ko-component-router#info=peerDependencies&amp;view=table">
            <img src="https://img.shields.io/david/peer/Profiscience/ko-component-router.svg?maxAge=2592000" alt="Peer Dependency Status" title="" />
          </a>
          <a href="http://npm-stat.com/charts.html?package=ko-component-router&amp;author=&amp;from=&amp;to=">
            <img src="https://img.shields.io/npm/dt/ko-component-router.svg?maxAge=2592000" alt="NPM Downloads" title="" />
          </a>
        </p>
      </div>

      <div class="row">
        <div class="side-nav col-sm-4 col-lg-3">
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
                  <li><a data-bind="path: '/context#path'">path</a></li>
                  <li><a data-bind="path: '/context#pathname'">pathname</a></li>
                  <li><a data-bind="path: '/context#canonicalPath'">canonicalPath</a></li>
                  <li><a data-bind="path: '/context#hash'">hash</a></li>
                  <li><a data-bind="path: '/context#isNavigating'">isNavigating</a></li>
                  <li><a data-bind="path: '/context#update'">update</a></li>
                  <li><a data-bind="path: '/context#addBeforeNavigateCallback'">addBeforeNavigateCallback</a></li>
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
              <a href="https://github.com/Profiscience/ko-component-router">
                <i class="fa fa-github"></i> View on Github
              </a>
            </div>
          </div>
        </div>
        <div class="col-sm-8">
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

$(() => ko.applyBindings())
