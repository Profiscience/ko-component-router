ko            = require 'knockout'
isFunction    = require 'lodash/lang/isFunction'
isPlainObject = require 'lodash/lang/isPlainObject'

module.exports =

  ko.pureComputed

    read: ->
      @updateComputed()
      history.state.koRouterState ? {}

    write: (state) ->
      ko.router.replace ko.router.current, koRouterState: @removeFuncs state
      @updateComputed.notifySubscribers()

    owner:
      # some hackery to force knockout to re-evaluate the computed
      # works by creating a dependency on 'updateComputed' in the read
      # function, and then triggering an update in the write function
      updateComputed: ko.observable()

      # attempting to store functions in state results in an error,
      # so this is a utility to remove all functions from an object
      removeFuncs: (obj) ->
        objWithoutFuncs = {}

        for key, val of obj
          switch
            when isFunction val     then continue
            when isPlainObject val  then objWithoutFuncs[key] = @removeFuncs val
            else objWithoutFuncs[key] = val

        return objWithoutFuncs