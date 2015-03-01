_toPlainArray = (stuff) ->
  isAlreadyPlainArray = stuff.indexOf? && !stuff.subscribe
  if !isAlreadyPlainArray then stuff else [stuff]

module.exports =

  ###
  Helper function for subscribing multiple observables
  to the same function
  Can be called with an optional subscriptionName parameter
  that allows subscriptions to later be destroyed by name
  If no name is specified, a GUID is used so subscriptions
  can still be disposed
  ###
  subscribe: (obsToSub, fn, subscriptionName) ->

    subscriptionName ?= new Date().getTime()

    obsToSub = _toPlainArray obsToSub

    for obs in obsToSub when obs.subscribe?
      obs.subscriptions ?= {}
      obs.subscriptions[subscriptionName] = obs.subscribe fn.bind(this)

    ko.router.exit ko.router.current, ->
      ko.router.utils.unsubscribe.call null, obsToSub

  ###
  Unsubscribe observable(s) by subscription name
  when no name is specified, all subscriptions are
  disposed
  ###
  unsubscribe: (obsToUnsub, subscriptionName) ->

    obsToSub = _toPlainArray obsToSub

    for obs in obsToUnsub

      if subscriptionName?
        obs.subscriptions?[subscriptionName]?.dispose()
        delete obs.subscriptions?[subscriptionName]

      else
        sub.dispose() for _, sub of obs.subscriptions
        obs.subscriptions = {}