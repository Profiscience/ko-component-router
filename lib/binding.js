'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.resolveHref = resolveHref;

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _utils = require('./utils');

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

    var handled = router.update(route, _knockout2.default.toJS(state), true, _knockout2.default.toJS(query), true);

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
  _knockout2.default.tasks.schedule(function () {
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