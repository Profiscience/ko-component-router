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
    value: function update(_, __, push) {
      var _this = this;

      if (this._queuedArgs) {
        var _queuedArgs = _slicedToArray(this._queuedArgs, 3);

        var p = _queuedArgs[2];

        arguments[2] = p || push;
      }
      this._queuedArgs = arguments;

      if (this._queuedUpdate) {
        return this._queuedUpdate;
      }

      return this._queuedUpdate = new Promise(function (resolve) {
        _knockout2.default.tasks.schedule(function () {
          _this._update.apply(_this, _this._queuedArgs).then(resolve);
          _this._queuedUpdate = false;
        });
      });
    }
  }, {
    key: '_update',
    value: function _update() {
      var origUrl = arguments.length <= 0 || arguments[0] === undefined ? this.canonicalPath() : arguments[0];
      var state = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var push = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var _this2 = this;

      var query = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
      var viaPathBinding = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

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

      var shouldNavigatePromise = samePage ? this.$child ? this.$child.update(childPath || '/', viaPathBinding ? state : false, false, viaPathBinding ? query : false) : Promise.resolve(true) : this.runBeforeNavigateCallbacks();

      return shouldNavigatePromise.then(function (shouldNavigate) {
        if (!shouldNavigate) {
          return Promise.resolve(false);
        }

        if (!samePage && !firstRun || _this2.config._forceReload) {
          _this2.isNavigating(true);
          _this2.reload();
          _this2._beforeNavigateCallbacks = [];
        }

        if (!query && querystring) {
          query = _qs2.default.parse(querystring)[_this2.config.depth + pathname];
        }

        var canonicalPath = Context.getCanonicalPath(_this2.getBase().replace(/\/$/, ''), pathname, childPath, _this2.query.getFullQueryString(query, pathname), hash);

        var toCtx = {
          path: path,
          pathname: pathname,
          canonicalPath: canonicalPath,
          hash: hash,
          params: params,
          query: query,
          // route must come last
          route: route
        };

        if (state === false && samePage) {
          toCtx.state = fromCtx.state;
        } else if (!_this2.config.persistState && state) {
          toCtx.state = state;
        }

        if (_this2.config.persistState) {
          toCtx.state = _this2.state();
        }

        if (!samePage || !(0, _utils.deepEquals)(fromCtx.query, toCtx.query)) {
          history[push ? 'pushState' : 'replaceState'](history.state, document.title, '' === canonicalPath ? _this2.getBase() : canonicalPath);
        }

        return new Promise(function (resolve) {
          var complete = function complete(animate) {
            var el = _this2.config.el.getElementsByClassName('component-wrapper')[0];
            delete toCtx.query;
            toCtx.route.runPipeline(toCtx).then(function () {
              if (fromCtx.route.component === toCtx.route.component) {
                if (_this2.config._forceReload) {
                  var r = toCtx.route;
                  _this2.config._forceReload = false;
                  toCtx.route = { component: '__KO_ROUTER_EMPTY_COMPONENT__' };
                  (0, _utils.extend)(_this2, toCtx);
                  _knockout2.default.tasks.runEarly();
                  _this2.route(r);
                } else {
                  (0, _utils.merge)(_this2, toCtx);
                }
              } else {
                (0, _utils.extend)(_this2, toCtx);
              }

              if (query) {
                _this2.query.update(query, pathname);
              }
              _this2.isNavigating(false);
              _knockout2.default.tasks.runEarly();
              resolve(true);
              if (animate) {
                _knockout2.default.tasks.schedule(function () {
                  return _this2.config.inTransition(el, fromCtx, toCtx);
                });
              }
              if (_this2.$child) {
                _this2.$child.update(childPath || '/', viaPathBinding ? state : false, false, viaPathBinding ? query : false);
              }
            });
          };

          if (firstRun || samePage) {
            complete(firstRun);
          } else if (!samePage) {
            _this2.config.outTransition(_this2.config.el, fromCtx, toCtx, complete);
            if (_this2.config.outTransition.length !== 4) {
              complete(true);
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
      return (0, _utils.cascade)(callbacks);
    }
  }, {
    key: 'forceReloadOnParamChange',
    value: function forceReloadOnParamChange() {
      this.config._forceReload = true;
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