'use strict'

const ko = require('knockout')
const qs = require('qs')
const utils = require('./utils')

const qsParams = {}
const trigger = ko.observable(true)
const cache = {}

class Query {
  constructor(ctx) {
    this.ctx = ctx

    if (!this.ctx.$parent) {
      const qsIndex = window.location.href.indexOf('?')
      if (~qsIndex) {
        this.updateFromString(window.location.href.split('?')[1])
      }
    }

    // make work w/ click bindings w/o closure
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
            if (utils.deepEquals(v, this.prev)) {
              return
            }
            this.prev = v

            utils.merge(qsParams, {
              [guid]: { [prop]: v }
            }, false)

            ctx.update(location.pathname + location.hash, ctx.state(), false, query.getNonDefaultParams()[guid])
            trigger(!trigger())
          },
          owner: {
            prev: null
          }
        })
      }
    }
    return cache[guid][prop].value
  }

  getAll(asObservable = false, pathname = this.ctx.pathname()) {
    const guid = this.ctx.config.depth + pathname
    return asObservable
      ? ko.pureComputed({
          read() {
            trigger()
            return this.getAll()
          },
          write(q) {
            for (const pn in q) {
              this.get(pn)(q[pn])
            }
          }
        }, this)
      : (ko.toJS(qsParams[guid]) || {})
  }

  setDefaults(q) {
    for (const pn in q) {
      this.get(pn, q[pn])
    }
  }

  clear(pathname) {
    if (typeof pathname !== 'string') {
      pathname = this.ctx.pathname()
    }
    const guid = this.ctx.config.depth + pathname
    for (const pn in cache[guid]) {
      const p = cache[guid][pn]
      p.value(p.defaultVal)
    }
  }

  reload(force = false, guid = this.ctx.config.depth + this.ctx.pathname()) {
    if (!this.ctx.config.persistQuery || force) {
      for (const p in qsParams[guid]) {
        if (cache[guid] && cache[guid][p]) {
          cache[guid][p].value.dispose()
        }
      }
      delete qsParams[guid]
      delete cache[guid]
    }
    trigger(!trigger())
  }

  dispose() {
    for (const guid in qsParams) {
      if (guid.indexOf(this.ctx.config.depth) === 0) {
        this.reload(true, guid)
      }
    }
  }

  update(query = {}, pathname = this.ctx.pathname()) {
    const guid = this.ctx.config.depth + pathname

    if (utils.deepEquals(qsParams[guid], query)) {
      return
    }

    utils.merge(qsParams, { [guid]: query }, false)
    trigger(!trigger())
  }

  updateFromString(str, pathname) {
    if (pathname) {
      const guid = this.ctx.config.depth + pathname
      utils.merge(qsParams, { [guid]: qs.parse(str)[guid] }, false)
    } else {
      utils.merge(qsParams, qs.parse(str), false)
    }
    trigger(!trigger())
  }

  getNonDefaultParams(query, pathname) {
    const nonDefaultParams = {}
    const workingParams = qsParams

    if (query) {
      utils.merge(workingParams, { [this.ctx.config.depth + pathname]: query }, false)
    }

    for (const id in workingParams) {
      if (!cache[id]) {
        nonDefaultParams[id] = workingParams[id]
      } else {
        nonDefaultParams[id] = {}
        for (const pn in workingParams[id]) {
          const p = workingParams[id][pn]
          const d = cache[id][pn].defaultVal
          if (typeof p !== 'undefined' && !utils.deepEquals(p, d)) {
            nonDefaultParams[id][pn] = p
          }
        }
      }
    }

    return nonDefaultParams
  }

  getFullQueryString(query, pathname) {
    return qs.stringify(this.getNonDefaultParams(query, pathname))
  }
}

module.exports = {
  factory(ctx) {
    return new Query(ctx)
  }
}
