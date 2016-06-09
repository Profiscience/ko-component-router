(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define(["knockout"], factory);
	else if(typeof exports === 'object')
		exports["ko-component-router"] = factory(require("knockout"));
	else
		root["ko-component-router"] = factory(root["ko"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _knockout = __webpack_require__(1);

	var _knockout2 = _interopRequireDefault(_knockout);

	var _router = __webpack_require__(2);

	var _router2 = _interopRequireDefault(_router);

	__webpack_require__(14);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_knockout2.default.components.register('ko-component-router', {
	  viewModel: _router2.default,
	  template: '<div data-bind=\'if: ctx.route().component\'>\n      <div class="component-wrapper" data-bind=\'component: {\n        name: ctx.route().component,\n        params: ctx\n      }\'></div>\n    </div>'
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _knockout = __webpack_require__(1);

	var _knockout2 = _interopRequireDefault(_knockout);

	var _context = __webpack_require__(3);

	var _context2 = _interopRequireDefault(_context);

	var _route = __webpack_require__(11);

	var _route2 = _interopRequireDefault(_route);

	var _utils = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var clickEvent = !(0, _utils.isUndefined)(document) && document.ontouchstart ? 'touchstart' : 'click';

	var Router = function () {
	  function Router(el, bindingCtx, _ref) {
	    var routes = _ref.routes;
	    var _ref$base = _ref.base;
	    var base = _ref$base === undefined ? '' : _ref$base;
	    var _ref$hashbang = _ref.hashbang;
	    var hashbang = _ref$hashbang === undefined ? false : _ref$hashbang;
	    var _ref$inTransition = _ref.inTransition;
	    var inTransition = _ref$inTransition === undefined ? noop : _ref$inTransition;
	    var _ref$outTransition = _ref.outTransition;
	    var outTransition = _ref$outTransition === undefined ? noop : _ref$outTransition;
	    var _ref$persistState = _ref.persistState;
	    var persistState = _ref$persistState === undefined ? false : _ref$persistState;
	    var _ref$persistQuery = _ref.persistQuery;
	    var persistQuery = _ref$persistQuery === undefined ? false : _ref$persistQuery;

	    _classCallCheck(this, Router);

	    for (var route in routes) {
	      routes[route] = new _route2.default(route, routes[route]);
	    }

	    this.config = {
	      el: el,
	      base: base,
	      hashbang: hashbang,
	      routes: routes,
	      inTransition: inTransition,
	      outTransition: outTransition,
	      persistState: persistState,
	      persistQuery: persistQuery
	    };

	    this.ctx = new _context2.default(bindingCtx, this.config);

	    this.onpopstate = this.onpopstate.bind(this);
	    this.onclick = this.onclick.bind(this);
	    window.addEventListener('popstate', this.onpopstate, false);
	    document.addEventListener(clickEvent, this.onclick, false);

	    var dispatch = true;
	    if (this.ctx.$parent) {
	      dispatch = this.ctx.$parent.path() !== this.ctx.$parent.canonicalPath();
	    }

	    if (dispatch) {
	      var path = this.config.hashbang && ~location.hash.indexOf('#!') ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;

	      this.dispatch({ path: path });
	    }
	  }

	  _createClass(Router, [{
	    key: 'dispatch',
	    value: function dispatch(_ref2) {
	      var path = _ref2.path;
	      var state = _ref2.state;
	      var _ref2$pushState = _ref2.pushState;
	      var pushState = _ref2$pushState === undefined ? false : _ref2$pushState;

	      if (path.toLowerCase().indexOf(this.config.base.toLowerCase()) === 0) {
	        path = path.substr(this.config.base.length) || '/';
	      }

	      return this.ctx.update(path, state, pushState, false);
	    }
	  }, {
	    key: 'onpopstate',
	    value: function onpopstate(_ref3) {
	      var state = _ref3.state;

	      this.dispatch({
	        path: location.pathname + location.search + location.hash,
	        state: (state || {})[this.ctx.config.depth + this.ctx.pathname()]
	      });
	    }
	  }, {
	    key: 'onclick',
	    value: function onclick(e) {
	      if (1 !== which(e) || e.metaKey || e.ctrlKey || e.shiftKey) {
	        return;
	      }

	      // ensure link
	      var el = e.target;
	      while (el && 'A' !== el.nodeName) {
	        el = el.parentNode;
	      }
	      if (!el || 'A' !== el.nodeName) {
	        return;
	      }

	      var isDownload = el.hasAttribute('download');
	      var hasOtherTarget = el.hasAttribute('target');
	      var hasExternalRel = el.getAttribute('rel') === 'external';
	      var isMailto = ~(el.getAttribute('href') || '').indexOf('mailto:');
	      var isCrossOrigin = !sameOrigin(el.href);
	      var isEmptyHash = el.getAttribute('href') === '#';

	      if (isDownload || hasOtherTarget || hasExternalRel || isMailto || isCrossOrigin || isEmptyHash) {
	        return;
	      }

	      // rebuild path
	      var path = el.pathname + el.search + (el.hash || '');

	      // same page
	      var orig = path;
	      var base = this.config.base.replace('/#!', '');
	      if (path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
	        path = path.substr(base.length);
	      }

	      if (this.config.hashbang) {
	        path = path.replace('/#!', '');
	      }

	      if (this.config.base && orig === path) {
	        return;
	      }

	      if (this.dispatch({ path: path, pushState: true })) {
	        e.preventDefault();
	      }
	    }
	  }, {
	    key: 'dispose',
	    value: function dispose() {
	      document.removeEventListener(clickEvent, this.onclick, false);
	      window.removeEventListener('popstate', this.onpopstate, false);
	      this.ctx.destroy();
	    }
	  }]);

	  return Router;
	}();

	function createViewModel(routerParams, componentInfo) {
	  var el = componentInfo.element;
	  var bindingCtx = _knockout2.default.contextFor(el);
	  return new Router(el, bindingCtx, _knockout2.default.toJS(routerParams));
	}

	function which(e) {
	  e = e || window.event;
	  return null === e.which ? e.button : e.which;
	}

	function noop() {}

	function sameOrigin(href) {
	  var origin = location.protocol + '//' + location.hostname;
	  if (location.port) origin += ':' + location.port;
	  return href && 0 === href.indexOf(origin);
	}

	exports.default = { createViewModel: createViewModel };

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _knockout = __webpack_require__(1);

	var _knockout2 = _interopRequireDefault(_knockout);

	var _qs = __webpack_require__(4);

	var _qs2 = _interopRequireDefault(_qs);

	var _query = __webpack_require__(8);

	var _state = __webpack_require__(10);

	var _utils = __webpack_require__(9);

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Stringify = __webpack_require__(5);
	var Parse = __webpack_require__(7);

	module.exports = {
	    stringify: Stringify,
	    parse: Parse
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Utils = __webpack_require__(6);

	var arrayPrefixGenerators = {
	    brackets: function brackets(prefix) {
	        return prefix + '[]';
	    },
	    indices: function indices(prefix, key) {
	        return prefix + '[' + key + ']';
	    },
	    repeat: function repeat(prefix) {
	        return prefix;
	    }
	};

	var defaults = {
	    delimiter: '&',
	    strictNullHandling: false,
	    skipNulls: false,
	    encode: true,
	    encoder: Utils.encode
	};

	var stringify = function stringify(object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots) {
	    var obj = object;
	    if (typeof filter === 'function') {
	        obj = filter(prefix, obj);
	    } else if (obj instanceof Date) {
	        obj = obj.toISOString();
	    } else if (obj === null) {
	        if (strictNullHandling) {
	            return encoder ? encoder(prefix) : prefix;
	        }

	        obj = '';
	    }

	    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || Utils.isBuffer(obj)) {
	        if (encoder) {
	            return [encoder(prefix) + '=' + encoder(obj)];
	        }
	        return [prefix + '=' + String(obj)];
	    }

	    var values = [];

	    if (typeof obj === 'undefined') {
	        return values;
	    }

	    var objKeys;
	    if (Array.isArray(filter)) {
	        objKeys = filter;
	    } else {
	        var keys = Object.keys(obj);
	        objKeys = sort ? keys.sort(sort) : keys;
	    }

	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];

	        if (skipNulls && obj[key] === null) {
	            continue;
	        }

	        if (Array.isArray(obj)) {
	            values = values.concat(stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots));
	        } else {
	            values = values.concat(stringify(obj[key], prefix + (allowDots ? '.' + key : '[' + key + ']'), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots));
	        }
	    }

	    return values;
	};

	module.exports = function (object, opts) {
	    var obj = object;
	    var options = opts || {};
	    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
	    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
	    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
	    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
	    var encoder = encode ? (typeof options.encoder === 'function' ? options.encoder : defaults.encoder) : null;
	    var sort = typeof options.sort === 'function' ? options.sort : null;
	    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
	    var objKeys;
	    var filter;

	    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
	        throw new TypeError('Encoder has to be a function.');
	    }

	    if (typeof options.filter === 'function') {
	        filter = options.filter;
	        obj = filter('', obj);
	    } else if (Array.isArray(options.filter)) {
	        objKeys = filter = options.filter;
	    }

	    var keys = [];

	    if (typeof obj !== 'object' || obj === null) {
	        return '';
	    }

	    var arrayFormat;
	    if (options.arrayFormat in arrayPrefixGenerators) {
	        arrayFormat = options.arrayFormat;
	    } else if ('indices' in options) {
	        arrayFormat = options.indices ? 'indices' : 'repeat';
	    } else {
	        arrayFormat = 'indices';
	    }

	    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

	    if (!objKeys) {
	        objKeys = Object.keys(obj);
	    }

	    if (sort) {
	        objKeys.sort(sort);
	    }

	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];

	        if (skipNulls && obj[key] === null) {
	            continue;
	        }

	        keys = keys.concat(stringify(obj[key], key, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots));
	    }

	    return keys.join(delimiter);
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var hexTable = (function () {
	    var array = new Array(256);
	    for (var i = 0; i < 256; ++i) {
	        array[i] = '%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase();
	    }

	    return array;
	}());

	exports.arrayToObject = function (source, options) {
	    var obj = options.plainObjects ? Object.create(null) : {};
	    for (var i = 0; i < source.length; ++i) {
	        if (typeof source[i] !== 'undefined') {
	            obj[i] = source[i];
	        }
	    }

	    return obj;
	};

	exports.merge = function (target, source, options) {
	    if (!source) {
	        return target;
	    }

	    if (typeof source !== 'object') {
	        if (Array.isArray(target)) {
	            target.push(source);
	        } else if (typeof target === 'object') {
	            target[source] = true;
	        } else {
	            return [target, source];
	        }

	        return target;
	    }

	    if (typeof target !== 'object') {
	        return [target].concat(source);
	    }

	    var mergeTarget = target;
	    if (Array.isArray(target) && !Array.isArray(source)) {
	        mergeTarget = exports.arrayToObject(target, options);
	    }

	    return Object.keys(source).reduce(function (acc, key) {
	        var value = source[key];

	        if (Object.prototype.hasOwnProperty.call(acc, key)) {
	            acc[key] = exports.merge(acc[key], value, options);
	        } else {
	            acc[key] = value;
	        }
	        return acc;
	    }, mergeTarget);
	};

	exports.decode = function (str) {
	    try {
	        return decodeURIComponent(str.replace(/\+/g, ' '));
	    } catch (e) {
	        return str;
	    }
	};

	exports.encode = function (str) {
	    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
	    // It has been adapted here for stricter adherence to RFC 3986
	    if (str.length === 0) {
	        return str;
	    }

	    var string = typeof str === 'string' ? str : String(str);

	    var out = '';
	    for (var i = 0; i < string.length; ++i) {
	        var c = string.charCodeAt(i);

	        if (
	            c === 0x2D || // -
	            c === 0x2E || // .
	            c === 0x5F || // _
	            c === 0x7E || // ~
	            (c >= 0x30 && c <= 0x39) || // 0-9
	            (c >= 0x41 && c <= 0x5A) || // a-z
	            (c >= 0x61 && c <= 0x7A) // A-Z
	        ) {
	            out += string.charAt(i);
	            continue;
	        }

	        if (c < 0x80) {
	            out = out + hexTable[c];
	            continue;
	        }

	        if (c < 0x800) {
	            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }

	        if (c < 0xD800 || c >= 0xE000) {
	            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }

	        i += 1;
	        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
	        out += hexTable[0xF0 | (c >> 18)] + hexTable[0x80 | ((c >> 12) & 0x3F)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)];
	    }

	    return out;
	};

	exports.compact = function (obj, references) {
	    if (typeof obj !== 'object' || obj === null) {
	        return obj;
	    }

	    var refs = references || [];
	    var lookup = refs.indexOf(obj);
	    if (lookup !== -1) {
	        return refs[lookup];
	    }

	    refs.push(obj);

	    if (Array.isArray(obj)) {
	        var compacted = [];

	        for (var i = 0; i < obj.length; ++i) {
	            if (obj[i] && typeof obj[i] === 'object') {
	                compacted.push(exports.compact(obj[i], refs));
	            } else if (typeof obj[i] !== 'undefined') {
	                compacted.push(obj[i]);
	            }
	        }

	        return compacted;
	    }

	    var keys = Object.keys(obj);
	    for (var j = 0; j < keys.length; ++j) {
	        var key = keys[j];
	        obj[key] = exports.compact(obj[key], refs);
	    }

	    return obj;
	};

	exports.isRegExp = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};

	exports.isBuffer = function (obj) {
	    if (obj === null || typeof obj === 'undefined') {
	        return false;
	    }

	    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Utils = __webpack_require__(6);

	var defaults = {
	    delimiter: '&',
	    depth: 5,
	    arrayLimit: 20,
	    parameterLimit: 1000,
	    strictNullHandling: false,
	    plainObjects: false,
	    allowPrototypes: false,
	    allowDots: false,
	    decoder: Utils.decode
	};

	var parseValues = function parseValues(str, options) {
	    var obj = {};
	    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

	    for (var i = 0; i < parts.length; ++i) {
	        var part = parts[i];
	        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

	        if (pos === -1) {
	            obj[options.decoder(part)] = '';

	            if (options.strictNullHandling) {
	                obj[options.decoder(part)] = null;
	            }
	        } else {
	            var key = options.decoder(part.slice(0, pos));
	            var val = options.decoder(part.slice(pos + 1));

	            if (Object.prototype.hasOwnProperty.call(obj, key)) {
	                obj[key] = [].concat(obj[key]).concat(val);
	            } else {
	                obj[key] = val;
	            }
	        }
	    }

	    return obj;
	};

	var parseObject = function parseObject(chain, val, options) {
	    if (!chain.length) {
	        return val;
	    }

	    var root = chain.shift();

	    var obj;
	    if (root === '[]') {
	        obj = [];
	        obj = obj.concat(parseObject(chain, val, options));
	    } else {
	        obj = options.plainObjects ? Object.create(null) : {};
	        var cleanRoot = root[0] === '[' && root[root.length - 1] === ']' ? root.slice(1, root.length - 1) : root;
	        var index = parseInt(cleanRoot, 10);
	        if (
	            !isNaN(index) &&
	            root !== cleanRoot &&
	            String(index) === cleanRoot &&
	            index >= 0 &&
	            (options.parseArrays && index <= options.arrayLimit)
	        ) {
	            obj = [];
	            obj[index] = parseObject(chain, val, options);
	        } else {
	            obj[cleanRoot] = parseObject(chain, val, options);
	        }
	    }

	    return obj;
	};

	var parseKeys = function parseKeys(givenKey, val, options) {
	    if (!givenKey) {
	        return;
	    }

	    // Transform dot notation to bracket notation
	    var key = options.allowDots ? givenKey.replace(/\.([^\.\[]+)/g, '[$1]') : givenKey;

	    // The regex chunks

	    var parent = /^([^\[\]]*)/;
	    var child = /(\[[^\[\]]*\])/g;

	    // Get the parent

	    var segment = parent.exec(key);

	    // Stash the parent if it exists

	    var keys = [];
	    if (segment[1]) {
	        // If we aren't using plain objects, optionally prefix keys
	        // that would overwrite object prototype properties
	        if (!options.plainObjects && Object.prototype.hasOwnProperty(segment[1])) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }

	        keys.push(segment[1]);
	    }

	    // Loop through children appending to the array until we hit depth

	    var i = 0;
	    while ((segment = child.exec(key)) !== null && i < options.depth) {
	        i += 1;
	        if (!options.plainObjects && Object.prototype.hasOwnProperty(segment[1].replace(/\[|\]/g, ''))) {
	            if (!options.allowPrototypes) {
	                continue;
	            }
	        }
	        keys.push(segment[1]);
	    }

	    // If there's a remainder, just add whatever is left

	    if (segment) {
	        keys.push('[' + key.slice(segment.index) + ']');
	    }

	    return parseObject(keys, val, options);
	};

	module.exports = function (str, opts) {
	    var options = opts || {};

	    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
	        throw new TypeError('Decoder has to be a function.');
	    }

	    options.delimiter = typeof options.delimiter === 'string' || Utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
	    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
	    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
	    options.parseArrays = options.parseArrays !== false;
	    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
	    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
	    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
	    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
	    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
	    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

	    if (str === '' || str === null || typeof str === 'undefined') {
	        return options.plainObjects ? Object.create(null) : {};
	    }

	    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
	    var obj = options.plainObjects ? Object.create(null) : {};

	    // Iterate over the keys and setup the new object

	    var keys = Object.keys(tempObj);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var newObj = parseKeys(key, tempObj[key], options);
	        obj = Utils.merge(obj, newObj, options);
	    }

	    return Utils.compact(obj);
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.factory = factory;

	var _knockout = __webpack_require__(1);

	var _knockout2 = _interopRequireDefault(_knockout);

	var _qs = __webpack_require__(4);

	var _qs2 = _interopRequireDefault(_qs);

	var _utils = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var qsParams = {};
	var trigger = _knockout2.default.observable(true);
	var cache = {};

	var Query = function () {
	  function Query(ctx) {
	    _classCallCheck(this, Query);

	    this.ctx = ctx;

	    if (!this.ctx.$parent) {
	      var qsIndex = window.location.href.indexOf('?');
	      if (~qsIndex) {
	        this.updateFromString(window.location.href.split('?')[1]);
	      }
	    }

	    // make work w/ click bindings w/o closure
	    this.get = this.get.bind(this);
	    this.clear = this.clear.bind(this);
	    this.update = this.update.bind(this);
	  }

	  _createClass(Query, [{
	    key: 'get',
	    value: function get(prop, defaultVal) {
	      var parser = arguments.length <= 2 || arguments[2] === undefined ? _utils.identity : arguments[2];

	      var query = this;
	      var ctx = this.ctx;
	      var guid = this.ctx.config.depth + ctx.pathname();

	      if (!cache[guid]) {
	        cache[guid] = {};
	      }

	      if (!cache[guid][prop]) {
	        cache[guid][prop] = {
	          defaultVal: defaultVal,
	          parser: parser,
	          value: _knockout2.default.pureComputed({
	            read: function read() {
	              trigger();

	              if (qsParams && qsParams[guid] && !(0, _utils.isUndefined)(qsParams[guid][prop])) {
	                return cache[guid][prop].parser(qsParams[guid][prop]);
	              }

	              return defaultVal;
	            },
	            write: function write(v) {
	              var _location = location;
	              var pathname = _location.pathname;
	              var hash = _location.hash;

	              if ((0, _utils.deepEquals)(v, this.prev)) {
	                return;
	              }
	              this.prev = v;

	              (0, _utils.merge)(qsParams, _defineProperty({}, guid, _defineProperty({}, prop, v)), false);

	              ctx.update(pathname + hash, ctx.state(), false, query.getNonDefaultParams()[guid]).then(function () {
	                return trigger(!trigger());
	              });
	            },

	            owner: {
	              prev: null
	            }
	          })
	        };
	      }
	      return cache[guid][prop].value;
	    }
	  }, {
	    key: 'getAll',
	    value: function getAll() {
	      var asObservable = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	      var pathname = arguments.length <= 1 || arguments[1] === undefined ? this.ctx.pathname() : arguments[1];

	      var guid = this.ctx.config.depth + pathname;
	      return asObservable ? _knockout2.default.pureComputed({
	        read: function read() {
	          trigger();
	          return this.getAll();
	        },
	        write: function write(q) {
	          for (var pn in q) {
	            this.get(pn)(q[pn]);
	          }
	        }
	      }, this) : _knockout2.default.toJS((0, _utils.mapKeys)(qsParams[guid] || {}, function (prop) {
	        return cache[guid] && cache[guid][prop] ? (0, _utils.isUndefined)(qsParams[guid][prop]) ? undefined : cache[guid][prop].parser(qsParams[guid][prop]) : qsParams[guid][prop];
	      }));
	    }
	  }, {
	    key: 'setDefaults',
	    value: function setDefaults(q) {
	      var parser = arguments.length <= 1 || arguments[1] === undefined ? _utils.identity : arguments[1];

	      for (var pn in q) {
	        this.get(pn, q[pn], parser);
	      }
	    }
	  }, {
	    key: 'clear',
	    value: function clear(pathname) {
	      if (typeof pathname !== 'string') {
	        pathname = this.ctx.pathname();
	      }
	      var guid = this.ctx.config.depth + pathname;
	      for (var pn in cache[guid]) {
	        var p = cache[guid][pn];
	        p.value(p.defaultVal);
	      }
	    }
	  }, {
	    key: 'reload',
	    value: function reload() {
	      var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	      var guid = arguments.length <= 1 || arguments[1] === undefined ? this.ctx.config.depth + this.ctx.pathname() : arguments[1];

	      if (!this.ctx.config.persistQuery || force) {
	        for (var p in qsParams[guid]) {
	          if (cache[guid] && cache[guid][p]) {
	            cache[guid][p].value.dispose();
	          }
	        }
	        delete qsParams[guid];
	        delete cache[guid];
	      }
	      trigger(!trigger());
	    }
	  }, {
	    key: 'dispose',
	    value: function dispose() {
	      for (var guid in qsParams) {
	        if (guid.indexOf(this.ctx.config.depth) === 0) {
	          this.reload(true, guid);
	        }
	      }
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	      var pathname = arguments.length <= 1 || arguments[1] === undefined ? this.ctx.pathname() : arguments[1];

	      var guid = this.ctx.config.depth + pathname;

	      if ((0, _utils.deepEquals)(qsParams[guid], query)) {
	        return;
	      }

	      (0, _utils.merge)(qsParams, _defineProperty({}, guid, query), false);
	      trigger(!trigger());
	    }
	  }, {
	    key: 'updateFromString',
	    value: function updateFromString(str, pathname) {
	      if (pathname) {
	        var guid = this.ctx.config.depth + pathname;
	        (0, _utils.merge)(qsParams, _defineProperty({}, guid, _qs2.default.parse(str)[guid]), false);
	      } else {
	        (0, _utils.merge)(qsParams, _qs2.default.parse(str), false);
	      }
	      trigger(!trigger());
	    }
	  }, {
	    key: 'getNonDefaultParams',
	    value: function getNonDefaultParams(query, pathname) {
	      var nonDefaultParams = {};
	      var workingParams = qsParams;

	      if (query) {
	        (0, _utils.merge)(workingParams, _defineProperty({}, this.ctx.config.depth + pathname, query), false);
	      }

	      for (var id in workingParams) {
	        if (!cache[id]) {
	          nonDefaultParams[id] = workingParams[id];
	        } else {
	          nonDefaultParams[id] = {};
	          for (var pn in workingParams[id]) {
	            var p = workingParams[id][pn];
	            var c = cache[id][pn];
	            var d = c && c.defaultVal;
	            if (!(0, _utils.isUndefined)(p) && !(0, _utils.deepEquals)(p, d)) {
	              nonDefaultParams[id][pn] = p;
	            }
	          }
	        }
	      }

	      return nonDefaultParams;
	    }
	  }, {
	    key: 'getFullQueryString',
	    value: function getFullQueryString(query, pathname) {
	      return _qs2.default.stringify(this.getNonDefaultParams(query, pathname));
	    }
	  }]);

	  return Query;
	}();

	function factory(ctx) {
	  return new Query(ctx);
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.decodeURLEncodedURIComponent = decodeURLEncodedURIComponent;
	exports.deepEquals = deepEquals;
	exports.extend = extend;
	exports.identity = identity;
	exports.isUndefined = isUndefined;
	exports.mapKeys = mapKeys;
	exports.merge = merge;

	var _knockout = __webpack_require__(1);

	var _knockout2 = _interopRequireDefault(_knockout);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function decodeURLEncodedURIComponent(val) {
	  if (typeof val !== 'string') {
	    return val;
	  }
	  return decodeURIComponent(val.replace(/\+/g, ' '));
	}

	function deepEquals(foo, bar) {
	  if (foo === null || bar === null) {
	    return foo === null && bar === null;
	  }
	  if ((typeof foo === 'undefined' ? 'undefined' : _typeof(foo)) !== (typeof bar === 'undefined' ? 'undefined' : _typeof(bar))) {
	    return false;
	  }
	  if (isUndefined(foo)) {
	    return isUndefined(bar);
	  }
	  if (isPrimitiveOrDate(foo) && isPrimitiveOrDate(bar)) {
	    return foo === bar;
	  }

	  if (foo.constructor === Object && bar.constructor === Object) {
	    var fooProps = Object.keys(foo);
	    var barProps = Object.keys(bar);
	    if (fooProps.length !== barProps.length) {
	      return false;
	    }
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = fooProps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var prop = _step.value;

	        if (!deepEquals(foo[prop], bar[prop])) {
	          return false;
	        }
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }

	    return true;
	  } else if (Array.isArray(foo) && Array.isArray(bar)) {
	    if (foo.length !== bar.length) {
	      return false;
	    }
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;

	    try {
	      for (var _iterator2 = foo[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	        var el = _step2.value;

	        if (bar.indexOf(el) < 0) {
	          return false;
	        }
	      }
	    } catch (err) {
	      _didIteratorError2 = true;
	      _iteratorError2 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion2 && _iterator2.return) {
	          _iterator2.return();
	        }
	      } finally {
	        if (_didIteratorError2) {
	          throw _iteratorError2;
	        }
	      }
	    }
	  } else {
	    return foo === bar;
	  }
	}

	function extend(dest, src) {
	  var createAsObservable = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

	  var _shallow = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

	  var props = Object.keys(src);

	  var _iteratorNormalCompletion3 = true;
	  var _didIteratorError3 = false;
	  var _iteratorError3 = undefined;

	  try {
	    for (var _iterator3 = props[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	      var prop = _step3.value;

	      if (isUndefined(dest[prop])) {
	        dest[prop] = createAsObservable ? fromJS(src[prop]) : src[prop];
	      } else if (_knockout2.default.isWritableObservable(dest[prop])) {
	        if (!deepEquals(dest[prop](), src[prop])) {
	          dest[prop](src[prop]);
	        }
	      } else if (isUndefined(src[prop])) {
	        dest[prop] = undefined;
	      } else if (src[prop].constructor === Object) {
	        if (_shallow) {
	          dest[prop] = {};
	        }
	        extend(dest[prop], src[prop], createAsObservable);
	      } else {
	        dest[prop] = src[prop];
	      }
	    }
	  } catch (err) {
	    _didIteratorError3 = true;
	    _iteratorError3 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion3 && _iterator3.return) {
	        _iterator3.return();
	      }
	    } finally {
	      if (_didIteratorError3) {
	        throw _iteratorError3;
	      }
	    }
	  }

	  return dest;
	}

	function identity(x) {
	  return x;
	}

	function isUndefined(x) {
	  return typeof x === 'undefined';
	}

	function mapKeys(obj, fn) {
	  var mappedObj = {};
	  Object.keys(obj).forEach(function (k) {
	    return mappedObj[k] = fn(k);
	  });
	  return mappedObj;
	}

	function merge(dest, src) {
	  var createAsObservable = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

	  extend(dest, src, createAsObservable, false);
	}

	function fromJS(obj, parentIsArray) {
	  var obs = void 0;

	  if (isPrimitiveOrDate(obj)) obs = parentIsArray ? obj : _knockout2.default.observable(obj);else if (obj instanceof Array) {
	    obs = [];

	    for (var i = 0; i < obj.length; i++) {
	      obs[i] = fromJS(obj[i], true);
	    }obs = _knockout2.default.observableArray(obs);
	  } else if (obj.constructor === Object) {
	    obs = {};

	    for (var p in obj) {
	      obs[p] = fromJS(obj[p]);
	    }
	  }

	  return obs;
	}

	function isPrimitiveOrDate(obj) {
	  return obj === null || obj === undefined || obj.constructor === String || obj.constructor === Number || obj.constructor === Boolean || obj instanceof Date;
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.factory = factory;

	var _knockout = __webpack_require__(1);

	var _knockout2 = _interopRequireDefault(_knockout);

	var _utils = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function factory(ctx) {
	  var trigger = _knockout2.default.observable(false);

	  var state = _knockout2.default.pureComputed({
	    read: function read() {
	      trigger();
	      return history.state ? history.state[ctx.config.depth + ctx.pathname()] : {};
	    },
	    write: function write(v) {
	      if (v) {
	        var s = history.state || {};
	        var key = ctx.config.depth + ctx.pathname();

	        if (!(0, _utils.deepEquals)(v, history.state ? history.state[ctx.config.depth + ctx.pathname()] : {})) {
	          if (s[key]) {
	            delete s[key];
	          }
	          s[key] = v;
	          history.replaceState(s, document.title);
	          trigger(!trigger());
	        }
	      }
	    }
	  });

	  var _dispose = state.dispose;

	  state.reload = function () {
	    var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	    var guid = arguments.length <= 1 || arguments[1] === undefined ? ctx.config.depth + ctx.pathname() : arguments[1];

	    if (!ctx.config.persistState || force) {
	      if (history.state && history.state[guid]) {
	        var newState = history.state;
	        delete newState[guid];
	      }
	    }
	  };

	  state.dispose = function () {
	    for (var guid in history.state) {
	      if (guid.indexOf(ctx.config.depth) === 0) {
	        state.reload(true, guid);
	      }
	    }
	    _dispose.apply(state, arguments);
	  };

	  return state;
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _pathToRegexp = __webpack_require__(12);

	var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

	var _utils = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Route = function () {
	  function Route(path, component) {
	    _classCallCheck(this, Route);

	    if (path[path.length - 1] === '!') {
	      path = path.replace('!', ':child_path(.*)?');
	    } else {
	      path = path.replace(/\(?\*\)?/, '(.*)');
	    }

	    this.component = component;

	    this._keys = [];
	    this._regexp = (0, _pathToRegexp2.default)(path, this._keys);
	  }

	  _createClass(Route, [{
	    key: 'matches',
	    value: function matches(path) {
	      var qsIndex = path.indexOf('?');

	      if (~qsIndex) {
	        path = path.split('?')[0];
	      }

	      return this._regexp.exec(decodeURIComponent(path));
	    }
	  }, {
	    key: 'parse',
	    value: function parse(path) {
	      var childPath = void 0;
	      var hash = '';
	      var params = {};
	      var hIndex = path.indexOf('#');

	      if (~hIndex) {
	        var parts = path.split('#');
	        path = parts[0];
	        hash = (0, _utils.decodeURLEncodedURIComponent)(parts[1]);
	      }

	      var qsIndex = path.indexOf('?');

	      var _ref = ~qsIndex ? path.split('?') : [path];

	      var _ref2 = _slicedToArray(_ref, 2);

	      var pathname = _ref2[0];
	      var querystring = _ref2[1]; // eslint-disable-line

	      var matches = this._regexp.exec(decodeURIComponent(pathname));

	      for (var i = 1, len = matches.length; i < len; ++i) {
	        var k = this._keys[i - 1];
	        var v = (0, _utils.decodeURLEncodedURIComponent)(matches[i]);
	        if ((0, _utils.isUndefined)(v) || !hasOwnProperty.call(params, k.name)) {
	          if (k.name === 'child_path') {
	            if (!(0, _utils.isUndefined)(v)) {
	              childPath = '/' + v;
	              path = path.substring(0, path.lastIndexOf(childPath));
	              pathname = pathname.substring(0, pathname.lastIndexOf(childPath));
	            }
	          } else {
	            params[k.name] = v;
	          }
	        }
	      }

	      return [path, params, hash, pathname, querystring, childPath];
	    }
	  }]);

	  return Route;
	}();

	exports.default = Route;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var isarray = __webpack_require__(13)

	/**
	 * Expose `pathToRegexp`.
	 */
	module.exports = pathToRegexp
	module.exports.parse = parse
	module.exports.compile = compile
	module.exports.tokensToFunction = tokensToFunction
	module.exports.tokensToRegExp = tokensToRegExp

	/**
	 * The main path matching regexp utility.
	 *
	 * @type {RegExp}
	 */
	var PATH_REGEXP = new RegExp([
	  // Match escaped characters that would otherwise appear in future matches.
	  // This allows the user to escape special characters that won't transform.
	  '(\\\\.)',
	  // Match Express-style parameters and un-named parameters with a prefix
	  // and optional suffixes. Matches appear as:
	  //
	  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
	  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
	  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
	  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
	].join('|'), 'g')

	/**
	 * Parse a string for the raw tokens.
	 *
	 * @param  {string} str
	 * @return {!Array}
	 */
	function parse (str) {
	  var tokens = []
	  var key = 0
	  var index = 0
	  var path = ''
	  var res

	  while ((res = PATH_REGEXP.exec(str)) != null) {
	    var m = res[0]
	    var escaped = res[1]
	    var offset = res.index
	    path += str.slice(index, offset)
	    index = offset + m.length

	    // Ignore already escaped sequences.
	    if (escaped) {
	      path += escaped[1]
	      continue
	    }

	    var next = str[index]
	    var prefix = res[2]
	    var name = res[3]
	    var capture = res[4]
	    var group = res[5]
	    var modifier = res[6]
	    var asterisk = res[7]

	    // Push the current path onto the tokens.
	    if (path) {
	      tokens.push(path)
	      path = ''
	    }

	    var partial = prefix != null && next != null && next !== prefix
	    var repeat = modifier === '+' || modifier === '*'
	    var optional = modifier === '?' || modifier === '*'
	    var delimiter = res[2] || '/'
	    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

	    tokens.push({
	      name: name || key++,
	      prefix: prefix || '',
	      delimiter: delimiter,
	      optional: optional,
	      repeat: repeat,
	      partial: partial,
	      asterisk: !!asterisk,
	      pattern: escapeGroup(pattern)
	    })
	  }

	  // Match any characters still remaining.
	  if (index < str.length) {
	    path += str.substr(index)
	  }

	  // If the path exists, push it onto the end.
	  if (path) {
	    tokens.push(path)
	  }

	  return tokens
	}

	/**
	 * Compile a string to a template function for the path.
	 *
	 * @param  {string}             str
	 * @return {!function(Object=, Object=)}
	 */
	function compile (str) {
	  return tokensToFunction(parse(str))
	}

	/**
	 * Prettier encoding of URI path segments.
	 *
	 * @param  {string}
	 * @return {string}
	 */
	function encodeURIComponentPretty (str) {
	  return encodeURI(str).replace(/[\/?#]/g, function (c) {
	    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
	  })
	}

	/**
	 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
	 *
	 * @param  {string}
	 * @return {string}
	 */
	function encodeAsterisk (str) {
	  return encodeURI(str).replace(/[?#]/g, function (c) {
	    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
	  })
	}

	/**
	 * Expose a method for transforming tokens into the path function.
	 */
	function tokensToFunction (tokens) {
	  // Compile all the tokens into regexps.
	  var matches = new Array(tokens.length)

	  // Compile all the patterns before compilation.
	  for (var i = 0; i < tokens.length; i++) {
	    if (typeof tokens[i] === 'object') {
	      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
	    }
	  }

	  return function (obj, opts) {
	    var path = ''
	    var data = obj || {}
	    var options = opts || {}
	    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

	    for (var i = 0; i < tokens.length; i++) {
	      var token = tokens[i]

	      if (typeof token === 'string') {
	        path += token

	        continue
	      }

	      var value = data[token.name]
	      var segment

	      if (value == null) {
	        if (token.optional) {
	          // Prepend partial segment prefixes.
	          if (token.partial) {
	            path += token.prefix
	          }

	          continue
	        } else {
	          throw new TypeError('Expected "' + token.name + '" to be defined')
	        }
	      }

	      if (isarray(value)) {
	        if (!token.repeat) {
	          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
	        }

	        if (value.length === 0) {
	          if (token.optional) {
	            continue
	          } else {
	            throw new TypeError('Expected "' + token.name + '" to not be empty')
	          }
	        }

	        for (var j = 0; j < value.length; j++) {
	          segment = encode(value[j])

	          if (!matches[i].test(segment)) {
	            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
	          }

	          path += (j === 0 ? token.prefix : token.delimiter) + segment
	        }

	        continue
	      }

	      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

	      if (!matches[i].test(segment)) {
	        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
	      }

	      path += token.prefix + segment
	    }

	    return path
	  }
	}

	/**
	 * Escape a regular expression string.
	 *
	 * @param  {string} str
	 * @return {string}
	 */
	function escapeString (str) {
	  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
	}

	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {string} group
	 * @return {string}
	 */
	function escapeGroup (group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1')
	}

	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {!RegExp} re
	 * @param  {Array}   keys
	 * @return {!RegExp}
	 */
	function attachKeys (re, keys) {
	  re.keys = keys
	  return re
	}

	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {string}
	 */
	function flags (options) {
	  return options.sensitive ? '' : 'i'
	}

	/**
	 * Pull out keys from a regexp.
	 *
	 * @param  {!RegExp} path
	 * @param  {!Array}  keys
	 * @return {!RegExp}
	 */
	function regexpToRegexp (path, keys) {
	  // Use a negative lookahead to match only capturing groups.
	  var groups = path.source.match(/\((?!\?)/g)

	  if (groups) {
	    for (var i = 0; i < groups.length; i++) {
	      keys.push({
	        name: i,
	        prefix: null,
	        delimiter: null,
	        optional: false,
	        repeat: false,
	        partial: false,
	        asterisk: false,
	        pattern: null
	      })
	    }
	  }

	  return attachKeys(path, keys)
	}

	/**
	 * Transform an array into a regexp.
	 *
	 * @param  {!Array}  path
	 * @param  {Array}   keys
	 * @param  {!Object} options
	 * @return {!RegExp}
	 */
	function arrayToRegexp (path, keys, options) {
	  var parts = []

	  for (var i = 0; i < path.length; i++) {
	    parts.push(pathToRegexp(path[i], keys, options).source)
	  }

	  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

	  return attachKeys(regexp, keys)
	}

	/**
	 * Create a path regexp from string input.
	 *
	 * @param  {string}  path
	 * @param  {!Array}  keys
	 * @param  {!Object} options
	 * @return {!RegExp}
	 */
	function stringToRegexp (path, keys, options) {
	  var tokens = parse(path)
	  var re = tokensToRegExp(tokens, options)

	  // Attach keys back to the regexp.
	  for (var i = 0; i < tokens.length; i++) {
	    if (typeof tokens[i] !== 'string') {
	      keys.push(tokens[i])
	    }
	  }

	  return attachKeys(re, keys)
	}

	/**
	 * Expose a function for taking tokens and returning a RegExp.
	 *
	 * @param  {!Array}  tokens
	 * @param  {Object=} options
	 * @return {!RegExp}
	 */
	function tokensToRegExp (tokens, options) {
	  options = options || {}

	  var strict = options.strict
	  var end = options.end !== false
	  var route = ''
	  var lastToken = tokens[tokens.length - 1]
	  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

	  // Iterate over the tokens and create our regexp string.
	  for (var i = 0; i < tokens.length; i++) {
	    var token = tokens[i]

	    if (typeof token === 'string') {
	      route += escapeString(token)
	    } else {
	      var prefix = escapeString(token.prefix)
	      var capture = '(?:' + token.pattern + ')'

	      if (token.repeat) {
	        capture += '(?:' + prefix + capture + ')*'
	      }

	      if (token.optional) {
	        if (!token.partial) {
	          capture = '(?:' + prefix + '(' + capture + '))?'
	        } else {
	          capture = prefix + '(' + capture + ')?'
	        }
	      } else {
	        capture = prefix + '(' + capture + ')'
	      }

	      route += capture
	    }
	  }

	  // In non-strict mode we allow a slash at the end of match. If the path to
	  // match already ends with a slash, we remove it for consistency. The slash
	  // is valid at the end of a path match, not in the middle. This is important
	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
	  if (!strict) {
	    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
	  }

	  if (end) {
	    route += '$'
	  } else {
	    // In non-ending mode, we need the capturing groups to match as much as
	    // possible by using a positive lookahead to the end or next path segment.
	    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
	  }

	  return new RegExp('^' + route, flags(options))
	}

	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array can be passed in for the keys, which will hold the
	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
	 *
	 * @param  {(string|RegExp|Array)} path
	 * @param  {(Array|Object)=}       keys
	 * @param  {Object=}               options
	 * @return {!RegExp}
	 */
	function pathToRegexp (path, keys, options) {
	  keys = keys || []

	  if (!isarray(keys)) {
	    options = /** @type {!Object} */ (keys)
	    keys = []
	  } else if (!options) {
	    options = {}
	  }

	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, /** @type {!Array} */ (keys))
	  }

	  if (isarray(path)) {
	    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
	  }

	  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.resolveHref = resolveHref;

	var _knockout = __webpack_require__(1);

	var _knockout2 = _interopRequireDefault(_knockout);

	var _qs = __webpack_require__(4);

	var _qs2 = _interopRequireDefault(_qs);

	var _utils = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_knockout2.default.bindingHandlers.path = {
	  init: function init(e, xx, b, x, c) {
	    applyBinding.call(this, e, b, c);
	  }
	};
	_knockout2.default.bindingHandlers.state = {
	  init: function init(e, xx, b, x, c) {
	    applyBinding.call(this, e, b, c);
	  }
	};
	_knockout2.default.bindingHandlers.query = {
	  init: function init(e, xx, b, x, c) {
	    applyBinding.call(this, e, b, c);
	  }
	};
	_knockout2.default.bindingHandlers.path.utils = { resolveHref: resolveHref };

	function resolveHref(ctx, path, query) {
	  var _getRoute = getRoute(ctx, path);

	  var _getRoute2 = _slicedToArray(_getRoute, 2);

	  var router = _getRoute2[0];
	  var route = _getRoute2[1];

	  var querystring = query ? '?' + _qs2.default.stringify(_knockout2.default.toJS(query)) : '';

	  while (router.$parent) {
	    route = router.config.base + route;
	    router = router.$parent;
	  }

	  return router ? router.config.base + (!router.config.hashbang || router.$parent ? '' : '/#!') + route + querystring : '#';
	}

	function applyBinding(el, bindings, ctx) {
	  var path = bindings.has('path') ? bindings.get('path') : false;
	  var query = bindings.has('query') ? bindings.get('query') : false;
	  var state = bindings.has('state') ? bindings.get('state') : false;

	  var bindingsToApply = {};
	  el.href = '#';

	  bindingsToApply.click = function (data, e) {
	    var debounce = 1 !== which(e);
	    var hasOtherTarget = el.hasAttribute('target');
	    var hasExternalRel = el.getAttribute('rel') === 'external';
	    var modifierKey = e.metaKey || e.ctrlKey || e.shiftKey;

	    if (debounce || hasOtherTarget || hasExternalRel || modifierKey) {
	      return true;
	    }

	    var _getRoute3 = getRoute(ctx, path);

	    var _getRoute4 = _slicedToArray(_getRoute3, 2);

	    var router = _getRoute4[0];
	    var route = _getRoute4[1];

	    var handled = router.update(route, _knockout2.default.toJS(state), true, _knockout2.default.toJS(query));

	    if (handled) {
	      e.preventDefault();
	      e.stopImmediatePropagation();
	    } else if (!router.$parent) {
	      console.error('[ko-component-router] ' + path + ' did not match any routes!'); // eslint-disable-line
	    }

	    return !handled;
	  };

	  bindingsToApply.attr = {
	    href: _knockout2.default.pureComputed(function () {
	      return resolveHref(ctx, bindings.get('path'), query);
	    })
	  };

	  if (path) {
	    bindingsToApply.css = {
	      'active-path': _knockout2.default.pureComputed(function () {
	        var _getRoute5 = getRoute(ctx, path);

	        var _getRoute6 = _slicedToArray(_getRoute5, 2);

	        var router = _getRoute6[0];
	        var route = _getRoute6[1];

	        return !router.isNavigating() && router.route() !== '' && route ? router.route().matches(route) : false;
	      })
	    };
	  }

	  // allow adjacent routers to initialize
	  (window.requestAnimationFrame || window.setTimeout)(function () {
	    return _knockout2.default.applyBindingsToNode(el, bindingsToApply);
	  });
	}

	function getRoute(ctx, path) {
	  var router = getRouter(ctx);
	  var route = path ? _knockout2.default.unwrap(path) : router.canonicalPath();

	  if (route.indexOf('//') === 0) {
	    route = route.replace('//', '/');

	    while (router.$parent) {
	      router = router.$parent;
	    }
	  } else {
	    while (route && route.match(/\/?\.\./i) && router.$parent) {
	      router = router.$parent;
	      route = route.replace(/\/?\.\./i, '');
	    }
	  }

	  return [router, route];
	}

	function getRouter(ctx) {
	  while (!(0, _utils.isUndefined)(ctx)) {
	    if (!(0, _utils.isUndefined)(ctx.$router)) {
	      return ctx.$router;
	    }

	    ctx = ctx.$parentContext;
	  }
	}

	function which(e) {
	  e = e || window.event;
	  return null === e.which ? e.button : e.which;
	}

/***/ }
/******/ ])
});
;