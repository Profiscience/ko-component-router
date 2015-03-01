ko                = require 'knockout'
parseQueryString  = require 'qs/lib/parse'
extend            = require 'lodash/object/extend'

_defaults =
  hashbang:           false
  componentPrefix:    ''
  basePath:           '/'

_stripTrailingSlash = (s) ->
  s.replace /\/$/, ''

_parseParams = (ctx, next) ->
  @activeRouteParams = extend {}, ctx.params, parseQueryString(ctx.querystring)
  next()

_changePage = (component) -> (ctx) =>
  @activeRouteComponent "#{ko.router.config.componentPrefix}#{component}"

module.exports =

  class KoComponentRouterViewModel

    constructor: (params) ->

      { routes, options } = params
      ko.router.config    = extend {}, _defaults, options

      # unless explcitly specified, use url fragment before hash for
      # base when hashbang routing is being used
      if !options.basePath? && ko.router.config.hashbang
        ko.router.config.basePath = window.location.pathname

      @activeRouteComponent = ko.observable ''
      @activeRouteParams    = {}

      basePath = _stripTrailingSlash ko.router.config.basePath

      history.redirect '/', basePath if ko.router.config.hashbang
      ko.router.base basePath

      ko.router.apply null, ['*'].concat ko.router.config.middleware

      for own route, component of routes
        ko.router route,
                  _parseParams.bind(this),
                  _changePage.call(this, component)

      ko.router.start ko.router.config