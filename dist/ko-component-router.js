(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["ko-component-router"] = factory();
	else
		root["ko-component-router"] = factory();
})(this, function() {
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

	var HashbangRouter, PushstateRouter, start;

	HashbangRouter = __webpack_require__(1);

	PushstateRouter = __webpack_require__(2);


	/*
	Initializes the router

	@param _ko {Knockout} ko context
	@param routes {Object} routes object
	@param options {Object} config object
	@option basePath {String} path to route from
	@option HTML5 {Boolean} whether or not pushstate routing should be used
	 */

	start = function(_ko, routes, options) {
	  var HTML5, Router, basePath, ref, ref1;
	  if (options == null) {
	    options = {};
	  }
	  HTML5 = (ref = options.HTML5) != null ? ref : false;
	  basePath = (ref1 = options.basePath) != null ? ref1 : '';
	  Router = HTML5 ? PushstateRouter : HashbangRouter;
	  _ko.router = new Router(_ko, routes, basePath);
	  return _ko.components.register('ko-component-router', __webpack_require__(3)(_ko));
	};

	module.exports = {
	  start: start
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var HashbangRouter, history, location, pathUtil, ref, ref1,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	pathUtil = __webpack_require__(6);

	location = (ref = (ref1 = window.history) != null ? ref1.location : void 0) != null ? ref : window.location;

	history = window.history;


	/*
	HTML4 (hashbang) Router

	@extend AbstractRouter
	 */

	HashbangRouter = (function(superClass) {
	  extend(HashbangRouter, superClass);


	  /*
	  Constructs a new HashbangRouter
	  
	  @param _ko {Knockout} ko context
	  @param routes {Object} routes in the form { '/path': 'foo' }
	  @param basePath {String} basepath to begin routing from
	   */

	  function HashbangRouter(_ko, routes, _basePath) {
	    var path, redirectUrl;
	    this._basePath = _basePath;
	    this._basePath = pathUtil.join('/', location.pathname, '/#!');
	    path = location.hash.replace('#!', '') + location.search || '/';
	    redirectUrl = pathUtil.join(this._basePath, path);
	    if (location.href.indexOf(redirectUrl) < 0) {
	      if (history.emulate) {
	        location.replace(redirectUrl);
	      } else {
	        history.replaceState(history.state, document.title, redirectUrl);
	      }
	    }
	    HashbangRouter.__super__.constructor.apply(this, arguments);
	  }


	  /*
	  Changes URL, clears state, and add history entry
	  
	  @note checks for polyfilled History API (which inserts hash automatically)
	    otherwise delegates to abstract
	  
	  @see https://github.com/devote/HTML5-History-API
	  
	  @param path {String}
	   */

	  HashbangRouter.prototype._pushState = function(path) {
	    if (history.emulate) {
	      return history.pushState({}, document.title, path);
	    } else {
	      return HashbangRouter.__super__._pushState.apply(this, arguments);
	    }
	  };


	  /*
	  Changes URL, clears state
	  
	  @note checks for polyfilled History API (which inserts hash automatically)
	    otherwise delegates to abstract
	  
	  @see https://github.com/devote/HTML5-History-API
	  
	  @param path {String}
	   */

	  HashbangRouter.prototype._replaceState = function(path) {
	    if (history.emulate) {
	      return history.replaceState(history.state, document.title, path);
	    } else {
	      return HashbangRouter.__super__._replaceState.apply(this, arguments);
	    }
	  };


	  /*
	  Gets the current path from the URL
	  
	  @return {String}
	   */

	  HashbangRouter.prototype._getPathFromUrl = function() {
	    var path;
	    path = HashbangRouter.__super__._getPathFromUrl.apply(this, arguments);
	    return path.split('#!')[1] || '/';
	  };

	  return HashbangRouter;

	})(__webpack_require__(4));

	module.exports = HashbangRouter;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var PushstateRouter, history, location, pathUtil, ref, ref1,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	pathUtil = __webpack_require__(6);

	location = (ref = (ref1 = window.history) != null ? ref1.location : void 0) != null ? ref : window.location;

	history = window.history;


	/*
	HTML5 (pushstate) Router

	@extend AbstractRouter
	 */

	PushstateRouter = (function(superClass) {
	  extend(PushstateRouter, superClass);


	  /*
	  Constructs a new PushstateRouter
	  
	  @param _ko {Knockout} ko context
	  @param routes {Obj} routes in the form { '/path': 'component' }
	  @param basePath {String} basepath to route from
	   */

	  function PushstateRouter(_ko, routes, _basePath) {
	    this._basePath = _basePath != null ? _basePath : '';
	    if (this._basePath !== '') {
	      this._basePath = pathUtil.join('/', this._basePath).replace('\/$', '');
	    }
	    PushstateRouter.__super__.constructor.apply(this, arguments);
	  }


	  /*
	  Gets the current path from the URL
	  
	  @return {String} path
	   */

	  PushstateRouter.prototype._getPathFromUrl = function() {
	    var path, ref2;
	    path = PushstateRouter.__super__._getPathFromUrl.apply(this, arguments);
	    if (this._basePath !== '') {
	      return (ref2 = path.split(this._basePath)[1]) != null ? ref2 : path;
	    } else {
	      return path;
	    }
	  };

	  return PushstateRouter;

	})(__webpack_require__(4));

	module.exports = PushstateRouter;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	<ko-component-router> component definition

	@param router {Router} ko.router (to preserve ko context)
	@return {Component} <ko-component-router> definition
	 */
	var koRouterComponent;

	koRouterComponent = function(router) {
	  return {
	    template: __webpack_require__(7),
	    viewModel: __webpack_require__(5).bind(null, router),
	    synchronous: true
	  };
	};

	module.exports = koRouterComponent;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var AbstractRouter, Route, State, _stateSubscriptionReference, location, pathUtil, ref, ref1,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	pathUtil = __webpack_require__(6);

	location = (ref = (ref1 = window.history) != null ? ref1.location : void 0) != null ? ref : window.location;

	Route = __webpack_require__(8);

	State = __webpack_require__(9);

	_stateSubscriptionReference = null;


	/*
	Base router class

	@abstract
	@param routes {Object} routes in the form { '/path': 'component' }
	 */

	AbstractRouter = (function() {

	  /*
	  Initializes a new router
	  
	  @param _ko {Knockout} ko context
	  @param routes {Object} routes in the for { '/path': 'component' }
	  @return {Router} new router instance
	   */
	  function AbstractRouter(_ko, routes) {
	    this._onContextMenu = bind(this._onContextMenu, this);
	    this._onClick = bind(this._onClick, this);
	    this._onStateChange = bind(this._onStateChange, this);
	    var component, path;
	    this.state = new State(_ko);
	    this._routes = [];
	    for (path in routes) {
	      component = routes[path];
	      this._routes.push(new Route(path, component));
	    }
	    this.current = _ko.observable({});
	    window.addEventListener('click', this._onClick);
	    window.addEventListener('contextmenu', this._onContextMenu);
	    _stateSubscriptionReference = this.state.subscribe(this._onStateChange);
	    path = this._getPathFromUrl();
	    this.redirect(path);
	  }


	  /*
	  Navigate to the given `path`
	  
	  @note `path` should not include base path
	  @note clears the state
	  
	  @param path {String} path to navigate to
	  @return {Boolean} route was handled
	   */

	  AbstractRouter.prototype.show = function(path) {
	    if (!this._changePage(path)) {
	      return false;
	    }
	    this._pushState(path);
	    return true;
	  };


	  /*
	  Redirects to the given `path`
	  
	  @note `path` should not include base path
	  @note clears the state
	  
	  @param path {String} path to navigate to
	  @return {Boolean} route was handled
	   */

	  AbstractRouter.prototype.redirect = function(path) {
	    if (!this._changePage(path)) {
	      return false;
	    }
	    this._replaceState(path);
	    return true;
	  };


	  /*
	  Disposes of event listeners and subscriptions,
	  killing the router
	  
	  @private
	   */

	  AbstractRouter.prototype._stop = function() {
	    window.removeEventListener('click', this._onClick);
	    window.removeEventListener('contextmenu', this._onContextMenu);
	    return _stateSubscriptionReference.dispose();
	  };


	  /*
	  Handles statechange (as abstracted by ko.router.state)
	  
	  @private
	   */

	  AbstractRouter.prototype._onStateChange = function() {
	    var path;
	    path = this._getPathFromUrl();
	    return this.redirect(path);
	  };


	  /*
	  Handles click events
	  
	  @private
	  @note patches shift/ctrl + click to work with base paths
	  @note if route isn't found, the event is passed to the browser
	  @param e {ClickEvent}
	   */

	  AbstractRouter.prototype._onClick = function(e) {
	    var el, path, target;
	    el = this._getParentAnchor(e.target);
	    if (this._ignoreClick(e, el)) {
	      return;
	    }
	    path = this._getPathFromAnchor(el);
	    if (e.metaKey || e.ctrlKey || e.shiftKey) {
	      e.preventDefault();
	      target = e.metaKey || e.ctrlKey ? null : '_blank';
	      window.open(this._basePath + path, target);
	      return;
	    }
	    if (this.show(path)) {
	      return e.preventDefault();
	    }
	  };


	  /*
	  Finds the most specific matching route and sets the `current` properties
	  
	  @private
	  @param path {String} path to set page
	  @return {Boolean} whether or not the route was handled
	   */

	  AbstractRouter.prototype._changePage = function(path) {
	    var _p, component, fewestDynamicSegments, i, j, k, len, len1, matchedRoutes, numDynamicSegments, params, ref2, route;
	    params = {};
	    matchedRoutes = [];
	    ref2 = this._routes;
	    for (j = 0, len = ref2.length; j < len; j++) {
	      route = ref2[j];
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
	    for (i = k = 0, len1 = matchedRoutes.length; k < len1; i = ++k) {
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
	    this.current({
	      path: path,
	      routeParams: params,
	      component: component
	    });
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
	  @param el {DOMElement} anchor element clicked
	  @return {Boolean} click should be ignored
	   */

	  AbstractRouter.prototype._ignoreClick = function(arg, el) {
	    var defaultPrevented, detail;
	    detail = arg.detail, defaultPrevented = arg.defaultPrevented;
	    return detail === 2 || defaultPrevented || !this._isLink(el) || el.getAttribute('download') || el.getAttribute('rel') === 'external' || el.pathname === this.current().path || el.getAttribute('href').indexOf('mailto:') > -1 || el.target || !this._sameOrigin(el.href);
	  };


	  /*
	  Gets the parent link of an element
	  
	  @private
	  @param el {DOMElement}
	  @return {DOMElement} parent anchor
	   */

	  AbstractRouter.prototype._getParentAnchor = function(el) {
	    while (el && 'A' !== el.nodeName) {
	      el = el.parentNode;
	    }
	    return el;
	  };


	  /*
	  Check to see if `el` is a link
	  
	  @private
	  @param el {DOMElement}
	  @return {Boolean} `el` is link
	   */

	  AbstractRouter.prototype._isLink = function(el) {
	    el = this._getParentAnchor(el);
	    return el && 'A' === el.nodeName;
	  };


	  /*
	  Gets the current path from the URL
	  
	  @private
	  @abstract
	  @return {String} current path
	   */

	  AbstractRouter.prototype._getPathFromUrl = function() {
	    return location.pathname + location.search + location.hash;
	  };


	  /*
	  Get the full (absolute) path for `el`
	  
	  @private
	  @param el {DOMElement}
	  @return {String} full path
	   */

	  AbstractRouter.prototype._getPathFromAnchor = function(el) {
	    var href, path;
	    href = el.getAttribute('href');
	    path = (function() {
	      switch (false) {
	        case href[0] !== '/':
	          return el.pathname;
	        case href !== '..':
	          return pathUtil.resolve(this.current().path, href);
	        default:
	          return pathUtil.resolve(this.current().path, "../" + href);
	      }
	    }).call(this);
	    path + el.search + (el.hash || '');
	    return path.replace(this._basePath, '');
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


	  /*
	  Handle 'contextmenu' (right-click) events
	  
	  @private
	  @param e {ContextMenuEvent}
	   */

	  AbstractRouter.prototype._onContextMenu = function(e) {
	    var el;
	    el = this._getParentAnchor(e.target);
	    if (e.defaultPrevented || !this._isLink(el)) {
	      return;
	    }
	    return this._patchContextMenu(el);
	  };


	  /*
	  Ensure that context menu options like 'open in new tab/window'
	  work correctly
	  
	  @private
	  @param el {DOMElement}
	   */

	  AbstractRouter.prototype._patchContextMenu = function(el) {
	    var orig, path, revertPatch, url;
	    if (el.hasAttribute('data-orig-href')) {
	      return;
	    }
	    orig = el.getAttribute('href');
	    path = this._getPathFromAnchor(el);
	    url = this._basePath + path;
	    el.setAttribute('data-orig-href', orig);
	    el.setAttribute('href', url);
	    revertPatch = this._revertContextMenuPatch.bind(this, el);
	    return window.addEventListener('click', revertPatch);
	  };


	  /*
	  Reverts context menu patch when context menu is closed
	  
	  @private
	  @param el {DOMElement}
	   */

	  AbstractRouter.prototype._revertContextMenuPatch = function(el) {
	    var orig;
	    orig = el.getAttribute('data-orig-href');
	    el.setAttribute('href', orig);
	    el.removeAttribute('data-orig-href');
	    return window.removeEventListener('click', this._revertContextMenuPatch);
	  };

	  return AbstractRouter;

	})();

	module.exports = AbstractRouter;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	Viewmodel class for <ko-component-router>

	@private
	 */
	var KoComponentRouterViewModel;

	KoComponentRouterViewModel = (function() {

	  /*
	  Constructs a new router viewmodel that sets
	  the component on page change
	  
	  @param _ko {Knockout} knockout context
	   */
	  function KoComponentRouterViewModel(_ko) {
	    this._router = _ko.router;
	    this.component = _ko.observable(this._router.current().component);
	    this.routeParams = _ko.observable(this._router.current().routeParams);
	    this._pageChangeSubscription = this._router.current.subscribe((function(_this) {
	      return function(current) {
	        if (current.component === _this.component()) {
	          return;
	        }
	        _this.routeParams(current.routeParams);
	        return _this.component(current.component);
	      };
	    })(this));
	  }


	  /*
	  ko `dispose` callback to destroy bindings and subscriptions
	  
	  @note called automatically when a component is destroyed
	   */

	  KoComponentRouterViewModel.prototype.dispose = function() {
	    this._pageChangeSubscription.dispose();
	    return this._router._stop();
	  };

	  return KoComponentRouterViewModel;

	})();

	module.exports = KoComponentRouterViewModel;


/***/ },
/* 6 */
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
	var util = __webpack_require__(10);


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
	  __webpack_require__(11).exists(path, callback);
	}, 'path.exists is now called `fs.exists`.');


	exports.existsSync = util.deprecate(function(path) {
	  return __webpack_require__(11).existsSync(path);
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div data-bind='component: {\n\n  name:    component,\n  params:  routeParams\n\n}'></div>";

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Route, pathToRegExp,
	  slice = [].slice;

	pathToRegExp = __webpack_require__(12);


	/*
	Route class

	@private
	 */

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
	    var _, i, j, k, len, params, pathParams, ref, v;
	    path = path.split('?')[0];
	    params = {};
	    ref = this.regExp.exec(path), _ = ref[0], pathParams = 2 <= ref.length ? slice.call(ref, 1) : [];
	    for (i = j = 0, len = pathParams.length; j < len; i = ++j) {
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var KoRouterState, _currentUrl, _getState, _initialized, _listenForExternalChanges, _patchNativeHistoryMethods, _removeFuncs, _state, _writeState, isFunction, isPlainObject, location, objectsMatch, ref, ref1;

	isFunction = __webpack_require__(13);

	isPlainObject = __webpack_require__(14);

	objectsMatch = __webpack_require__(15);

	location = (ref = (ref1 = window.history) != null ? ref1.location : void 0) != null ? ref : window.location;

	_initialized = false;

	_state = null;

	_currentUrl = '';


	/*
	Patch history.pushState and history.replaceState to update
	ko.router.state

	@private
	 */

	_patchNativeHistoryMethods = function() {
	  history._nativePushState = history.pushState;
	  history.pushState = function(state, title, url) {
	    var pathChanged, ref2, stateChanged;
	    if (state == null) {
	      state = {};
	    }
	    stateChanged = !objectsMatch(state)((ref2 = _state()) != null ? ref2 : {});
	    pathChanged = _currentUrl !== url;
	    history._nativePushState.apply(this, arguments);
	    if (stateChanged || pathChanged) {
	      _state(state);
	    }
	    return _currentUrl = url;
	  };
	  history._nativeReplaceState = history.replaceState;
	  return history.replaceState = function(state, title, url) {
	    var pathChanged, ref2, stateChanged;
	    if (state == null) {
	      state = {};
	    }
	    stateChanged = !objectsMatch(state)((ref2 = _state()) != null ? ref2 : {});
	    pathChanged = _currentUrl !== url;
	    history._nativeReplaceState.apply(this, arguments);
	    if (stateChanged || pathChanged) {
	      _state(state);
	    }
	    return _currentUrl = url;
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
	        objWithoutFuncs[key] = _removeFuncs(val);
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
	  var ref2;
	  return (ref2 = _state()) != null ? ref2 : {};
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
	  
	  @param _ko {Knockout} ko context
	  @returns stateObs {Observable} observable `history.state` object
	   */
	  function KoRouterState(_ko) {
	    var stateObservable;
	    _state = _ko.observable(history.state);
	    if (!_initialized) {
	      _patchNativeHistoryMethods();
	      _listenForExternalChanges();
	      _initialized = true;
	    }
	    stateObservable = _ko.pureComputed({
	      read: _getState,
	      write: _writeState
	    });
	    return stateObservable;
	  }

	  return KoRouterState;

	})();

	module.exports = KoRouterState;


/***/ },
/* 10 */
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

	exports.isBuffer = __webpack_require__(16);

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
	exports.inherits = __webpack_require__(23);

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

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(17)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(24);

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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var baseIsFunction = __webpack_require__(18),
	    isNative = __webpack_require__(19);

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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(19),
	    shimIsPlainObject = __webpack_require__(20);

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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var baseClone = __webpack_require__(21),
	    baseMatches = __webpack_require__(22);

	/**
	 * Creates a function which performs a deep comparison between a given object
	 * and `source`, returning `true` if the given object has equivalent property
	 * values, else `false`.
	 *
	 * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	 * numbers, `Object` objects, regexes, and strings. Objects are compared by
	 * their own, not inherited, enumerable properties. For comparing a single
	 * own or inherited property value see `_.matchesProperty`.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney', 'age': 36, 'active': true },
	 *   { 'user': 'fred',   'age': 40, 'active': false }
	 * ];
	 *
	 * _.filter(users, _.matches({ 'age': 40, 'active': false }));
	 * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
	 */
	function matches(source) {
	  return baseMatches(baseClone(source, true));
	}

	module.exports = matches;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 17 */
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

	var escapeRegExp = __webpack_require__(25),
	    isObjectLike = __webpack_require__(26);

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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var baseForIn = __webpack_require__(27),
	    isObjectLike = __webpack_require__(26);

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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var arrayCopy = __webpack_require__(28),
	    arrayEach = __webpack_require__(29),
	    baseCopy = __webpack_require__(30),
	    baseForOwn = __webpack_require__(31),
	    initCloneArray = __webpack_require__(32),
	    initCloneByTag = __webpack_require__(33),
	    initCloneObject = __webpack_require__(34),
	    isArray = __webpack_require__(35),
	    isObject = __webpack_require__(36),
	    keys = __webpack_require__(37);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
	cloneableTags[argsTag] = cloneableTags[arrayTag] =
	cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
	cloneableTags[dateTag] = cloneableTags[float32Tag] =
	cloneableTags[float64Tag] = cloneableTags[int8Tag] =
	cloneableTags[int16Tag] = cloneableTags[int32Tag] =
	cloneableTags[numberTag] = cloneableTags[objectTag] =
	cloneableTags[regexpTag] = cloneableTags[stringTag] =
	cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	cloneableTags[errorTag] = cloneableTags[funcTag] =
	cloneableTags[mapTag] = cloneableTags[setTag] =
	cloneableTags[weakMapTag] = false;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/**
	 * The base implementation of `_.clone` without support for argument juggling
	 * and `this` binding `customizer` functions.
	 *
	 * @private
	 * @param {*} value The value to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @param {Function} [customizer] The function to customize cloning values.
	 * @param {string} [key] The key of `value`.
	 * @param {Object} [object] The object `value` belongs to.
	 * @param {Array} [stackA=[]] Tracks traversed source objects.
	 * @param {Array} [stackB=[]] Associates clones with source counterparts.
	 * @returns {*} Returns the cloned value.
	 */
	function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
	  var result;
	  if (customizer) {
	    result = object ? customizer(value, key, object) : customizer(value);
	  }
	  if (typeof result != 'undefined') {
	    return result;
	  }
	  if (!isObject(value)) {
	    return value;
	  }
	  var isArr = isArray(value);
	  if (isArr) {
	    result = initCloneArray(value);
	    if (!isDeep) {
	      return arrayCopy(value, result);
	    }
	  } else {
	    var tag = objToString.call(value),
	        isFunc = tag == funcTag;

	    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
	      result = initCloneObject(isFunc ? {} : value);
	      if (!isDeep) {
	        return baseCopy(value, result, keys(value));
	      }
	    } else {
	      return cloneableTags[tag]
	        ? initCloneByTag(value, tag, isDeep)
	        : (object ? value : {});
	    }
	  }
	  // Check for circular references and return corresponding clone.
	  stackA || (stackA = []);
	  stackB || (stackB = []);

	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] == value) {
	      return stackB[length];
	    }
	  }
	  // Add the source value to the stack of traversed objects and associate it with its clone.
	  stackA.push(value);
	  stackB.push(result);

	  // Recursively populate clone (susceptible to call stack limits).
	  (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
	    result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
	  });
	  return result;
	}

	module.exports = baseClone;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(38),
	    isStrictComparable = __webpack_require__(39),
	    keys = __webpack_require__(37);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * The base implementation of `_.matches` which does not clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatches(source) {
	  var props = keys(source),
	      length = props.length;

	  if (length == 1) {
	    var key = props[0],
	        value = source[key];

	    if (isStrictComparable(value)) {
	      return function(object) {
	        return object != null && object[key] === value && hasOwnProperty.call(object, key);
	      };
	    }
	  }
	  var values = Array(length),
	      strictCompareFlags = Array(length);

	  while (length--) {
	    value = source[props[length]];
	    values[length] = value;
	    strictCompareFlags[length] = isStrictComparable(value);
	  }
	  return function(object) {
	    return baseIsMatch(object, props, values, strictCompareFlags);
	  };
	}

	module.exports = baseMatches;


