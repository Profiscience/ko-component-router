$ = require 'jquery'

module.exports = (path) ->

  $('body').append("<a href='#{path}' id='link'>link to #{path}</a>")
  el = $('#link')[0]

  el.click()
  $(el).remove()