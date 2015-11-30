'use strict'

const ko = require('knockout')
const utils = require('./utils')

class Context {

  constructor(config) {
    this.config = config

    this.route = ko.observable('')
    this.component = ko.observable()
    this.state = ko.observable({})
    this.canonicalPath = ko.observable('')
    this.path = ko.observable('')
    this.pathname = ko.observable('')
    this.params = {}
    this.query = {}
    this.hash = ko.observable('')
  }

  update(route, path, state = {}, push = true) {
    this.route(route)

    if ('/' === path[0] && 0 !== path.indexOf(this.config.base)) {
      path = this.config.base + (this.config.hashbang ? '#!' : '') + path
    }

    this.canonicalPath(path)
    path = path.replace(this.config.base, '') || '/'

    if (this.config.hashbang) {
      path = this.path().replace('#!', '') || '/'
    }

    this.state(state)

    const i = path.indexOf('?')
    // this.querystring(~i ? utils.decodeURLEncodedURIComponent(path.slice(i + 1)) : '')
    this.pathname(utils.decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path))
    // this.hash('')

    const [params, childPath] = route.parse(path)

    path = path.replace(childPath, '')
    utils.merge(this.params, params)

    // if (!this.config.hashbang && ~this.path().indexOf('#')) {
    //   const parts = this.path().split('#')
    //   this.path(parts[0])
      // this.hash(utils.decodeURLEncodedURIComponent(parts[1]) || '')
      // this.querystring(this.querystring().split('#')[0])
    // }

    this.path(path)
    route.exec(this, push)
  }
}

module.exports = Context
