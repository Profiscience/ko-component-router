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

function resolveHref(bindingCtx, _path, query) {
  var _parsePathBinding = parsePathBinding(bindingCtx, _path),
      _parsePathBinding2 = _slicedToArray(_parsePathBinding, 2),
      ctx = _parsePathBinding2[0],
      path = _parsePathBinding2[1];

  var querystring = query ? '?' + _qs2.default.stringify(_knockout2.default.toJS(query)) : '';

  while (ctx.$parent) {
    path = ctx.config.base + path;
    ctx = ctx.$parent;
  }

  return ctx ? ctx.config.base + (!ctx.config.hashbang || ctx.$parent ? '' : '/#!') + path + querystring : '#';
}

function applyBinding(el, bindings, bindingCtx) {
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

    var _parsePathBinding3 = parsePathBinding(bindingCtx, path),
        _parsePathBinding4 = _slicedToArray(_parsePathBinding3, 2),
        router = _parsePathBinding4[0],
        route = _parsePathBinding4[1];

    var handled = router._update(route, _knockout2.default.toJS(state), true, _knockout2.default.toJS(query), true);

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
      return resolveHref(bindingCtx, bindings.get('path'), query);
    })
  };

  if (path) {
    bindingsToApply.css = {
      'active-path': _knockout2.default.pureComputed(function () {
        return isActivePath(bindingCtx, path);
      })
    };
  }

  // allow adjacent routers to initialize
  _knockout2.default.tasks.schedule(function () {
    return _knockout2.default.applyBindingsToNode(el, bindingsToApply);
  });
}

function isActivePath(bindingCtx, _path) {
  var _parsePathBinding5 = parsePathBinding(bindingCtx, _path),
      _parsePathBinding6 = _slicedToArray(_parsePathBinding5, 2),
      ctx = _parsePathBinding6[0],
      path = _parsePathBinding6[1];

  if (localPathMatches(ctx, path)) {
    while (ctx.$child) {
      ctx = ctx.$child;
      path = path.replace(ctx.config.base, '') || '/';
      if (!localPathMatches(ctx, path)) {
        return false;
      }
    }
    return true;
  } else if (ctx.$parent) {
    return isActivePath(ctx.bindingCtx.$parentContext, path);
  } else {
    return false;
  }
}

function parsePathBinding(bindingCtx, _path) {
  var ctx = getRouter(bindingCtx);
  var path = _path ? _knockout2.default.unwrap(_path) : ctx.canonicalPath();

  if (path.indexOf('//') === 0) {
    path = path.replace('//', '/');

    while (ctx.$parent) {
      ctx = ctx.$parent;
    }
  } else {
    while (path && path.match(/\/?\.\./i) && ctx.$parent) {
      ctx = ctx.$parent;
      path = path.replace(/\/?\.\./i, '');
    }
  }

  return [ctx, path];
}

function getRouter(bindingCtx) {
  while (!(0, _utils.isUndefined)(bindingCtx)) {
    if (!(0, _utils.isUndefined)(bindingCtx.$router)) {
      return bindingCtx.$router;
    }

    bindingCtx = bindingCtx.$parentContext;
  }
}

function localPathMatches(ctx, path) {
  return (ctx.pathname() || '/') === '/' + path.split('/')[1];
}

function which(e) {
  e = e || window.event;
  return null === e.which ? e.button : e.which;
}