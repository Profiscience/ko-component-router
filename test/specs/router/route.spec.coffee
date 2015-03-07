{ expect }   = require 'chai'
pathToRegExp = require 'path-to-regexp'

Route = require '../../../src/lib/router/lib/route'

module.exports = ->

  describe 'route', ->

    describe 'matching', ->

      it 'should match without any params', ->
        route = new Route('/foo', 'foo')
        expect(route.matches('/foo')).to.be.true
        expect(route.matches('/bar')).to.be.false

      it 'should match with params', ->
        route = new Route('/foo/:bar', 'foo')
        expect(route.matches('/foo/bar')).to.be.true
        expect(route.matches('/foo')).to.be.false

      it 'should match with optional params', ->
        route = new Route('/foo/:bar/:baz?', 'foo')
        expect(route.matches('/foo')).to.be.false
        expect(route.matches('/foo/bar')).to.be.true
        expect(route.matches('/foo/bar/baz')).to.be.true

    describe 'params', ->

      it 'should get the correct params', ->
        route = new Route('/foo/:bar/:baz?', 'foo')
        expect(route.params('/foo/bar')).to.deep.equal(bar: 'bar')
        expect(route.params('/foo/bar/baz')).to.deep.equal(bar: 'bar', baz: 'baz')