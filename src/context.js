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
    this.hash = ko.observable('')
    this.params = {}
    this.query = {}

    this.subscribeParams()
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
    utils.merge(this.params, params)

    route.exec(this, push)
  }

  subscribeParams() {
    this._paramSubs = []

    for (const paramName in this.params) {
      const param = this.params[paramName]
      this._paramSubs.push(param.subscribe(() => {
        const url = this.route().compile(ko.toJS(this.params))
        this.update(this.route(), url, null, false)
      }))
    }

    this._paramSubsUpdaterSub = this.component.subscribe(() => {
      this.unsubscribeParams()
      this.subscribeParams()
    })
  }

  unsubscribeParams() {
    this._paramSubsUpdaterSub.dispose()
    for (const sub of this._paramSubs) {
      sub.dispose()
    }
  }

  dispose() {
    this.unsubscribeParams()
  }
}

module.exports = Context
