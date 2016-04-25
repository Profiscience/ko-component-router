'use strict'

const ko = require('knockout')

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
          const state = history.state || {}
          const key = ctx.config.depth + ctx.pathname()

          if (state[key]) {
            delete state[key]
          }

          state[key] = v
          history.replaceState(state, document.title)
          trigger(!trigger())
          ko.tasks.runEarly()
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
