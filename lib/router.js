'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

var _route = require('./route');

var _route2 = _interopRequireDefault(_route);

var _utils = require('./utils');

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