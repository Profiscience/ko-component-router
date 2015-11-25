'use strict'

const ko = require('knockout')
const utils = require('./utils')

class Context {

  constructor(config) {
    this.config = config

    this.route = ko.observable('')
    this.state = ko.observable({})
    this.canonicalPath = ko.observable('')
    this.path = ko.observable('')
    this.querystring = ko.observable('')
    this.pathname = ko.observable('')
    this.params = {}
    this.query = {}
    this.hash = ko.observable('')
  }

  update(path, state) {
    if ('/' === path[0] && 0 !== path.indexOf(this.config.base)) {
      path = this.config.base + (this.config.hashbang ? '#!' : '') + path
    }

    const i = path.indexOf('?')

    this.canonicalPath(path)
    this.path(path.replace(this.config.base, '') || '/')

    if (this.config.hashbang) {
      this.path(this.path.replace('#!', '') || '/')
    }

    this.state(state || {})
    this.querystring(~i ? utils.decodeURLEncodedURIComponent(path.slice(i + 1)) : '')
    this.pathname(utils.decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path))
    this.hash('')

    if (!this.config.hashbang) {
      if (!~this.path().indexOf('#')) {
        return
      }

      const parts = this.path().split('#')
      this.path(parts[0])
      this.hash(utils.decodeURLEncodedURIComponent(parts[1]) || '')
      this.querystring(this.querystring.split('#')[0])
    }
  }

  pushState() {
    history.pushState(
      this.state(),
      document.title,
      this.config.hashbang && this.path() !== '/'
        ? '#!' + this.path()
        : this.canonicalPath())
  }
}

module.exports = Context
