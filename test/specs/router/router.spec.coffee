ko = require 'knockout'
{ expect } = require 'chai'

linkClicker = require '../../support/linkClicker'

HashbangRouter = require '../../../src/lib/router/HashbangRouter'

module.exports = (Router, basePath = '') ->

  router = null
  routes =
    '/init':      'init'

    '/replacestate': 'replacestate'
    '/pushstate':    'pushstate'
    '/popstate':     'popstate'
    '/hashchange':   'hashchange'

    '/links':          'links'
    '/links/absolute': 'absolutelink'
    '/links/relative': 'relativelink'
    '/links/query':    'linkquery'

    '/specificity/specificBefore': 'specificBefore'
    '/specificity/:foo':           'foo'
    '/specificity/specificAfter':  'specificAfter'

    '/router/show':     'routershow'
    '/router/redirect': 'routerredirect'
    '/router/query':    'routerquery'

    '/params/:foo/:bar?': 'params'

  before ->
    history.pushState({}, null, basePath + '/init')
    router = new Router(ko, routes, basePath.replace('/#!', ''))

  after ->
    router._stop()
    history.replaceState({}, null, '/init')

  describe 'initialization', ->

    it 'should redirect to the correct url', ->
      expect(location.href.replace(location.origin, '')).to.equal(basePath + '/init')

    it 'should set the current component', ->
      expect(router.current().component).to.equal('init')

  describe 'navigation', ->

    describe 'external changes', ->

      it 'should react to pushstate', ->
        history.pushState(null, null, basePath + '/pushstate')
        expect(router.current().component).to.equal('pushstate')

      it 'should react to replacestate', ->
        history.replaceState(null, null, basePath + '/replacestate')
        expect(router.current().component).to.equal('replacestate')

      it 'should react to popstate', (next) ->
        assert = ->
          window.removeEventListener('popstate', assert)
          expect(router.current().component).to.equal('popstate')
          next()

        window.addEventListener('popstate', assert)

        history._nativePushState(null, null, basePath + '/popstate')
        history._nativePushState(unique: true, null, basePath + '/popstate')
        history.back()

      if basePath.indexOf('#!') > -1

        it 'should react to hashchange', ->
          location.hash = '!/hashchange'
          expect(router.current().component).to.equal('hashchange')

    describe 'links', ->

      it 'should work with absolute paths', ->
        linkClicker('/links/absolute')
        expect(router.current().component).to.equal('absolutelink')

      it 'should not do anything if the path is the same', ->
        linkClicker('/links/absolute')
        expect(router.current().component).to.equal('absolutelink')

      it 'should work with relative paths', ->
        linkClicker('relative')
        expect(router.current().component).to.equal('relativelink')

      it 'should work with relative paths up a directory', ->
        linkClicker('..')
        expect(router.current().component).to.equal('links')

      it 'should clear the state', ->
        expect(router.state()).to.deep.equal({})

      it 'should preserve the querystring', ->
        linkClicker('/links/query?foo=bar')
        expect(router.current().component).to.equal('linkquery')
        expect(window.location.href).to.contain('?foo=bar')

    describe 'ko.router.show', ->

      it 'should navigate to the correct page', ->
        router.show('/router/show')
        expect(router.current().component).to.equal('routershow')

      it 'should clear the state', ->
        expect(router.state()).to.deep.equal({})

      it 'should work with querystrings', ->
        router.show('/router/query?foo=bar')
        expect(router.current().component).to.equal('routerquery')
        expect(window.location.href).to.contain('?foo=bar')

    describe 'ko.router.redirect', ->

      it 'should navigate to the correct page', ->
        router.redirect('/router/redirect')
        expect(router.current().component).to.equal('routerredirect')

      it 'should clear the state', ->
        expect(router.state()).to.deep.equal({})

      it 'should work with querystrings', ->
        router.show('/router/query?foo=bar')
        expect(router.current().component).to.equal('routerquery')
        expect(window.location.href).to.contain('?foo=bar')

    describe 'specificity', ->

      it 'should use the route with the most specificity when listed before', ->
        router.show('/specificity/specificBefore')
        expect(router.current().component).to.equal('specificBefore')

      it 'should use the route with the most specificity when listed after', ->
        router.show('/specificity/specificAfter')
        expect(router.current().component).to.equal('specificAfter')

  describe 'params', ->

    it 'should pass in the correct params', ->
      history.pushState(null, null, basePath + '/params/foo')
      expect(router.current().routeParams).to.deep.equal(foo: 'foo')