'use strict'

const ko = require('knockout')
const qs = require('qs')
const utils = require('./utils')

const qsParams = {}
const trigger = ko.observable(true)
const cache = {}
let pendingWriteOp

class Query {
  constructor(ctx) {
    this.ctx = ctx

    this.get = this.get.bind(this)
    this.clear = this.clear.bind(this)
    this.update = this.update.bind(this)
  }

  get(prop, defaultVal) {
    const query = this
    const ctx = this.ctx
    const guid = this.ctx.config.depth + ctx.pathname()

    if (!cache[guid]) {
      cache[guid] = {}
    }

    if (!cache[guid][prop]) {
      cache[guid][prop] = {
        defaultVal,
        value: ko.pureComputed({
          read() {
            trigger()

            if (qsParams && qsParams[guid] && qsParams[guid][prop]) {
              return qsParams[guid][prop]
            }

            return defaultVal
          },
          write(v) {
            utils.merge(qsParams, {
              [guid]: { [prop]: v }
            }, false)

            if (pendingWriteOp) {
              window.cancelAnimationFrame(pendingWriteOp)
            }

            pendingWriteOp = window.requestAnimationFrame(() => {
              ctx.update(location.pathname + location.hash, ctx.state(), false, query.getNonDefaultParams()[guid])
              trigger(!trigger())
            })
          }
        })
      }
    }

    return cache[guid][prop].value
  }

  getAll(pathname = this.ctx.pathname()) {
    const guid = this.ctx.config.depth + pathname
    return ko.toJS(qsParams[guid]) || {}
  }

  clear(pathname = this.ctx.pathname()) {
    const guid = this.ctx.config.depth + pathname
    for (const pn in cache[guid]) {
      const p = cache[guid][pn]
      p.value(p.defaultVal)
    }
  }

  destroy() {
    const guid = this.ctx.config.depth + this.ctx.pathname()
    for (const p in qsParams[guid]) {
      if (cache[guid] && cache[guid][p]) {
        cache[guid][p].value.dispose()
      }
    }
    delete qsParams[guid]
    delete cache[guid]
  }

  update(query = {}, pathname = this.ctx.pathname()) {
    const guid = this.ctx.config.depth + pathname
    utils.merge(qsParams, { [guid]: query }, false)
    trigger(!trigger())
  }

  updateFromString(str) {
    const queries = qs.parse(str)
    utils.merge(qsParams, queries, false)
    trigger(!trigger())
  }

  getNonDefaultParams() {
    const nonDefaultParams = {}
    for (const id in qsParams) {
      if (!cache[id]) {
        nonDefaultParams[id] = qsParams[id]
      } else {
        nonDefaultParams[id] = {}
        for (const pn in qsParams[id]) {
          const p = qsParams[id][pn]
          const d = cache[id][pn].defaultVal
          if (typeof p !== 'undefined' && p !== d) {
            nonDefaultParams[id][pn] = p
          }
        }
      }
    }

    return nonDefaultParams
  }

  getFullQueryString() {
    return qs.stringify(this.getNonDefaultParams())
  }
}

module.exports = {
  factory(ctx) {
    return new Query(ctx)
  }
}
