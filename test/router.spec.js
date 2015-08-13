'use strict'

var expect = require('chai').expect
var sinon = require('sinon')

var ko = require('knockout')
var page = require('page')

var router = require('../src/lib/router')

var testCounter = 0

function runTests(config) {
  testCounter++

  config.basePath = config.basePath || ''

  describe('router.start', function() {
    var pageBaseSpy, pageStartSpy

    before(function() {
      history.pushState({}, null, config.basePath + '/start')

      router.route('/start', 'start')

      pageBaseSpy = sinon.spy(page, 'base')
      pageStartSpy = sinon.spy(page, 'start')

      router.start(config)
    })

    after(function() {
      page.base.restore()
      page.start.restore()
    })

    it('should set the base path if applicable', function() {
      if (config.basePath)
        expect(pageBaseSpy.calledWith(config.basePath)).to.be.true
      else if (!config.basePath)
        expect(pageBaseSpy.called).to.be.false
    })

    it('should pass the options to page', function() {
      expect(pageStartSpy.calledWith(config)).to.be.true
    })

    it('should load the component', function() {
      expect(ko.components.isRegistered('ko-component-router')).to.be.true
    })
  })

  describe('router.show', function() {
    var pageShowSpy

    before(function() {
      pageShowSpy = sinon.spy(page, 'show')
      router.route('/show', 'show')
      router.show(config.basePath + '/show')
    })

    after(function() {
      page.show.restore()
    })

    it('should call page.show', function() {
      expect(pageShowSpy.calledWith(config.basePath + '/show')).to.be.true
    })
  })

  describe('router.redirect', function() {
    var pageRedirect

    before(function() {
      pageRedirect = sinon.spy(page, 'redirect')
      router.route('/redirect', 'redirect')
      router.redirect(config.basePath + '/redirect')
    })

    after(function() {
      page.redirect.restore()
    })

    it('should call page.redirect', function() {
      expect(pageRedirect.calledWith(config.basePath + '/redirect')).to.be.true
    })
  })

  describe('router.component and router.ctx', function() {

    it('should set router.component and router.ctx', function(done) {
      router.route('/component-' + testCounter, 'component', getAssert(done))
      router.show(config.basePath + '/component-' + testCounter)

      function getAssert(cb) {
        return function (ctx, next) {
          expect(router.component()).to.equal('component')
          expect(router.ctx()).to.exist
          cb()
          next()
        }
      }
    })
  })

  describe('middleware', function() {

    it('should call the middleware', function(done) {
      router.route('/middleware-' + testCounter, getAssert(done), 'middleware')
      router.show(config.basePath + '/middleware-' + testCounter)

      function getAssert(cb) {
        return function assert(ctx, next) {
          expect(true).to.be.true
          cb()
          next()
        }
      }
    })
  })
}

runTests({ hashbang: true })
runTests({ hashbang: false, basePath: '/testing' })
