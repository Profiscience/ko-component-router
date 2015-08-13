'use strict'

var expect = require('chai').expect
var ko = require('knockout')
var $ = require('jquery')

var router = require('../src/lib/router')

require('../src/lib/binding')

describe('binding', function() {

  it('should set the correct href with no base path', function() {
    var el = $('<a></a>').get(0)
    ko.bindingHandlers.route.init(el, ko.observable('/binding'))
    expect($(el).attr('href')).to.equal(router._basePath + '/binding')
  })

  it('should set the correct href with a base path', function() {
    var el = $('<a></a>').get(0)
    router._basePath = '/base'
    ko.bindingHandlers.route.init(el, ko.observable('/binding'))
    expect($(el).attr('href')).to.equal(router._basePath + '/binding')
  })
})
