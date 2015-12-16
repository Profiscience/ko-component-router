'use strict'

const ko = require('knockout')
const utils = require('./utils')

class Params {
  constructor(ctx) {
    this.ctx = ctx
    this.subscribe()
  }

  update(params) {
    utils.merge(this, params)
  }

  subscribe() {
    this._subs = []

    for (const paramName in this) {
      const param = this[paramName]
      if (!ko.isObservable(param)) {
        continue
      }
      this._subs.push(param.subscribe(() => {
        const url = this.ctx.route().compile(ko.toJS(this))
        this.ctx.update(this.ctx.route(), url, null, false)
      }))
    }

    this._subsUpdaterSub = this.ctx.component.subscribe(() => {
      this.unsubscribe()
      this.subscribe()
    })
  }

  unsubscribe() {
    this._subsUpdaterSub.dispose()
    for (const sub of this._subs) {
      sub.dispose()
    }
  }
}

module.exports = Params
