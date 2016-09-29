import ko from 'knockout'
import { clone, deepEquals, identity, isUndefined, mapKeys, merge, normalizePath } from './utils'

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

  get(prop, defaultVal, parser = identity) {
    const query = this
    const ctx = this.ctx
    const guid = normalizePath(ctx.config.depth + ctx.pathname())

    if (!cache[guid]) {
      cache[guid] = {}
    }

    if (!cache[guid][prop]) {
      cache[guid][prop] = {
        parser,
        value: ko.pureComputed({
          read() {
            trigger()

            if (qsParams && qsParams[guid] && !isUndefined(qsParams[guid][prop])) {
              return cache[guid][prop].parser(qsParams[guid][prop])
            }

            return defaultVal
          },
          write(v) {
            const { pathname, hash } = location
            if (deepEquals(v, this.prev)) {
              return
            }
            this.prev = v

            merge(qsParams, {
              [guid]: { [prop]: v }
            }, false)

            ctx
              .update(pathname + hash, ctx.state(), false, query.getNonDefaultParams()[guid])
              .then(() => trigger(!trigger()))
          },
          owner: {
            prev: null
          }
        })
      }
    }

    if (defaultVal) {
      // clone to prevent defaultVal from being changed by reference
      cache[guid][prop].defaultVal = clone(defaultVal)
      if (qsParams && qsParams[guid] && isUndefined(qsParams[guid][prop])) {
        this.get(prop)(defaultVal)
      }
    }

    return cache[guid][prop].value
  }

  getAll(asObservable = false, pathname = this.ctx.pathname()) {
    const guid = normalizePath(this.ctx.config.depth + pathname)
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
      : ko.toJS(mapKeys(qsParams[guid] || {}, (prop) =>
          cache[guid] && cache[guid][prop]
            ? isUndefined(qsParams[guid][prop])
              ? undefined
              : cache[guid][prop].parser(qsParams[guid][prop])
            : qsParams[guid][prop]))
  }

  setDefaults(q, parser = identity) {
    for (const pn in q) {
      this.get(pn, q[pn], parser)
    }
  }

  clear(pathname) {
    if (typeof pathname !== 'string') {
      pathname = this.ctx.pathname()
    }
    const guid = normalizePath(this.ctx.config.depth + pathname)
    for (const pn in cache[guid]) {
      const p = cache[guid][pn]
      this.get(pn)(p.defaultVal)
    }
  }

  reload(force = false, guid = normalizePath(this.ctx.config.depth + this.ctx.pathname())) {
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
    const guid = normalizePath(this.ctx.config.depth + pathname)

    if (deepEquals(qsParams[guid], query)) {
      return
    }

    merge(qsParams, { [guid]: query }, false)
    trigger(!trigger())
  }

  updateFromString(str, pathname) {
    if (pathname) {
      const guid = normalizePath(this.ctx.config.depth + pathname)
      merge(qsParams, { [guid]: this.parse(str)[guid] }, false)
    } else {
      merge(qsParams, this.parse(str), false)
    }
    trigger(!trigger())
  }

  getNonDefaultParams(query, pathname) {
    const nonDefaultParams = {}
    const workingParams = qsParams

    if (query) {
      merge(workingParams, { [normalizePath(this.ctx.config.depth + pathname)]: query }, false)
    }

    for (const id in workingParams) {
      if (!cache[id]) {
        nonDefaultParams[id] = workingParams[id]
      } else {
        nonDefaultParams[id] = {}
        for (const pn in workingParams[id]) {
          const p = workingParams[id][pn]
          const c = cache[id][pn]
          const d = c && c.defaultVal
          if (!isUndefined(p) && !deepEquals(p, d)) {
            nonDefaultParams[id][pn] = p
          }
        }
      }
    }

    return nonDefaultParams
  }

  getFullQueryString(query, pathname) {
    return this.stringify(this.getNonDefaultParams(query, pathname))
  }

  parse(str) {
    const parser = ko.router.config.queryParser
    return parser(str)
  }

  stringify(query) {
    const stringifier = ko.router.config.queryStringifier
    return stringifier(query)
  }
}

export function factory(ctx) {
  return new Query(ctx)
}
