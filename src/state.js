'use strict'

const ko = require('knockout')
const utils = require('./utils')

module.exports = {
  factory(ctx) {
    const trigger = ko.observable(false)

    const state = ko.pureComputed({
      read() {
        trigger()
        return history.state ? history.state[ctx.config.depth + ctx.pathname()] : {}
      },
      write(v) {
        if (v) {
          const oldState = history.state || {}
          const key = ctx.config.depth + ctx.pathname()
          delete oldState[key]

          history.replaceState(
            utils.merge(oldState, { [key]: v }, false),
            document.title,
            '' === ctx.canonicalPath() ? ctx.config.base : ctx.canonicalPath())

          trigger(!trigger())
        }
      }
    })

    const _dispose = state.dispose

    state.reload = function(force = false, guid = ctx.config.depth + ctx.pathname()) {
      if (!ctx.config.persistState || force) {
        if (history.state && history.state[guid]) {
          const newState = history.state
          delete newState[guid]
        }
      }
    }

    state.dispose = function() {
      for (const guid in history.state) {
        if (guid.indexOf(ctx.config.depth) === 0) {
          state.reload(true, guid)
        }
      }
      _dispose.apply(state, arguments)
    }

    return state
  }
}
