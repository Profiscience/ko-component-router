'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _query = require('./query');

var _state = require('./state');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      _knockout2.default.router = this;
    } else {
      this.$parent = parentRouterBindingCtx.$router;
      this.$parent.$child = this;
      config.base = this.$parent.pathname();
    }

    this.config = config;
    this.config.depth = Context.getDepth(this);

    this.isNavigating = _knockout2.default.observable(true);

    this.route = _knockout2.default.observable('');
    this.canonicalPath = _knockout2.default.observable('');
    this.path = _knockout2.default.observable('');
    this.pathname = _knockout2.default.observable('');
    this.hash = _knockout2.default.observable('');
    this.params = {};
    this.query = (0, _query.factory)(this);
    this.state = (0, _state.factory)(this);

    this._beforeNavigateCallbacks = [];
  }

  _createClass(Context, [{
    key: 'update',
    value: function update() {
      var origUrl = arguments.length <= 0 || arguments[0] === undefined ? this.canonicalPath() : arguments[0];
      var state = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var _this = this;

      var push = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
      var query = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      var url = this.resolveUrl(origUrl);
      var route = this.getRouteForUrl(url);
      var firstRun = this.route() === '';

      if (!route) {
        var _$parent;

        return this.$parent ? (_$parent = this.$parent).update.apply(_$parent, arguments) : false;
      }

      var fromCtx = this.toJS();

      var _route$parse = route.parse(url);

      var _route$parse2 = _slicedToArray(_route$parse, 6);

      var path = _route$parse2[0];
      var params = _route$parse2[1];
      var hash = _route$parse2[2];
      var pathname = _route$parse2[3];
      var querystring = _route$parse2[4];
      var childPath = _route$parse2[5];

      var samePage = this.pathname() === pathname;

      var shouldNavigatePromise = Promise.resolve(true);
      if (!samePage && !firstRun) {
        shouldNavigatePromise = this.runBeforeNavigateCallbacks();
        this.isNavigating(true);
        this.reload();
      }

      return shouldNavigatePromise.then(function (shouldNavigate) {
        if (!shouldNavigate) {
          return Promise.resolve(false);
        }

        _this._beforeNavigateCallbacks = [];

        if (!query && querystring) {
          query = _qs2.default.parse(querystring)[_this.config.depth + pathname];
        }

        var canonicalPath = Context.getCanonicalPath(_this.getBase().replace(/\/$/, ''), pathname, childPath, _this.query.getFullQueryString(query, pathname), hash);

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
          (0, _utils.extend)(toCtx, { state: fromCtx.state }, false);
        } else if (!_this.config.persistState && state) {
          toCtx.state = state;
        }

        if (_this.config.persistState) {
          toCtx.state = _this.state();
        }

        history[push ? 'pushState' : 'replaceState'](history.state, document.title, '' === canonicalPath ? _this.getBase() : canonicalPath);

        return new Promise(function (resolve) {
          if (firstRun) {
            complete.call(_this, true);
          } else if (!samePage) {
            _this.config.outTransition(_this.config.el, fromCtx, toCtx, complete.bind(_this));
            if (_this.config.outTransition.length !== 4) {
              complete.call(_this, true);
            }
          } else if (_this.$child) {
            _this.$child.update(childPath || '/', {}, false, {});
            complete.call(_this);
          } else {
            complete.call(_this);
          }

          function complete(animate) {
            var _this2 = this;

            var el = this.config.el.getElementsByClassName('component-wrapper')[0];
            delete toCtx.query;
            (0, _utils.extend)(this, toCtx);
            if (query) {
              this.query.update(query, pathname);
            }
            this.isNavigating(false);
            _knockout2.default.tasks.runEarly();
            resolve(true);

            if (animate) {
              _knockout2.default.tasks.schedule(function () {
                return _this2.config.inTransition(el, fromCtx, toCtx);
              });
            }
          }
        });
      });
    }
  }, {
    key: 'addBeforeNavigateCallback',
    value: function addBeforeNavigateCallback(cb) {
      this._beforeNavigateCallbacks.push(cb);
    }
  }, {
    key: 'runBeforeNavigateCallbacks',
    value: function runBeforeNavigateCallbacks() {
      var ctx = this;
      var callbacks = [];

      while (ctx) {
        callbacks = ctx._beforeNavigateCallbacks.concat(callbacks);
        ctx = ctx.$child;
      }

      return run(callbacks);

      function run(callbacks) {
        return new Promise(function (resolve) {
          if (callbacks.length === 0) {
            return resolve(true);
          }
          var cb = callbacks.shift();
          var recursiveResolve = function recursiveResolve() {
            var shouldUpdate = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
            return shouldUpdate ? run(callbacks).then(resolve) : resolve(false);
          };

          if (cb.length === 1) {
            cb(recursiveResolve);
          } else {
            var v = cb();
            if ((0, _utils.isUndefined)(v) || typeof v.then !== 'function') {
              recursiveResolve(v);
            } else {
              v.then(recursiveResolve);
            }
          }
        });
      }
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
  }, {
    key: 'resolveUrl',
    value: function resolveUrl(origUrl) {
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
      return url;
    }
  }, {
    key: 'toJS',
    value: function toJS() {
      return _knockout2.default.toJS({
        route: this.route,
        path: this.path,
        pathname: this.pathname,
        canonicalPath: this.canonicalPath,
        hash: this.hash,
        state: this.state,
        params: this.params,
        query: this.query.getAll(false, this.pathname())
      });
    }
  }, {
    key: 'getBase',
    value: function getBase() {
      var base = '';
      var p = this;
      while (p) {
        base = p.config.base + (!p.config.hashbang || p.$parent ? '' : '/#!') + base;
        p = p.$parent;
      }
      return base;
    }
  }], [{
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

exports.default = Context;