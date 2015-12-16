'use strict'

const ko = require('knockout')
const Params = require('./params')
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
    this.hash = ko.observable('')
    this.params = new Params(this)
    this.query = {}
  }

  update(route, url, state = {}, push = true) {
    this.route(route)

    if ('/' === url[0] && (0 !== url.indexOf(this.config.base) || '' === this.config.base)) {
      url = this.config.base + (this.config.hashbang ? '/#!' : '') + url
    } else if (0 === url.indexOf(this.config.base) && this.config.hashbang) {
      url = `${this.config.base}/#!${url.substr(this.config.base.length)}`
    }

    this.canonicalPath(url)

    url = url.replace(this.config.base, '')

    if (this.config.hashbang) {
      url = url.replace('/#!', '')
    }

    this.state(state)
    // this.querystring(~i ? utils.decodeURLEncodedURIComponent(path.slice(i + 1)) : '')

    const [path, params, hash, pathname] = route.parse(url)

    this.path(path)
    this.pathname(pathname)
    this.hash(hash)
    this.params.update(params)

    route.exec(this, push)
  }
}

module.exports = Context
