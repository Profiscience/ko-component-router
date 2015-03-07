(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define(["knockout"], factory);
	else if(typeof exports === 'object')
		exports["ko-component-router"] = factory(require("knockout"));
	else
		root["ko-component-router"] = factory(root["knockout"]);
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

	var ko;

	ko = __webpack_require__(1);

	ko.components.register('ko-component-router', __webpack_require__(2));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  template: __webpack_require__(4),
	  viewModel: __webpack_require__(3),
	  synchronous: true
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var HashbangRouter, KoComponentRouterViewModel, PushstateRouter, ko;

	ko = __webpack_require__(1);

	HashbangRouter = __webpack_require__(5);

	PushstateRouter = __webpack_require__(6);


	/*
	Viewmodel class for <ko-component-router>

	@private
	 */

	KoComponentRouterViewModel = (function() {

	  /*
	  Constructs a new viewmodel
	  
	  @param params {Object} component params
	  @option routes {Object} routes in the format { '/path': 'component-name' }
	  @option options {Object} router options { HTML5: false, basePath: '/' }
	   */
	  function KoComponentRouterViewModel(_arg) {
	    var HTML5, Router, basePath, options, routes, _ref, _ref1, _ref2;
	    routes = _arg.routes, options = _arg.options;
	    HTML5 = (_ref = options != null ? options.HTML5 : void 0) != null ? _ref : false;
	    basePath = (_ref1 = options != null ? options.basePath : void 0) != null ? _ref1 : '';
	    Router = HTML5 ? PushstateRouter : HashbangRouter;
	    ko.router = new Router(routes, basePath);
	    _ref2 = ko.router.current, this.component = _ref2.component, this.routeParams = _ref2.routeParams;
	  }


	  /*
	  ko `dispose` callback to destroy bindings and subscriptions
	  
	  @note called automatically when a component is destroyed
	   */

	  KoComponentRouterViewModel.prototype.dispose = function() {
	    return ko.router._stop();
	  };

	  return KoComponentRouterViewModel;

	})();

	module.exports = KoComponentRouterViewModel;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div data-bind='component: {\n\n  name:    component,\n  params:  routeParams\n\n}'></div>";

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var HashbangRouter, history, location, pathUtil, _ref, _ref1,
	  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	pathUtil = __webpack_require__(8);

	location = (_ref = (_ref1 = window.history) != null ? _ref1.location : void 0) != null ? _ref : window.location;

	history = window.history;

	HashbangRouter = (function(_super) {
	  __extends(HashbangRouter, _super);

	  function HashbangRouter(_routes, _basePath) {
	    var path, redirectUrl;
	    this._basePath = _basePath != null ? _basePath : '/';
	    this._onClick = __bind(this._onClick, this);
	    this._basePath = pathUtil.join('/', this._basePath, '/#!');
	    path = (location.pathname + location.search + location.hash).replace();
	    path = path.replace(new RegExp("^" + this._basePath), '');
	    redirectUrl = pathUtil.join('/', this._basePath, path);
	    if (location.href.indexOf(redirectUrl) < 0) {
	      if (history.emulate) {
	        location.replace(redirectUrl);
	      } else {
	        history.replaceState(history.state, document.title, redirectUrl);
	      }
	    }
	    window.addEventListener('contextmenu', this._onContextMenu);
	    HashbangRouter.__super__.constructor.apply(this, arguments);
	  }


	  /* PRIVATE MEMBERS */

	  HashbangRouter.prototype._pushState = function(path) {
	    if (history.emulate) {
	      return history.pushState({}, document.title, path);
	    } else {
	      return HashbangRouter.__super__._pushState.apply(this, arguments);
	    }
	  };

	  HashbangRouter.prototype._replaceState = function(path) {
	    if (history.emulate) {
	      return history.replaceState(history.state, document.title, path);
	    } else {
	      return HashbangRouter.__super__._replaceState.apply(this, arguments);
	    }
	  };


	  /*
	  Handle 'click' events
	   */

	  HashbangRouter.prototype._onClick = function(e) {
	    var hashbangURL, path, target;
	    if (this._ignoreClick(e)) {
	      return;
	    }
	    path = this._getFullPath(e.target);
	    path.replace(this._basePath, '');
	    if (e.metaKey || e.ctrlKey || e.shiftKey) {
	      e.preventDefault();
	      hashbangURL = pathUtil.join('/', this._basePath, '/#!', path);
	      target = e.metaKey || e.ctrlKey ? null : '_blank';
	      window.open(hashbangURL, target);
	      return;
	    }
	    e.preventDefault();
	    return this.show(path);
	  };


	  /*
	  Handle 'contextmenu' (right-click menu) events
	   */

	  HashbangRouter.prototype._onContextMenu = function(e) {
	    var el;
	    if (e.defaultPrevented) {
	      return;
	    }
	    el = e.target;
	    if (this._isLink(el)) {
	      return this._patchContextMenu(el);
	    }
	  };


	  /*
	  Ensure that context menu options like 'open in new tab/window'
	  work correctly
	   */

	  HashbangRouter.prototype._patchContextMenu = function(el) {
	    var hashbangUrl, orig, path, revertPatch;
	    if (el.hasAttribute('data-orig-href')) {
	      return;
	    }
	    orig = el.getAttribute('href');
	    path = this._getFullPath(el).replace(this._basePath, '').replace('#!', '');
	    hashbangUrl = this._basePath + '#!' + path;
	    el.setAttribute('data-orig-href', orig);
	    el.setAttribute('href', hashbangUrl);
	    revertPatch = this._revertContextMenuPatch.bind(this, el);
	    return window.addEventListener('click', revertPatch);
	  };


	  /*
	  Undo context menu patch when context menu is closed
	   */

	  HashbangRouter.prototype._revertContextMenuPatch = function(el) {
	    var orig;
	    orig = el.getAttribute('data-orig-href');
	    el.setAttribute('href', orig);
	    el.removeAttribute('data-orig-href');
	    return window.removeEventListener('click', this._revertContextMenuPatch);
	  };

	  HashbangRouter.prototype._stripBasePath = function(path) {
	    return path.split('#!')[1];
	  };

	  HashbangRouter.prototype._getCurrentPath = function() {
	    var path;
	    path = HashbangRouter.__super__._getCurrentPath.apply(this, arguments);
	    return path.split('#!')[1];
	  };

	  return HashbangRouter;

	})(__webpack_require__(7));

	module.exports = HashbangRouter;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var PushstateRouter, history, location, pathUtil, _ref, _ref1,
	  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	pathUtil = __webpack_require__(8);

	location = (_ref = (_ref1 = window.history) != null ? _ref1.location : void 0) != null ? _ref : window.location;

	history = window.history;

	module.exports = PushstateRouter = (function(_super) {
	  __extends(PushstateRouter, _super);

	  function PushstateRouter(_routes, _basePath) {
	    this._basePath = _basePath != null ? _basePath : '';
	    this._onClick = __bind(this._onClick, this);
	    if (this._basePath !== '') {
	      this._basePath = pathUtil.join('/', this._basePath).replace('\/$', '');
	    }
	    PushstateRouter.__super__.constructor.apply(this, arguments);
	  }

	  PushstateRouter.prototype._onClick = function(e) {
	    var path;
	    if (this._ignoreClick(e) || e.metaKey || e.ctrlKey || e.shiftKey) {
	      return;
	    }
	    path = this._getFullPath(e.target);
	    e.preventDefault();
	    return this.show(path);
	  };

	  PushstateRouter.prototype._getCurrentPath = function(path) {
	    var _ref2;
	    path = PushstateRouter.__super__._getCurrentPath.apply(this, arguments);
	    if (this._basePath !== '') {
	      return (_ref2 = path.split(this._basePath)[1]) != null ? _ref2 : path;
	    } else {
	      return path;
	    }
	  };

	  return PushstateRouter;

	})(__webpack_require__(7));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var AbstractRouter, Route, State, ko, location, pathUtil, _ref, _ref1, _stateSubscriptionReference,
	  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	ko = __webpack_require__(1);

	pathUtil = __webpack_require__(8);

	location = (_ref = (_ref1 = window.history) != null ? _ref1.location : void 0) != null ? _ref : window.location;

	Route = __webpack_require__(9);

	State = __webpack_require__(10);

	_stateSubscriptionReference = null;


	/*
	Base router class

	@private
	@abstract
	@param routes {Object} routes in the form { '/path': 'component' }
	 */

	AbstractRouter = (function() {

	  /*
	  Initializes a new router
	  
	  @param routes {Object} routes in the for { '/path': 'component' }
	  @return {Router} new router instance
	   */
	  function AbstractRouter(routes) {
	    this._onStateChange = __bind(this._onStateChange, this);
	    var component, path, prop, _i, _len, _ref2;
	    this.state = new State;
	    this._routes = [];
	    for (path in routes) {
	      component = routes[path];
	      this._routes.push(new Route(path, component));
	    }
	    this.current = {};
	    _ref2 = ['path', 'component', 'routeParams'];
	    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
	      prop = _ref2[_i];
	      this.current[prop] = ko.observable();
	    }
	    window.addEventListener('click', this._onClick);
	    _stateSubscriptionReference = this.state.subscribe(this._onStateChange);
	    path = this._getCurrentPath();
	    this.redirect(path);
	  }


	  /*
	  Navigate to the given `path`
	  
	  @note `path` should not include base path
	  @note clears the state
	  @param path {String} path to navigate to
	   */

	  AbstractRouter.prototype.show = function(path) {
	    this._changePage(path);
	    return this._pushState(path);
	  };


	  /*
	  Redirects to the given `path`
	  
	  @note `path` should not include base path
	  @note clears the state
	  @param path {String} path to navigate to
	   */

	  AbstractRouter.prototype.redirect = function(path) {
	    this._changePage(path);
	    return this._replaceState(path);
	  };


	  /*
	  Disposes of event listeners and subscriptions,
	  killing the router
	  
	  @private
	   */

	  AbstractRouter.prototype._stop = function() {
	    window.removeEventListener('click', this._onClick);
	    return _stateSubscriptionReference.dispose();
	  };


	  /*
	  Handles statechange (as abstracted by ko.router.state)
	  
	  @private
	   */

	  AbstractRouter.prototype._onStateChange = function() {
	    var path;
	    path = this._getCurrentPath();
	    return this.redirect(path);
	  };


	  /*
	  Finds the most specific matching route and sets the `current` properties
	  
	  @private
	  @param path {String} path to set page
	  @return {Boolean} whether or not the route was handled
	   */

	  AbstractRouter.prototype._changePage = function(path) {
	    var component, fewestDynamicSegments, i, matchedRoutes, numDynamicSegments, params, route, _i, _j, _len, _len1, _p, _ref2;
	    params = {};
	    matchedRoutes = [];
	    _ref2 = this._routes;
	    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
	      route = _ref2[_i];
	      if (route.matches(path)) {
	        matchedRoutes.push(route);
	      }
	    }
	    if (matchedRoutes.length === 0) {
	      return false;
	    }
	    fewestDynamicSegments = Infinity;
	    component = null;
	    params = null;
	    for (i = _j = 0, _len1 = matchedRoutes.length; _j < _len1; i = ++_j) {
	      route = matchedRoutes[i];
	      _p = route.params(path);
	      numDynamicSegments = Object.keys(_p).length;
	      if (numDynamicSegments < fewestDynamicSegments) {
	        fewestDynamicSegments = numDynamicSegments;
	        component = route.component;
	        params = _p;
	        if (numDynamicSegments === 0) {
	          break;
	        }
	      }
	    }
	    this.current.path(path);
	    this.current.component(component);
	    this.current.routeParams(params);
	    return true;
	  };


	  /*
	  Writes the URL, clears the state, and adds a history entry
	  
	  @private
	  @note prefixes URL with base path
	  @param path {String} path to write
	   */

	  AbstractRouter.prototype._pushState = function(path) {
	    return history.pushState({}, document.title, this._basePath + path);
	  };


	  /*
	  Writes the URL and clears the state
	  
	  @private
	  @note prefixes URL with base path
	  @param path {String} path to write
	   */

	  AbstractRouter.prototype._replaceState = function(path) {
	    return history.replaceState({}, document.title, this._basePath + path);
	  };


	  /*
	  Determines if a click should not be handled by the router
	  
	  @private
	  @param event {ClickEvent}
	  @return {Boolean} click should be ignored
	   */

	  AbstractRouter.prototype._ignoreClick = function(_arg) {
	    var defaultPrevented, detail, el;
	    el = _arg.target, detail = _arg.detail, defaultPrevented = _arg.defaultPrevented;
	    return detail === 2 || defaultPrevented || !this._isLink(el) || el.getAttribute('download') || el.getAttribute('rel') === 'external' || el.pathname === this.current.path() || el.getAttribute('href').indexOf('mailto:') > -1 || el.target || !this._sameOrigin(el.href);
	  };


	  /*
	  Check to see if `el` is a link
	  
	  @private
	  @param el {DOMElement}
	  @return {Boolean} `el` is link
	   */

	  AbstractRouter.prototype._isLink = function(el) {
	    while (el && 'A' !== el.nodeName) {
	      el = el.parentNode;
	    }
	    return el && 'A' === el.nodeName;
	  };


	  /*
	  Gets the current path
	  
	  @private
	  @abstract
	  @return {String} current path
	   */

	  AbstractRouter.prototype._getCurrentPath = function() {
	    return location.pathname + location.search + location.hash;
	  };


	  /*
	  Get the full (absolute) path for an anchor
	  
	  @private
	  @param el {DOMElement}
	  @return {String} full path
	   */

	  AbstractRouter.prototype._getFullPath = function(el) {
	    var href, path;
	    href = el.getAttribute('href');
	    path = href[0] === '/' ? el.pathname : href === '..' ? pathUtil.resolve(this.current.path(), href) : pathUtil.resolve(this.current.path(), "../" + href);
	    return path + el.search + (el.hash || '');
	  };


	  /*
	  Determines if `href` is on the same origin
	  
	  @private
	  @param href {String}
	  @return {Boolan} is same origin
	   */

	  AbstractRouter.prototype._sameOrigin = function(href) {
	    var origin;
	    origin = location.protocol + '//' + location.hostname;
	    if (location.port) {
	      origin += ':' + location.port;
	    }
	    return href && (0 === href.indexOf(origin));
	  };

	  return AbstractRouter;

	})();

	module.exports = AbstractRouter;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var process = process || {};
	(function () {
	  "use strict";

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.


	var isWindows = process.platform === 'win32';
	var util = __webpack_require__(15);


	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}


	if (isWindows) {
	  // Regex to split a windows path into three parts: [*, device, slash,
	  // tail] windows-only
	  var splitDeviceRe =
	      /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

	  // Regex to split the tail part of the above into [*, dir, basename, ext]
	  var splitTailRe =
	      /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

	  // Function to split a filename into [root, dir, basename, ext]
	  // windows version
	  var splitPath = function(filename) {
	    // Separate device+slash from tail
	    var result = splitDeviceRe.exec(filename),
	        device = (result[1] || '') + (result[2] || ''),
	        tail = result[3] || '';
	    // Split the tail into dir, basename and extension
	    var result2 = splitTailRe.exec(tail),
	        dir = result2[1],
	        basename = result2[2],
	        ext = result2[3];
	    return [device, dir, basename, ext];
	  };

	  var normalizeUNCRoot = function(device) {
	    return '\\\\' + device.replace(/^[\\\/]+/, '').replace(/[\\\/]+/g, '\\');
	  };

	  // path.resolve([from ...], to)
	  // windows version
	  exports.resolve = function() {
	    var resolvedDevice = '',
	        resolvedTail = '',
	        resolvedAbsolute = false;

	    for (var i = arguments.length - 1; i >= -1; i--) {
	      var path;
	      if (i >= 0) {
	        path = arguments[i];
	      } else if (!resolvedDevice) {
	        path = process.cwd();
	      } else {
	        // Windows has the concept of drive-specific current working
	        // directories. If we've resolved a drive letter but not yet an
	        // absolute path, get cwd for that drive. We're sure the device is not
	        // an unc path at this points, because unc paths are always absolute.
	        path = process.env['=' + resolvedDevice];
	        // Verify that a drive-local cwd was found and that it actually points
	        // to our drive. If not, default to the drive's root.
	        if (!path || path.substr(0, 3).toLowerCase() !==
	            resolvedDevice.toLowerCase() + '\\') {
	          path = resolvedDevice + '\\';
	        }
	      }

	      // Skip empty and invalid entries
	      if (!util.isString(path)) {
	        throw new TypeError('Arguments to path.resolve must be strings');
	      } else if (!path) {
	        continue;
	      }

	      var result = splitDeviceRe.exec(path),
	          device = result[1] || '',
	          isUnc = device && device.charAt(1) !== ':',
	          isAbsolute = exports.isAbsolute(path),
	          tail = result[3];

	      if (device &&
	          resolvedDevice &&
	          device.toLowerCase() !== resolvedDevice.toLowerCase()) {
	        // This path points to another device so it is not applicable
	        continue;
	      }

	      if (!resolvedDevice) {
	        resolvedDevice = device;
	      }
	      if (!resolvedAbsolute) {
	        resolvedTail = tail + '\\' + resolvedTail;
	        resolvedAbsolute = isAbsolute;
	      }

	      if (resolvedDevice && resolvedAbsolute) {
	        break;
	      }
	    }

	    // Convert slashes to backslashes when `resolvedDevice` points to an UNC
	    // root. Also squash multiple slashes into a single one where appropriate.
	    if (isUnc) {
	      resolvedDevice = normalizeUNCRoot(resolvedDevice);
	    }

	    // At this point the path should be resolved to a full absolute path,
	    // but handle relative paths to be safe (might happen when process.cwd()
	    // fails)

	    // Normalize the tail path

	    function f(p) {
	      return !!p;
	    }

	    resolvedTail = normalizeArray(resolvedTail.split(/[\\\/]+/).filter(f),
	                                  !resolvedAbsolute).join('\\');

	    return (resolvedDevice + (resolvedAbsolute ? '\\' : '') + resolvedTail) ||
	           '.';
	  };

	  // windows version
	  exports.normalize = function(path) {
	    var result = splitDeviceRe.exec(path),
	        device = result[1] || '',
	        isUnc = device && device.charAt(1) !== ':',
	        isAbsolute = exports.isAbsolute(path),
	        tail = result[3],
	        trailingSlash = /[\\\/]$/.test(tail);

	    // If device is a drive letter, we'll normalize to lower case.
	    if (device && device.charAt(1) === ':') {
	      device = device[0].toLowerCase() + device.substr(1);
	    }

	    // Normalize the tail path
	    tail = normalizeArray(tail.split(/[\\\/]+/).filter(function(p) {
	      return !!p;
	    }), !isAbsolute).join('\\');

	    if (!tail && !isAbsolute) {
	      tail = '.';
	    }
	    if (tail && trailingSlash) {
	      tail += '\\';
	    }

	    // Convert slashes to backslashes when `device` points to an UNC root.
	    // Also squash multiple slashes into a single one where appropriate.
	    if (isUnc) {
	      device = normalizeUNCRoot(device);
	    }

	    return device + (isAbsolute ? '\\' : '') + tail;
	  };

	  // windows version
	  exports.isAbsolute = function(path) {
	    var result = splitDeviceRe.exec(path),
	        device = result[1] || '',
	        isUnc = !!device && device.charAt(1) !== ':';
	    // UNC paths are always absolute
	    return !!result[2] || isUnc;
	  };

	  // windows version
	  exports.join = function() {
	    function f(p) {
	      if (!util.isString(p)) {
	        throw new TypeError('Arguments to path.join must be strings');
	      }
	      return p;
	    }

	    var paths = Array.prototype.filter.call(arguments, f);
	    var joined = paths.join('\\');

	    // Make sure that the joined path doesn't start with two slashes, because
	    // normalize() will mistake it for an UNC path then.
	    //
	    // This step is skipped when it is very clear that the user actually
	    // intended to point at an UNC path. This is assumed when the first
	    // non-empty string arguments starts with exactly two slashes followed by
	    // at least one more non-slash character.
	    //
	    // Note that for normalize() to treat a path as an UNC path it needs to
	    // have at least 2 components, so we don't filter for that here.
	    // This means that the user can use join to construct UNC paths from
	    // a server name and a share name; for example:
	    //   path.join('//server', 'share') -> '\\\\server\\share\')
	    if (!/^[\\\/]{2}[^\\\/]/.test(paths[0])) {
	      joined = joined.replace(/^[\\\/]{2,}/, '\\');
	    }

	    return exports.normalize(joined);
	  };

	  // path.relative(from, to)
	  // it will solve the relative path from 'from' to 'to', for instance:
	  // from = 'C:\\orandea\\test\\aaa'
	  // to = 'C:\\orandea\\impl\\bbb'
	  // The output of the function should be: '..\\..\\impl\\bbb'
	  // windows version
	  exports.relative = function(from, to) {
	    from = exports.resolve(from);
	    to = exports.resolve(to);

	    // windows is not case sensitive
	    var lowerFrom = from.toLowerCase();
	    var lowerTo = to.toLowerCase();

	    function trim(arr) {
	      var start = 0;
	      for (; start < arr.length; start++) {
	        if (arr[start] !== '') break;
	      }

	      var end = arr.length - 1;
	      for (; end >= 0; end--) {
	        if (arr[end] !== '') break;
	      }

	      if (start > end) return [];
	      return arr.slice(start, end + 1);
	    }

	    var toParts = trim(to.split('\\'));

	    var lowerFromParts = trim(lowerFrom.split('\\'));
	    var lowerToParts = trim(lowerTo.split('\\'));

	    var length = Math.min(lowerFromParts.length, lowerToParts.length);
	    var samePartsLength = length;
	    for (var i = 0; i < length; i++) {
	      if (lowerFromParts[i] !== lowerToParts[i]) {
	        samePartsLength = i;
	        break;
	      }
	    }

	    if (samePartsLength == 0) {
	      return to;
	    }

	    var outputParts = [];
	    for (var i = samePartsLength; i < lowerFromParts.length; i++) {
	      outputParts.push('..');
	    }

	    outputParts = outputParts.concat(toParts.slice(samePartsLength));

	    return outputParts.join('\\');
	  };

	  exports.sep = '\\';
	  exports.delimiter = ';';

	} else /* posix */ {

	  // Split a filename into [root, dir, basename, ext], unix version
	  // 'root' is just a slash, or nothing.
	  var splitPathRe =
	      /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	  var splitPath = function(filename) {
	    return splitPathRe.exec(filename).slice(1);
	  };

	  // path.resolve([from ...], to)
	  // posix version
	  exports.resolve = function() {
	    var resolvedPath = '',
	        resolvedAbsolute = false;

	    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	      var path = (i >= 0) ? arguments[i] : process.cwd();

	      // Skip empty and invalid entries
	      if (!util.isString(path)) {
	        throw new TypeError('Arguments to path.resolve must be strings');
	      } else if (!path) {
	        continue;
	      }

	      resolvedPath = path + '/' + resolvedPath;
	      resolvedAbsolute = path.charAt(0) === '/';
	    }

	    // At this point the path should be resolved to a full absolute path, but
	    // handle relative paths to be safe (might happen when process.cwd() fails)

	    // Normalize the path
	    resolvedPath = normalizeArray(resolvedPath.split('/').filter(function(p) {
	      return !!p;
	    }), !resolvedAbsolute).join('/');

	    return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	  };

	  // path.normalize(path)
	  // posix version
	  exports.normalize = function(path) {
	    var isAbsolute = exports.isAbsolute(path),
	        trailingSlash = path[path.length - 1] === '/',
	        segments = path.split('/'),
	        nonEmptySegments = [];

	    // Normalize the path
	    for (var i = 0; i < segments.length; i++) {
	      if (segments[i]) {
	        nonEmptySegments.push(segments[i]);
	      }
	    }
	    path = normalizeArray(nonEmptySegments, !isAbsolute).join('/');

	    if (!path && !isAbsolute) {
	      path = '.';
	    }
	    if (path && trailingSlash) {
	      path += '/';
	    }

	    return (isAbsolute ? '/' : '') + path;
	  };

	  // posix version
	  exports.isAbsolute = function(path) {
	    return path.charAt(0) === '/';
	  };

	  // posix version
	  exports.join = function() {
	    var path = '';
	    for (var i = 0; i < arguments.length; i++) {
	      var segment = arguments[i];
	      if (!util.isString(segment)) {
	        throw new TypeError('Arguments to path.join must be strings');
	      }
	      if (segment) {
	        if (!path) {
	          path += segment;
	        } else {
	          path += '/' + segment;
	        }
	      }
	    }
	    return exports.normalize(path);
	  };


	  // path.relative(from, to)
	  // posix version
	  exports.relative = function(from, to) {
	    from = exports.resolve(from).substr(1);
	    to = exports.resolve(to).substr(1);

	    function trim(arr) {
	      var start = 0;
	      for (; start < arr.length; start++) {
	        if (arr[start] !== '') break;
	      }

	      var end = arr.length - 1;
	      for (; end >= 0; end--) {
	        if (arr[end] !== '') break;
	      }

	      if (start > end) return [];
	      return arr.slice(start, end + 1);
	    }

	    var fromParts = trim(from.split('/'));
	    var toParts = trim(to.split('/'));

	    var length = Math.min(fromParts.length, toParts.length);
	    var samePartsLength = length;
	    for (var i = 0; i < length; i++) {
	      if (fromParts[i] !== toParts[i]) {
	        samePartsLength = i;
	        break;
	      }
	    }

	    var outputParts = [];
	    for (var i = samePartsLength; i < fromParts.length; i++) {
	      outputParts.push('..');
	    }

	    outputParts = outputParts.concat(toParts.slice(samePartsLength));

	    return outputParts.join('/');
	  };

	  exports.sep = '/';
	  exports.delimiter = ':';
	}

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};


	exports.exists = util.deprecate(function(path, callback) {
	  __webpack_require__(14).exists(path, callback);
	}, 'path.exists is now called `fs.exists`.');


	exports.existsSync = util.deprecate(function(path) {
	  return __webpack_require__(14).existsSync(path);
	}, 'path.existsSync is now called `fs.existsSync`.');


	if (isWindows) {
	  exports._makeLong = function(path) {
	    // Note: this will *probably* throw somewhere.
	    if (!util.isString(path))
	      return path;

	    if (!path) {
	      return '';
	    }

	    var resolvedPath = exports.resolve(path);

	    if (/^[a-zA-Z]\:\\/.test(resolvedPath)) {
	      // path is local filesystem path, which needs to be converted
	      // to long UNC path.
	      return '\\\\?\\' + resolvedPath;
	    } else if (/^\\\\[^?.]/.test(resolvedPath)) {
	      // path is network UNC path, which needs to be converted
	      // to long UNC path.
	      return '\\\\?\\UNC\\' + resolvedPath.substring(2);
	    }

	    return path;
	  };
	} else {
	  exports._makeLong = function(path) {
	    return path;
	  };
	}
	}());


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Route, pathToRegExp,
	  __slice = [].slice;

	pathToRegExp = __webpack_require__(11);

	Route = (function() {

	  /*
	  Constructs a new `route` object
	  
	  @private
	  @param path {String}
	   */
	  function Route(path, component) {
	    this.component = component;
	    this.paramKeys = [];
	    this.regExp = pathToRegExp(path, this.paramKeys);
	  }


	  /*
	  Check if this route produces a match for `path`
	  
	  @param path {String} path to check against route
	  @return {Boolean} route matches
	   */

	  Route.prototype.matches = function(path) {
	    path = path.split('?')[0];
	    return this.regExp.exec(path) != null;
	  };


	  /*
	  Parses params from route
	  
	  @param path {String} path to parse params from
	  @return {Object} route params
	   */

	  Route.prototype.params = function(path) {
	    var i, k, params, pathParams, v, _, _i, _len, _ref;
	    path = path.split('?')[0];
	    params = {};
	    _ref = this.regExp.exec(path), _ = _ref[0], pathParams = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
	    for (i = _i = 0, _len = pathParams.length; _i < _len; i = ++_i) {
	      v = pathParams[i];
	      if ((v != null) && (v = decodeURIComponent(v)) && (k = this.paramKeys[i].name)) {
	        params[k] = v;
	      }
	    }
	    return params;
	  };

	  return Route;

	})();

	module.exports = Route;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var KoRouterState, init, isFunction, isPlainObject, ko, location, _getState, _initialized, _listenForExternalChanges, _patchNativeMethods, _ref, _ref1, _removeFuncs, _state, _writeState;

	ko = __webpack_require__(1);

	isFunction = __webpack_require__(12);

	isPlainObject = __webpack_require__(13);

	location = (_ref = (_ref1 = window.history) != null ? _ref1.location : void 0) != null ? _ref : window.location;

	_initialized = false;

	_state = ko.observable(history.state);


	/*
	Patch history.pushState and history.replaceState to update
	ko.router.state

	@private
	 */

	_patchNativeMethods = function() {
	  history._nativePushState = history.pushState;
	  history.pushState = function(state) {
	    history._nativePushState.apply(this, arguments);
	    return _state(state);
	  };
	  history._nativeReplaceState = history.replaceState;
	  return history.replaceState = function(state) {
	    history._nativeReplaceState.apply(this, arguments);
	    return _state(state);
	  };
	};


	/*
	Update state when url is changed or browser back/forward

	@private
	 */

	_listenForExternalChanges = function() {
	  return window.addEventListener('popstate', function() {
	    return _state(history.state);
	  });
	};


	/*
	Recursively remove functions from an object

	@private
	@param obj {Object} object to remove functions from
	@return {Object} object w/o functions
	 */

	_removeFuncs = function(obj) {
	  var key, objWithoutFuncs, val;
	  objWithoutFuncs = {};
	  for (key in obj) {
	    val = obj[key];
	    switch (false) {
	      case !isFunction(val):
	        continue;
	      case !isPlainObject(val):
	        objWithoutFuncs[key] = this.removeFuncs(val);
	        break;
	      default:
	        objWithoutFuncs[key] = val;
	    }
	  }
	  return objWithoutFuncs;
	};


	/*
	Update state

	@private
	@param state {Object} state object to write to ko.router.state
	 */

	_writeState = function(state) {
	  var currentTitle, currentUrl;
	  currentUrl = location.pathname + location.search + location.hash;
	  currentTitle = document.title;
	  return history.replaceState(_removeFuncs(state), currentTitle, currentUrl);
	};


	/*
	Read state

	@private
	 */

	_getState = function() {
	  var _ref2;
	  return (_ref2 = _state()) != null ? _ref2 : {};
	};


	/*
	Initialize ko.router.state

	@return state {Observable} observable state object
	 */

	init = function() {
	  _patchNativeMethods();
	  _listenForExternalChanges();
	  return ko.pureComputed({
	    read: _state,
	    write: _writeState
	  });
	};


	/*
	ko history.state abstraction

	@example reading state
	  ko.router.state()

	@example writing state
	  ko.router.state({ foo: 'bar' })

	@example subscribing to state
	  function handleStatechange(newState) {
	    console.log(newState)
	  }
	  ko.router.state.subscribe(handleStatechange)
	 */

	KoRouterState = (function() {

	  /*
	  Initializes state object
	  
	  @returns stateObs {Observable} observable `history.state` object
	   */
	  function KoRouterState() {
	    var stateObservable;
	    if (!_initialized) {
	      _patchNativeMethods();
	      _listenForExternalChanges();
	      _initialized = true;
	    }
	    stateObservable = ko.pureComputed({
	      read: _getState,
	      write: _writeState
	    });
	    return stateObservable;
	  }

	  return KoRouterState;

	})();

	module.exports = KoRouterState;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(19);

	/**
	 * Expose `pathToRegexp`.
	 */
	module.exports = pathToRegexp;

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
	  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
	  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
	  '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
	  // Match regexp special characters that are always escaped.
	  '([.+*?=^!:${}()[\\]|\\/])'
	].join('|'), 'g');

	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {String} group
	 * @return {String}
	 */
	function escapeGroup (group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1');
	}

	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {RegExp} re
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function attachKeys (re, keys) {
	  re.keys = keys;
	  return re;
	}

	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {String}
	 */
	function flags (options) {
	  return options.sensitive ? '' : 'i';
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
	  var groups = path.source.match(/\((?!\?)/g);

	  if (groups) {
	    for (var i = 0; i < groups.length; i++) {
	      keys.push({
	        name:      i,
	        delimiter: null,
	        optional:  false,
	        repeat:    false
	      });
	    }
	  }

	  return attachKeys(path, keys);
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
	  var parts = [];

	  for (var i = 0; i < path.length; i++) {
	    parts.push(pathToRegexp(path[i], keys, options).source);
	  }

	  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
	  return attachKeys(regexp, keys);
	}

	/**
	 * Replace the specific tags with regexp strings.
	 *
	 * @param  {String} path
	 * @param  {Array}  keys
	 * @return {String}
	 */
	function replacePath (path, keys) {
	  var index = 0;

	  function replace (_, escaped, prefix, key, capture, group, suffix, escape) {
	    if (escaped) {
	      return escaped;
	    }

	    if (escape) {
	      return '\\' + escape;
	    }

	    var repeat   = suffix === '+' || suffix === '*';
	    var optional = suffix === '?' || suffix === '*';

	    keys.push({
	      name:      key || index++,
	      delimiter: prefix || '/',
	      optional:  optional,
	      repeat:    repeat
	    });

	    prefix = prefix ? ('\\' + prefix) : '';
	    capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');

	    if (repeat) {
	      capture = capture + '(?:' + prefix + capture + ')*';
	    }

	    if (optional) {
	      return '(?:' + prefix + '(' + capture + '))?';
	    }

	    // Basic parameter support.
	    return prefix + '(' + capture + ')';
	  }

	  return path.replace(PATH_REGEXP, replace);
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
	  keys = keys || [];

	  if (!isArray(keys)) {
	    options = keys;
	    keys = [];
	  } else if (!options) {
	    options = {};
	  }

	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, keys, options);
	  }

	  if (isArray(path)) {
	    return arrayToRegexp(path, keys, options);
	  }

	  var strict = options.strict;
	  var end = options.end !== false;
	  var route = replacePath(path, keys);
	  var endsWithSlash = path.charAt(path.length - 1) === '/';

	  // In non-strict mode we allow a slash at the end of match. If the path to
	  // match already ends with a slash, we remove it for consistency. The slash
	  // is valid at the end of a path match, not in the middle. This is important
	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
	  if (!strict) {
	    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
	  }

	  if (end) {
	    route += '$';
	  } else {
	    // In non-ending mode, we need the capturing groups to match as much as
	    // possible by using a positive lookahead to the end or next path segment.
	    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
	  }

	  return attachKeys(new RegExp('^' + route, flags(options)), keys);
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var baseIsFunction = __webpack_require__(18),
	    isNative = __webpack_require__(16);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/** Native method references. */
	var Uint8Array = isNative(Uint8Array = global.Uint8Array) && Uint8Array;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return objToString.call(value) == funcTag;
	};

	module.exports = isFunction;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(16),
	    shimIsPlainObject = __webpack_require__(17);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/** Native method references. */
	var getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf;

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * **Note:** This method assumes objects created by the `Object` constructor
	 * have no inherited enumerable properties.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
	  if (!(value && objToString.call(value) == objectTag)) {
	    return false;
	  }
	  var valueOf = value.valueOf,
	      objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

	  return objProto
	    ? (value == objProto || getPrototypeOf(value) == objProto)
	    : shimIsPlainObject(value);
	};

	module.exports = isPlainObject;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(20);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(25);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(21)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var escapeRegExp = __webpack_require__(22),
	    isObjectLike = __webpack_require__(23);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used to detect host constructors (Safari > 5). */
	var reHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reNative = RegExp('^' +
	  escapeRegExp(objToString)
	  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (objToString.call(value) == funcTag) {
	    return reNative.test(fnToString.call(value));
	  }
	  return (isObjectLike(value) && reHostCtor.test(value)) || false;
	}

	module.exports = isNative;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var baseForIn = __webpack_require__(24),
	    isObjectLike = __webpack_require__(23);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/**
	 * A fallback implementation of `_.isPlainObject` which checks if `value`
	 * is an object created by the `Object` constructor or has a `[[Prototype]]`
	 * of `null`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 */
	function shimIsPlainObject(value) {
	  var Ctor;

	  // Exit early for non `Object` objects.
	  if (!(isObjectLike(value) && objToString.call(value) == objectTag) ||
	      (!hasOwnProperty.call(value, 'constructor') &&
	        (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
	    return false;
	  }
	  // IE < 9 iterates inherited properties before own properties. If the first
	  // iterated property is an object's own property then there are no inherited
	  // enumerable properties.
	  var result;
	  // In most environments an object's own properties are iterated before
	  // its inherited properties. If the last iterated property is an object's
	  // own property then there are no inherited enumerable properties.
	  baseForIn(value, function(subValue, key) {
	    result = key;
	  });
	  return typeof result == 'undefined' || hasOwnProperty.call(value, result);
	}

	module.exports = shimIsPlainObject;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.isFunction` without support for environments
	 * with incorrect `typeof` results.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 */
	function baseIsFunction(value) {
	  // Avoid a Chakra JIT bug in compatibility modes of IE 11.
	  // See https://github.com/jashkenas/underscore/issues/1621 for more details.
	  return typeof value == 'function' || false;
	}

	module.exports = baseIsFunction;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    draining = true;
	    var currentQueue;
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        var i = -1;
	        while (++i < len) {
	            currentQueue[i]();
	        }
	        len = queue.length;
	    }
	    draining = false;
	}
	process.nextTick = function (fun) {
	    queue.push(fun);
	    if (!draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(26);

	/**
	 * Used to match `RegExp` special characters.
	 * See this [article on `RegExp` characters](http://www.regular-expressions.info/characters.html#special)
	 * for more details.
	 */
	var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
	    reHasRegExpChars = RegExp(reRegExpChars.source);

	/**
	 * Escapes the `RegExp` special characters "\", "^", "$", ".", "|", "?", "*",
	 * "+", "(", ")", "[", "]", "{" and "}" in `string`.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escapeRegExp('[lodash](https://lodash.com/)');
	 * // => '\[lodash\]\(https://lodash\.com/\)'
	 */
	function escapeRegExp(string) {
	  string = baseToString(string);
	  return (string && reHasRegExpChars.test(string))
	    ? string.replace(reRegExpChars, '\\$&')
	    : string;
	}

	module.exports = escapeRegExp;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return (value && typeof value == 'object') || false;
	}

	module.exports = isObjectLike;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(27),
	    keysIn = __webpack_require__(28);

	/**
	 * The base implementation of `_.forIn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForIn(object, iteratee) {
	  return baseFor(object, iteratee, keysIn);
	}

	module.exports = baseForIn;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Converts `value` to a string if it is not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  if (typeof value == 'string') {
	    return value;
	  }
	  return value == null ? '' : (value + '');
	}

	module.exports = baseToString;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(29);

	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iterator functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	function baseFor(object, iteratee, keysFunc) {
	  var index = -1,
	      iterable = toObject(object),
	      props = keysFunc(object),
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];
	    if (iteratee(iterable[key], key, iterable) === false) {
	      break;
	    }
	  }
	  return object;
	}

	module.exports = baseFor;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(30),
	    isArray = __webpack_require__(31),
	    isIndex = __webpack_require__(32),
	    isLength = __webpack_require__(33),
	    isObject = __webpack_require__(34),
	    support = __webpack_require__(35);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;

	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = keysIn;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(34);

	/**
	 * Converts `value` to an object if it is not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}

	module.exports = toObject;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(33),
	    isObjectLike = __webpack_require__(23);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  var length = isObjectLike(value) ? value.length : undefined;
	  return (isLength(length) && objToString.call(value) == argsTag) || false;
	}

	module.exports = isArguments;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(33),
	    isNative = __webpack_require__(16),
	    isObjectLike = __webpack_require__(23);

	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return (isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag) || false;
	};

	module.exports = isArray;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the maximum length of an array-like value.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * for more details.
	 */
	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = +value;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}

	module.exports = isIndex;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the maximum length of an array-like value.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * for more details.
	 */
	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on ES `ToLength`. See the
	 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
	 * for more details.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	module.exports = isLength;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is the language type of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * **Note:** See the [ES5 spec](https://es5.github.io/#x8) for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return type == 'function' || (value && type == 'object') || false;
	}

	module.exports = isObject;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isNative = __webpack_require__(16);

	/** Used to detect functions containing a `this` reference. */
	var reThis = /\bthis\b/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to detect DOM support. */
	var document = (document = global.window) && document.document;

	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * An object environment feature flags.
	 *
	 * @static
	 * @memberOf _
	 * @type Object
	 */
	var support = {};

	(function(x) {

	  /**
	   * Detect if functions can be decompiled by `Function#toString`
	   * (all but Firefox OS certified apps, older Opera mobile browsers, and
	   * the PlayStation 3; forced `false` for Windows 8 apps).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.funcDecomp = !isNative(global.WinRTError) && reThis.test(function() { return this; });

	  /**
	   * Detect if `Function#name` is supported (all but IE).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.funcNames = typeof Function.name == 'string';

	  /**
	   * Detect if the DOM is supported.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  try {
	    support.dom = document.createDocumentFragment().nodeType === 11;
	  } catch(e) {
	    support.dom = false;
	  }

	  /**
	   * Detect if `arguments` object indexes are non-enumerable.
	   *
	   * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
	   * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
	   * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
	   * checks for indexes that exceed their function's formal parameters with
	   * associated values of `0`.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  try {
	    support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
	  } catch(e) {
	    support.nonEnumArgs = true;
	  }
	}(0, 0));

	module.exports = support;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])
});
;