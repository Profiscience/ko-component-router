###
Viewmodel class for <ko-component-router>

@private
###
class KoComponentRouterViewModel

  ###
  Constructs a new router viewmodel that sets
  the component on page change

  @param _ko {Knockout} knockout context
  ###
  constructor: (_ko) ->
    @_router = _ko.router

    @component   = _ko.observable(@_router.current().component)
    @routeParams = _ko.observable(@_router.current().routeParams)

    @_pageChangeSubscription = @_router.current.subscribe (current) =>
      return if current.component == @component()
      @routeParams(current.routeParams)
      @component(current.component)

  ###
  ko `dispose` callback to destroy bindings and subscriptions

  @note called automatically when a component is destroyed
  ###
  dispose: ->
    @_pageChangeSubscription.dispose()
    @_router._stop()

module.exports = KoComponentRouterViewModel