/***/ },
/* 23 */
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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(40);

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
/* 26 */
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
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(41),
	    keysIn = __webpack_require__(42);

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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function arrayCopy(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	module.exports = arrayCopy;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A specialized version of `_.forEach` for arrays without support for callback
	 * shorthands or `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	module.exports = arrayEach;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copies the properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Array} props The property names to copy.
	 * @returns {Object} Returns `object`.
	 */
	function baseCopy(source, object, props) {
	  if (!props) {
	    props = object;
	    object = {};
	  }
	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];
	    object[key] = source[key];
	  }
	  return object;
	}

	module.exports = baseCopy;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(41),
	    keys = __webpack_require__(37);

	/**
	 * The base implementation of `_.forOwn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return baseFor(object, iteratee, keys);
	}

	module.exports = baseForOwn;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Initializes an array clone.
	 *
	 * @private
	 * @param {Array} array The array to clone.
	 * @returns {Array} Returns the initialized clone.
	 */
	function initCloneArray(array) {
	  var length = array.length,
	      result = new array.constructor(length);

	  // Add array properties assigned by `RegExp#exec`.
	  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
	    result.index = array.index;
	    result.input = array.input;
	  }
	  return result;
	}

	module.exports = initCloneArray;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var bufferClone = __webpack_require__(43);

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    stringTag = '[object String]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to match `RegExp` flags from their coerced string values. */
	var reFlags = /\w*$/;

	/**
	 * Initializes an object clone based on its `toStringTag`.
	 *
	 * **Note:** This function only supports cloning values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @param {string} tag The `toStringTag` of the object to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneByTag(object, tag, isDeep) {
	  var Ctor = object.constructor;
	  switch (tag) {
	    case arrayBufferTag:
	      return bufferClone(object);

	    case boolTag:
	    case dateTag:
	      return new Ctor(+object);

	    case float32Tag: case float64Tag:
	    case int8Tag: case int16Tag: case int32Tag:
	    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
	      var buffer = object.buffer;
	      return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

	    case numberTag:
	    case stringTag:
	      return new Ctor(object);

	    case regexpTag:
	      var result = new Ctor(object.source, reFlags.exec(object));
	      result.lastIndex = object.lastIndex;
	  }
	  return result;
	}

	module.exports = initCloneByTag;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  var Ctor = object.constructor;
	  if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
	    Ctor = Object;
	  }
	  return new Ctor;
	}

	module.exports = initCloneObject;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(44),
	    isNative = __webpack_require__(19),
	    isObjectLike = __webpack_require__(26);

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
/* 36 */
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
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(44),
	    isNative = __webpack_require__(19),
	    isObject = __webpack_require__(36),
	    shimKeys = __webpack_require__(45);

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
	 * for more details.
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
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  if (object) {
	    var Ctor = object.constructor,
	        length = object.length;
	  }
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	     (typeof object != 'function' && (length && isLength(length)))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};

	module.exports = keys;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(46);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * The base implementation of `_.isMatch` without support for callback
	 * shorthands or `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Array} props The source property names to match.
	 * @param {Array} values The source values to match.
	 * @param {Array} strictCompareFlags Strict comparison flags for source values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
	  var length = props.length;
	  if (object == null) {
	    return !length;
	  }
	  var index = -1,
	      noCustomizer = !customizer;

	  while (++index < length) {
	    if ((noCustomizer && strictCompareFlags[index])
	          ? values[index] !== object[props[index]]
	          : !hasOwnProperty.call(object, props[index])
	        ) {
	      return false;
	    }
	  }
	  index = -1;
	  while (++index < length) {
	    var key = props[index];
	    if (noCustomizer && strictCompareFlags[index]) {
	      var result = hasOwnProperty.call(object, key);
	    } else {
	      var objValue = object[key],
	          srcValue = values[index];

	      result = customizer ? customizer(objValue, srcValue, key) : undefined;
	      if (typeof result == 'undefined') {
	        result = baseIsEqual(srcValue, objValue, customizer, true);
	      }
	    }
	    if (!result) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = baseIsMatch;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(36);

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
	}

	module.exports = isStrictComparable;


/***/ },
/* 40 */
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
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(47);

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
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(48),
	    isArray = __webpack_require__(35),
	    isIndex = __webpack_require__(49),
	    isLength = __webpack_require__(44),
	    isObject = __webpack_require__(36),
	    support = __webpack_require__(50);

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
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var constant = __webpack_require__(51),
	    isNative = __webpack_require__(19);

	/** Native method references. */
	var ArrayBuffer = isNative(ArrayBuffer = global.ArrayBuffer) && ArrayBuffer,
	    bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice,
	    floor = Math.floor,
	    Uint8Array = isNative(Uint8Array = global.Uint8Array) && Uint8Array;

	/** Used to clone array buffers. */
	var Float64Array = (function() {
	  // Safari 5 errors when using an array buffer to initialize a typed array
	  // where the array buffer's `byteLength` is not a multiple of the typed
	  // array's `BYTES_PER_ELEMENT`.
	  try {
	    var func = isNative(func = global.Float64Array) && func,
	        result = new func(new ArrayBuffer(10), 0, 1) && func;
	  } catch(e) {}
	  return result;
	}());

	/** Used as the size, in bytes, of each `Float64Array` element. */
	var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;

	/**
	 * Creates a clone of the given array buffer.
	 *
	 * @private
	 * @param {ArrayBuffer} buffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function bufferClone(buffer) {
	  return bufferSlice.call(buffer, 0);
	}
	if (!bufferSlice) {
	  // PhantomJS has `ArrayBuffer` and `Uint8Array` but not `Float64Array`.
	  bufferClone = !(ArrayBuffer && Uint8Array) ? constant(null) : function(buffer) {
	    var byteLength = buffer.byteLength,
	        floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0,
	        offset = floatLength * FLOAT64_BYTES_PER_ELEMENT,
	        result = new ArrayBuffer(byteLength);

	    if (floatLength) {
	      var view = new Float64Array(result, 0, floatLength);
	      view.set(new Float64Array(buffer, 0, floatLength));
	    }
	    if (byteLength != offset) {
	      view = new Uint8Array(result, offset);
	      view.set(new Uint8Array(buffer, offset));
	    }
	    return result;
	  };
	}

	module.exports = bufferClone;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 44 */
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
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(48),
	    isArray = __webpack_require__(35),
	    isIndex = __webpack_require__(49),
	    isLength = __webpack_require__(44),
	    keysIn = __webpack_require__(42),
	    support = __webpack_require__(50);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;

	  var allowIndexes = length && isLength(length) &&
	    (isArray(object) || (support.nonEnumArgs && isArguments(object)));

	  var index = -1,
	      result = [];

	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = shimKeys;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(52);

	/**
	 * The base implementation of `_.isEqual` without support for `this` binding
	 * `customizer` functions.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isWhere] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, isWhere, stackA, stackB) {
	  // Exit early for identical values.
	  if (value === other) {
	    // Treat `+0` vs. `-0` as not equal.
	    return value !== 0 || (1 / value == 1 / other);
	  }
	  var valType = typeof value,
	      othType = typeof other;

	  // Exit early for unlike primitive values.
	  if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
	      value == null || other == null) {
	    // Return `false` unless both values are `NaN`.
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isWhere, stackA, stackB);
	}

	module.exports = baseIsEqual;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(36);

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
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(44),
	    isObjectLike = __webpack_require__(26);

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
/* 49 */
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
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isNative = __webpack_require__(19);

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

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var getter = _.constant(object);
	 *
	 * getter() === object;
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	module.exports = constant;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var equalArrays = __webpack_require__(53),
	    equalByTag = __webpack_require__(54),
	    equalObjects = __webpack_require__(55),
	    isArray = __webpack_require__(35),
	    isTypedArray = __webpack_require__(56);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';

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
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @param {boolean} [isWhere] Specify performing partial comparisons.
	 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag == argsTag) {
	      objTag = objectTag;
	    } else if (objTag != objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag == argsTag) {
	      othTag = objectTag;
	    } else if (othTag != objectTag) {
	      othIsArr = isTypedArray(other);
	    }
	  }
	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;

	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	      othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	  if (valWrapped || othWrapped) {
	    return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isWhere, stackA, stackB);
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);

	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] == object) {
	      return stackB[length] == other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);

	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isWhere, stackA, stackB);

	  stackA.pop();
	  stackB.pop();

	  return result;
	}

	module.exports = baseIsEqualDeep;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing arrays.
	 * @param {boolean} [isWhere] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, isWhere, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length,
	      result = true;

	  if (arrLength != othLength && !(isWhere && othLength > arrLength)) {
	    return false;
	  }
	  // Deep compare the contents, ignoring non-numeric properties.
	  while (result && ++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];

	    result = undefined;
	    if (customizer) {
	      result = isWhere
	        ? customizer(othValue, arrValue, index)
	        : customizer(arrValue, othValue, index);
	    }
	    if (typeof result == 'undefined') {
	      // Recursively compare arrays (susceptible to call stack limits).
	      if (isWhere) {
	        var othIndex = othLength;
	        while (othIndex--) {
	          othValue = other[othIndex];
	          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
	          if (result) {
	            break;
	          }
	        }
	      } else {
	        result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
	      }
	    }
	  }
	  return !!result;
	}

	module.exports = equalArrays;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    stringTag = '[object String]';

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} value The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	      return +object == +other;

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object)
	        ? other != +other
	        // But, treat `-0` vs. `+0` as not equal.
	        : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings primitives and string
	      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	      return object == (other + '');
	  }
	  return false;
	}

	module.exports = equalByTag;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(37);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isWhere] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isWhere) {
	    return false;
	  }
	  var hasCtor,
	      index = -1;

	  while (++index < objLength) {
	    var key = objProps[index],
	        result = hasOwnProperty.call(other, key);

	    if (result) {
	      var objValue = object[key],
	          othValue = other[key];

	      result = undefined;
	      if (customizer) {
	        result = isWhere
	          ? customizer(othValue, objValue, key)
	          : customizer(objValue, othValue, key);
	      }
	      if (typeof result == 'undefined') {
	        // Recursively compare objects (susceptible to call stack limits).
	        result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isWhere, stackA, stackB);
	      }
	    }
	    if (!result) {
	      return false;
	    }
	    hasCtor || (hasCtor = key == 'constructor');
	  }
	  if (!hasCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor && ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = equalObjects;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(44),
	    isObjectLike = __webpack_require__(26);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return (isObjectLike(value) && isLength(value.length) && typedArrayTags[objToString.call(value)]) || false;
	}

	module.exports = isTypedArray;


/***/ }
/******/ ])
});
;