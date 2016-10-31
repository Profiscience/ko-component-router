'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

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
    var routes = _ref.routes,
        _ref$base = _ref.base,
        base = _ref$base === undefined ? '' : _ref$base,
        _ref$hashbang = _ref.hashbang,
        hashbang = _ref$hashbang === undefined ? false : _ref$hashbang,
        _ref$inTransition = _ref.inTransition,
        inTransition = _ref$inTransition === undefined ? noop : _ref$inTransition,
        _ref$outTransition = _ref.outTransition,
        outTransition = _ref$outTransition === undefined ? noop : _ref$outTransition,
        _ref$persistState = _ref.persistState,
        persistState = _ref$persistState === undefined ? false : _ref$persistState,
        _ref$persistQuery = _ref.persistQuery,
        persistQuery = _ref$persistQuery === undefined ? false : _ref$persistQuery,
        _ref$queryParser = _ref.queryParser,
        queryParser = _ref$queryParser === undefined ? _qs2.default.parse : _ref$queryParser,
        _ref$queryStringifier = _ref.queryStringifier,
        queryStringifier = _ref$queryStringifier === undefined ? _qs2.default.stringify : _ref$queryStringifier;

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
      persistQuery: persistQuery,
      queryParser: queryParser,
      queryStringifier: queryStringifier
    };

    this.ctx = new _context2.default(bindingCtx, this.config);

    var isRoot = (0, _utils.isUndefined)(this.ctx.$parent);

    this.onclick = this.onclick.bind(this);
    this.onpopstate = this.onpopstate.bind(this);
    document.addEventListener(clickEvent, this.onclick, false);
    if (isRoot) {
      window.addEventListener('popstate', this.onpopstate, false);
    }

    var dispatch = true;
    if (!isRoot) {
      dispatch = this.ctx.$parent.path() !== this.ctx.$parent.canonicalPath();
    }

    if (dispatch) {
      var path = this.config.hashbang && ~location.hash.indexOf('#!') ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;

      var state = false;
      var query = false;

      if (!isRoot) {
        state = this.ctx.$parent._$childInitState;
        query = this.ctx.$parent._$childInitQuery;
        delete this.ctx.$parent._$childInitState;
        delete this.ctx.$parent._$childInitQuery;
      }

      this.ctx._update(path, state, false, query);
    }
  }

  _createClass(Router, [{
    key: 'onpopstate',
    value: function onpopstate(e) {
      if (e.defaultPrevented) {
        return;
      }

      var path = location.pathname + location.search + location.hash;
      var state = (e.state || {})[(0, _utils.normalizePath)(this.ctx.config.depth + this.ctx.pathname())];

      if (this.ctx._update(path, state, false)) {
        e.preventDefault();
      }
    }
  }, {
    key: 'onclick',
    value: function onclick(e) {
      // ensure link
      var el = e.target;
      while (el && 'A' !== el.nodeName) {
        el = el.parentNode;
      }
      if (!el || 'A' !== el.nodeName) {
        return;
      }

      var isDoubleClick = 1 !== which(e);
      var hasModifier = e.metaKey || e.ctrlKey || e.shiftKey;
      var isDownload = el.hasAttribute('download');
      var hasOtherTarget = el.hasAttribute('target');
      var hasExternalRel = el.getAttribute('rel') === 'external';
      var isMailto = ~(el.getAttribute('href') || '').indexOf('mailto:');
      var isCrossOrigin = !sameOrigin(el.href);
      var isEmptyHash = el.getAttribute('href') === '#';

      if (isCrossOrigin || isDoubleClick || isDownload || isEmptyHash || isMailto || hasExternalRel || hasModifier || hasOtherTarget) {
        return;
      }

      var path = el.pathname + el.search + (el.hash || '');

      if (this.ctx._update(path)) {
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