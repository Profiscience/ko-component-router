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

    state.clear = function() {
      if (history.state && history.state[ctx.config.depth + ctx.pathname()]) {
        const newState = history.state
        delete newState[ctx.config.depth + ctx.pathname()]
        // history.replaceState(
        //   newState,
        //   document.title,
        //   '' === ctx.canonicalPath() ? ctx.config.base : ctx.canonicalPath()
        // )
      }
    }

    state.dispose = function() {
      state.clear()
      _dispose.apply(state, arguments)
    }

    return state
  }
}
