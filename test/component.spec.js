'use strict'

var expect = require('chai').expect

window.ko = require('knockout')
var $ = require('jquery')

var router = require('../src/lib/router')
var ComponentViewModel = require('../src/lib/component')

describe('component', function() {

  before(function() {
    history.pushState({}, null, '/component')
    router.route('/component', 'component')
    router.start()
  })

  it('should get the component and context from the router', function() {
    var vm = new ComponentViewModel()

    expect(vm.component()).to.equal(router._component())
    expect(vm.ctx()).to.deep.equal(router._ctx())
  })
})
