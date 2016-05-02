'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var ko = require('knockout');
var qs = require('qs');

var _require = require('./utils');

var isUndefined = _require.isUndefined;


ko.bindingHandlers.path = {
  init: function init(e, xx, b, x, c) {
    applyBinding.call(this, e, b, c);
  }
};
ko.bindingHandlers.state = {
  init: function init(e, xx, b, x, c) {
    applyBinding.call(this, e, b, c);
  }
};
ko.bindingHandlers.query = {
  init: function init(e, xx, b, x, c) {
    applyBinding.call(this, e, b, c);
  }
};
module.exports = ko.bindingHandlers.path.utils = { resolveHref: resolveHref };

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

    var _getRoute = getRoute(ctx, path);

    var _getRoute2 = _slicedToArray(_getRoute, 2);

    var router = _getRoute2[0];
    var route = _getRoute2[1];

    var handled = router.update(route, ko.toJS(state), true, ko.toJS(query));

    if (handled) {
      e.preventDefault();
      e.stopImmediatePropagation();
    } else if (!router.$parent) {
      console.error('[ko-component-router] ' + path + ' did not match any routes!'); // eslint-disable-line
    }

    return !handled;
  };

  bindingsToApply.attr = {
    href: ko.pureComputed(function () {
      return resolveHref(ctx, bindings.get('path'), query);
    })
  };

  if (path) {
    bindingsToApply.css = {
      'active-path': ko.pureComputed(function () {
        var _getRoute3 = getRoute(ctx, path);

        var _getRoute4 = _slicedToArray(_getRoute3, 2);

        var router = _getRoute4[0];
        var route = _getRoute4[1];

        return !router.isNavigating() && router.route() !== '' && route ? router.route().matches(route) : false;
      })
    };
  }

  // allow adjacent routers to initialize
  ko.tasks.schedule(function () {
    return ko.applyBindingsToNode(el, bindingsToApply);
  });
}

function getRoute(ctx, path) {
  var router = getRouter(ctx);
  var route = path ? ko.unwrap(path) : router.canonicalPath();

  if (route.indexOf('//') === 0) {
    path = route.replace('//', '/');

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
  while (!isUndefined(ctx)) {
    if (!isUndefined(ctx.$router)) {
      return ctx.$router;
    }

    ctx = ctx.$parent;
  }
}

function resolveHref(ctx, path, query) {
  var _getRoute5 = getRoute(ctx, path);

  var _getRoute6 = _slicedToArray(_getRoute5, 2);

  var router = _getRoute6[0];
  var route = _getRoute6[1];

  var querystring = query ? '?' + qs.stringify(ko.toJS(query)) : '';

  while (router.$parent) {
    route = router.config.base + route;
    router = router.$parent;
  }

  return router ? router.config.base + (!router.config.hashbang || router.$parent ? '' : '/#!') + route + querystring : '#';
}

function which(e) {
  e = e || window.event;
  return null === e.which ? e.button : e.which;
}