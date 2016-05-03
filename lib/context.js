'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ko = require('knockout');
var qs = require('qs');
var queryFactory = require('./query').factory;
var stateFactory = require('./state').factory;

var _require = require('./utils');

var merge = _require.merge;

var Context = function () {
  function Context(bindingCtx, config) {
    _classCallCheck(this, Context);

    bindingCtx.$router = this;

    var parentRouterBindingCtx = bindingCtx;
    var isRoot = true;
    while (parentRouterBindingCtx.$parentContext) {
      parentRouterBindingCtx = parentRouterBindingCtx.$parentContext;
      if (parentRouterBindingCtx.$router) {
        isRoot = false;
        break;
      } else {
        parentRouterBindingCtx.$router = this;
      }
    }

    if (isRoot) {
      ko.router = this;
    } else {
      this.$parent = parentRouterBindingCtx.$router;
      this.$parent.$child = this;
      config.base = this.$parent.pathname();
    }

    this.config = config;
    this.config.depth = Context.getDepth(this);

    this.isNavigating = ko.observable(true);

    this.route = ko.observable('');
    this.canonicalPath = ko.observable('');
    this.path = ko.observable('');
    this.pathname = ko.observable('');
    this.hash = ko.observable('');
    this.params = {};
    this.query = queryFactory(this);
    this.state = stateFactory(this);
  }

  _createClass(Context, [{
    key: 'update',
    value: function update() {
      var origUrl = arguments.length <= 0 || arguments[0] === undefined ? this.canonicalPath() : arguments[0];
      var state = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var push = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
      var query = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      var url = (origUrl + '').replace('/#!', '');

      if (url.indexOf('./') === 0) {
        url = url.replace('./', '/');
      } else {
        var p = this;
        while (p && url.indexOf(p.config.base) > -1) {
          url = url.replace(p.config.base, '');
          p = p.$parent;
        }
      }

      var route = this.getRouteForUrl(url);
      var firstRun = this.route() === '';

      if (!route) {
        var _$parent;

        return this.$parent ? (_$parent = this.$parent).update.apply(_$parent, arguments) : false;
      }

      var fromCtx = ko.toJS({
        route: this.route,
        path: this.path,
        pathname: this.pathname,
        canonicalPath: this.canonicalPath,
        hash: this.hash,
        state: this.state,
        params: this.params,
        query: this.query.getAll(false, this.pathname())
      });

      var _route$parse = route.parse(url);

      var _route$parse2 = _slicedToArray(_route$parse, 6);

      var path = _route$parse2[0];
      var params = _route$parse2[1];
      var hash = _route$parse2[2];
      var pathname = _route$parse2[3];
      var querystring = _route$parse2[4];
      var childPath = _route$parse2[5];


      var samePage = this.pathname() === pathname;
      if (!samePage && !firstRun) {
        this.isNavigating(true);
        this.reload();
      }

      if (!query && querystring) {
        query = qs.parse(querystring)[this.config.depth + pathname];
      }

      var canonicalPath = Context.getCanonicalPath(Context.getBase(this).replace(/\/$/, ''), pathname, childPath, this.query.getFullQueryString(query, pathname), hash);

      var toCtx = {
        route: route,
        path: path,
        pathname: pathname,
        canonicalPath: canonicalPath,
        hash: hash,
        params: params,
        query: query
      };

      if (state === false && samePage) {
        merge(toCtx, { state: fromCtx.state }, false);
      } else if (!this.config.persistState && state) {
        toCtx.state = {};
        merge(toCtx.state, state, false, true);
      }

      if (this.config.persistState) {
        toCtx.state = this.state();
      }

      history[push ? 'pushState' : 'replaceState'](history.state, document.title, '' === canonicalPath ? Context.getBase(this) : canonicalPath);

      if (firstRun) {
        complete.call(this, true);
      } else if (!samePage) {
        this.config.outTransition(this.config.el, fromCtx, toCtx, complete.bind(this));

        if (this.config.outTransition.length !== 4) {
          complete.call(this, true);
        }
      } else if (this.$child) {
        this.$child.update(childPath || '/', {}, false, {});
        complete.call(this);
      } else {
        complete.call(this);
      }

      function complete(animate) {
        var _this = this;

        var el = this.config.el.getElementsByClassName('component-wrapper')[0];
        delete toCtx.query;
        merge(this, toCtx);
        if (query) {
          this.query.update(query, pathname);
        }
        this.isNavigating(false);
        ko.tasks.runEarly();

        if (animate) {
          ko.tasks.schedule(function () {
            return _this.config.inTransition(el, fromCtx, toCtx);
          });
        }
      }

      return true;
    }
  }, {
    key: 'getRouteForUrl',
    value: function getRouteForUrl(url) {
      var pathname = url.split('#')[0].split('?')[0];

      var matchingRouteWithFewestDynamicSegments = void 0;
      var fewestMatchingSegments = Infinity;

      for (var rn in this.config.routes) {
        var r = this.config.routes[rn];
        if (r.matches(pathname)) {
          if (r._keys.length === 0) {
            return r;
          } else if (fewestMatchingSegments === Infinity || r._keys.length < fewestMatchingSegments && r._keys[0].pattern !== '.*') {
            fewestMatchingSegments = r._keys.length;
            matchingRouteWithFewestDynamicSegments = r;
          }
        }
      }
      return matchingRouteWithFewestDynamicSegments;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.$child) {
        this.$child.destroy();
        delete this.$child;
      }

      this.query.dispose();
      this.state.dispose();
    }
  }, {
    key: 'reload',
    value: function reload() {
      if (this.$child) {
        this.$child.destroy();
        delete this.$child;
      }

      this.query.reload();
      this.state.reload();
    }
  }], [{
    key: 'getBase',
    value: function getBase(ctx) {
      var base = '';
      var p = ctx;
      while (p) {
        base = p.config.base + (!p.config.hashbang || p.$parent ? '' : '/#!') + base;
        p = p.$parent;
      }
      return base;
    }
  }, {
    key: 'getCanonicalPath',
    value: function getCanonicalPath(base, pathname) {
      var childPath = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
      var querystring = arguments[3];
      var hash = arguments.length <= 4 || arguments[4] === undefined ? '' : arguments[4];

      return '' + base + pathname + childPath + (querystring ? '?' + querystring : '') + (hash ? '#' + hash : '');
    }
  }, {
    key: 'getDepth',
    value: function getDepth(ctx) {
      var depth = 0;
      while (ctx.$parent) {
        ctx = ctx.$parent;
        depth++;
      }
      return depth;
    }
  }]);

  return Context;
}();

module.exports = Context;