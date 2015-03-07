pathToRegExp = require 'path-to-regexp'

###
Route class

@private
###
class Route

  ###
  Constructs a new `route` object

  @private
  @param path {String}
  ###
  constructor: (path, @component) ->
    @paramKeys  = []
    @regExp     = pathToRegExp(path, @paramKeys)

  ###
  Check if this route produces a match for `path`

  @param path {String} path to check against route
  @return {Boolean} route matches
  ###
  matches: (path) ->
    path = path.split('?')[0]
    @regExp.exec(path)?

  ###
  Parses params from route

  @param path {String} path to parse params from
  @return {Object} route params
  ###
  params: (path) ->
    path    = path.split('?')[0]
    params  = {}

    [_, pathParams...] = @regExp.exec(path)

    params[k] = v for v, i in pathParams when (
      (v?)                        &&
      (v = decodeURIComponent(v)) &&
      (k = @paramKeys[i].name)
    )

    return params

module.exports = Route