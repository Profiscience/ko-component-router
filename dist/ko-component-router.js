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

	var ko = __webpack_require__(1);
	var router = __webpack_require__(2);

	ko.components.register('ko-component-router', {
	  viewModel: router,
	  template: '<div data-bind=\'if: ctx.component\'>\n      <div data-bind=\'component: {\n        name: ctx.component,\n        params: ctx\n      }\'></div>\n    </div>'
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ko = __webpack_require__(1);
	var Context = __webpack_require__(3);
	var Route = __webpack_require__(5);

	var clickEvent = 'undefined' !== typeof document && document.ontouchstart ? 'touchstart' : 'click';

	var location = 'undefined' !== typeof window && (window.history.location || window.location);

	var Router = (function () {
	  function Router(_ref, bindingCtx) {
	    var routes = _ref.routes;
	    var _ref$base = _ref.base;
	    var base = _ref$base === undefined ? '' : _ref$base;
	    var _ref$hashbang = _ref.hashbang;
	    var hashbang = _ref$hashbang === undefined ? false : _ref$hashbang;

	    _classCallCheck(this, Router);

	    var parentRouterCtx = bindingCtx.$parentContext.$router;
	    var dispatch = true;
	    if (parentRouterCtx) {
	      base = parentRouterCtx.path();
	      dispatch = parentRouterCtx.path() !== parentRouterCtx.canonicalPath();
	    } else {
	      this.isRoot = true;
	    }

	    this.onpopstate = this.onpopstate.bind(this);
	    this.onclick = this.onclick.bind(this);

	    window.addEventListener('popstate', this.onpopstate, false);
	    document.addEventListener(clickEvent, this.onclick, false);

	    this.config = { base: base, hashbang: hashbang };
	    this.ctx = bindingCtx.$router = new Context(this.config);

	    this.routes = {};
	    for (var route in routes) {
	      this.routes[route] = new Route(route, routes[route]);
	    }

	    if (dispatch) {
	      var url = this.config.hashbang && ~location.hash.indexOf('#!') ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;

	      this.dispatch(url, null, false);
	    }
	  }

	  _createClass(Router, [{
	    key: 'dispatch',
	    value: function dispatch(path, state, push) {
	      if (path.indexOf(this.config.base) === 0) {
	        path = path.replace(this.config.base, '');
	      }

	      for (var r in this.routes) {
	        var route = this.routes[r];
	        if (route.matches(path)) {
	          this.ctx.update(route, path, state, this.isRoot && push);
	          return true;
	        }
	      }

	      if (this.isRoot) {
	        location.href = this.ctx.canonicalPath();
	      } else {
	        this.ctx.component(null);
	      }

	      return false;
	    }
	  }, {
	    key: 'onpopstate',
	    value: function onpopstate(e) {
	      this.dispatch(location.pathname + location.hash, e.state, false);
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

	      // Ignore if tag has
	      // 1. "download" attribute
	      // 2. rel="external" attribute
	      if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') {
	        return;
	      }

	      // ensure non-hash for the same path
	      var link = el.getAttribute('href');
	      if (!this.config.hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) {
	        return;
	      }

	      // Check for mailto: in the href
	      if (link && link.indexOf('mailto:') > -1) {
	        return;
	      }

	      // check target
	      if (el.target) {
	        return;
	      }

	      // x-origin
	      if (!sameOrigin(el.href)) {
	        return;
	      }

	      // rebuild path
	      var path = el.pathname + el.search + (el.hash || '');

	      // same page
	      var orig = path;

	      if (path.indexOf(this.config.base) === 0) {
	        path = path.substr(this.config.base.length);
	      }

	      if (this.config.hashbang) path = path.replace('#!', '');

	      if (this.config.base && orig === path) return;

	      e.preventDefault();

	      this.dispatch(path);
	    }
	  }, {
	    key: 'dispose',
	    value: function dispose() {
	      document.removeEventListener(clickEvent, this.onclick, false);
	      window.removeEventListener('popstate', this.onpopstate, false);
	    }
	  }]);

	  return Router;
	})();

	module.exports = {
	  createViewModel: function createViewModel(routerParams, componentInfo) {
	    return new Router(routerParams, ko.contextFor(componentInfo.element));
	  }
	};

	function which(e) {
	  e = e || window.event;
	  return null === e.which ? e.button : e.which;
	}

	function sameOrigin(href) {
	  var origin = location.protocol + '//' + location.hostname;
	  if (location.port) origin += ':' + location.port;
	  return href && 0 === href.indexOf(origin);
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ko = __webpack_require__(1);
	var utils = __webpack_require__(4);

	var Context = (function () {
	  function Context(config) {
	    _classCallCheck(this, Context);

	    this.config = config;

	    this.route = ko.observable('');
	    this.component = ko.observable();
	    this.state = ko.observable({});
	    this.canonicalPath = ko.observable('');
	    this.path = ko.observable('');
	    this.pathname = ko.observable('');
	    this.params = {};
	    this.query = {};
	    this.hash = ko.observable('');
	  }

	  _createClass(Context, [{
	    key: 'update',
	    value: function update(route, path) {
	      var state = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	      var push = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

	      this.route(route);

	      if ('/' === path[0] && 0 !== path.indexOf(this.config.base)) {
	        path = this.config.base + (this.config.hashbang ? '#!' : '') + path;
	      }

	      this.canonicalPath(path);
	      path = path.replace(this.config.base, '') || '/';

	      if (this.config.hashbang) {
	        path = this.path().replace('#!', '') || '/';
	      }

	      this.state(state);

	      var i = path.indexOf('?');
	      // this.querystring(~i ? utils.decodeURLEncodedURIComponent(path.slice(i + 1)) : '')
	      this.pathname(utils.decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path));
	      // this.hash('')

	      var _route$parse = route.parse(path);

	      var _route$parse2 = _slicedToArray(_route$parse, 2);

	      var params = _route$parse2[0];
	      var childPath = _route$parse2[1];

	      path = path.replace(childPath, '');
	      utils.merge(this.params, params);

	      // if (!this.config.hashbang && ~this.path().indexOf('#')) {
	      //   const parts = this.path().split('#')
	      //   this.path(parts[0])
	      // this.hash(utils.decodeURLEncodedURIComponent(parts[1]) || '')
	      // this.querystring(this.querystring().split('#')[0])
	      // }

	      this.path(path);
	      route.exec(this, push);
	    }
	  }]);

	  return Context;
	})();

	module.exports = Context;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ko = __webpack_require__(1);

	function decodeURLEncodedURIComponent(val) {
	  if (typeof val !== 'string') {
	    return val;
	  }
	  return decodeURIComponent(val.replace(/\+/g, ' '));
	}

	function merge(dest, src) {
	  for (var prop in src) {
	    if (typeof dest[prop] === 'undefined') dest[prop] = fromJS(src[prop]);else if (ko.isWritableObservable(dest[prop])) dest[prop](src[prop]);else if (src[prop].constructor === Object) merge(dest[prop], src[prop]);else dest[prop] = src[prop];
	  }
	}

	function fromJS(obj, parentIsArray) {
	  var obs = undefined;

	  if (isPrimitiveOrDate(obj)) obs = parentIsArray ? obj : ko.observable(obj);else if (obj instanceof Array) {
	    obs = [];

	    for (var i = 0; i < obj.length; i++) {
	      obs[i] = fromJS(obj[i], true);
	    }obs = ko.observableArray(obs);
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

	module.exports = {
	  decodeURLEncodedURIComponent: decodeURLEncodedURIComponent,
	  merge: merge
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ko = __webpack_require__(1);
	var pathtoRegexp = __webpack_require__(6);
	var utils = __webpack_require__(4);

	var Route = (function () {
	  function Route(path, args) {
	    var _this = this;

	    _classCallCheck(this, Route);

	    if (path[path.length - 1] === '!') {
	      path = path.replace('!', ':child_path(.*)?');
	    } else if (path === '*') {
	      path = '(.*)';
	    }

	    if (typeof args === 'string') {
	      this.callbacks = [this.getComponentSetter(args)];
	    } else {
	      this.callbacks = args.map(function (h) {
	        return typeof h === 'string' ? _this.getComponentSetter(h) : h;
	      });
	    }

	    this._keys = [];
	    this._regexp = pathtoRegexp(path, this._keys);
	    this._compile = pathtoRegexp.compile(path);
	  }

	  _createClass(Route, [{
	    key: 'exec',
	    value: function exec(ctx, push) {
	      var callbacks = this.callbacks;
	      var i = 0;

	      next();

	      function next() {
	        var fn = callbacks[i++];

	        if (fn) {
	          fn(ctx, next);
	        } else {
	          history[push ? 'pushState' : 'replaceState'](ctx.state(), document.title, ctx.config.hashbang && ctx.path() !== '/' ? '#!' + ctx.path() : ctx.canonicalPath());
	        }
	      }
	    }
	  }, {
	    key: 'matches',
	    value: function matches(path) {
	      return this._regexp.exec(decodeURIComponent(path));
	    }
	  }, {
	    key: 'getComponentSetter',
	    value: function getComponentSetter(c) {
	      var _this2 = this;

	      return function (ctx, next) {
	        var subs = [];
	        ctx.component(c);

	        for (var paramName in ctx.params) {
	          var param = ctx.params[paramName];
	          subs.push(param.subscribe(function () {
	            var url = ctx.route().compile(ko.toJS(ctx.params));
	            ctx.update(_this2, url, null, false);
	          }));
	        }

	        var killMe = ctx.component.subscribe(function () {
	          killMe.dispose();
	          var _iteratorNormalCompletion = true;
	          var _didIteratorError = false;
	          var _iteratorError = undefined;

	          try {
	            for (var _iterator = subs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	              var sub = _step.value;

	              sub.dispose();
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

	          subs = [];
	        });

	        next();
	      };
	    }
	  }, {
	    key: 'compile',
	    value: function compile(params) {
	      return this._compile(params);
	    }
	  }, {
	    key: 'parse',
	    value: function parse(path) {
	      var childPath = undefined;
	      var params = {};
	      var qsIndex = path.indexOf('?');
	      var pathname = ~qsIndex ? path.slice(0, qsIndex) : path;
	      var matches = this._regexp.exec(decodeURIComponent(pathname));

	      for (var i = 1, len = matches.length; i < len; ++i) {
	        var k = this._keys[i - 1];
	        var v = utils.decodeURLEncodedURIComponent(matches[i]);
	        if (v !== undefined || !hasOwnProperty.call(params, k.name)) {
	          if (k.name === 'child_path') {
	            childPath = '/' + v;
	          } else {
	            params[k.name] = v;
	          }
	        }
	      }

	      return [params, childPath];
	    }
	  }]);

	  return Route;
	})();

	module.exports = Route;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var isarray = __webpack_require__(7)

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
	 * @param  {String} str
	 * @return {Array}
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

	    // Push the current path onto the tokens.
	    if (path) {
	      tokens.push(path)
	      path = ''
	    }

	    var prefix = res[2]
	    var name = res[3]
	    var capture = res[4]
	    var group = res[5]
	    var suffix = res[6]
	    var asterisk = res[7]

	    var repeat = suffix === '+' || suffix === '*'
	    var optional = suffix === '?' || suffix === '*'
	    var delimiter = prefix || '/'
	    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

	    tokens.push({
	      name: name || key++,
	      prefix: prefix || '',
	      delimiter: delimiter,
	      optional: optional,
	      repeat: repeat,
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
	 * @param  {String}   str
	 * @return {Function}
	 */
	function compile (str) {
	  return tokensToFunction(parse(str))
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
	      matches[i] = new RegExp('^' + tokens[i].pattern + '$')
	    }
	  }

	  return function (obj) {
	    var path = ''
	    var data = obj || {}

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
	          continue
	        } else {
	          throw new TypeError('Expected "' + token.name + '" to be defined')
	        }
	      }

	      if (isarray(value)) {
	        if (!token.repeat) {
	          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
	        }

	        if (value.length === 0) {
	          if (token.optional) {
	            continue
	          } else {
	            throw new TypeError('Expected "' + token.name + '" to not be empty')
	          }
	        }

	        for (var j = 0; j < value.length; j++) {
	          segment = encodeURIComponent(value[j])

	          if (!matches[i].test(segment)) {
	            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
	          }

	          path += (j === 0 ? token.prefix : token.delimiter) + segment
	        }

	        continue
	      }

	      segment = encodeURIComponent(value)

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
	 * @param  {String} str
	 * @return {String}
	 */
	function escapeString (str) {
	  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
	}

	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {String} group
	 * @return {String}
	 */
	function escapeGroup (group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1')
	}

	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {RegExp} re
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function attachKeys (re, keys) {
	  re.keys = keys
	  return re
	}

	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {String}
	 */
	function flags (options) {
	  return options.sensitive ? '' : 'i'
	}

	/**
	 * Pull out keys from a regexp.
	 *
	 * @param  {RegExp} path
	 * @param  {Array}  keys
	 * @return {RegExp}
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
	        pattern: null
	      })
	    }
	  }

	  return attachKeys(path, keys)
	}

	/**
	 * Transform an array into a regexp.
	 *
	 * @param  {Array}  path
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
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
	 * @param  {String} path
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
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
	 * @param  {Array}  tokens
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
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
	      var capture = token.pattern

	      if (token.repeat) {
	        capture += '(?:' + prefix + capture + ')*'
	      }

	      if (token.optional) {
	        if (prefix) {
	          capture = '(?:' + prefix + '(' + capture + '))?'
	        } else {
	          capture = '(' + capture + ')?'
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
	 * @param  {(String|RegExp|Array)} path
	 * @param  {Array}                 [keys]
	 * @param  {Object}                [options]
	 * @return {RegExp}
	 */
	function pathToRegexp (path, keys, options) {
	  keys = keys || []

	  if (!isarray(keys)) {
	    options = keys
	    keys = []
	  } else if (!options) {
	    options = {}
	  }

	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, keys, options)
	  }

	  if (isarray(path)) {
	    return arrayToRegexp(path, keys, options)
	  }

	  return stringToRegexp(path, keys, options)
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ }
/******/ ])
});
;