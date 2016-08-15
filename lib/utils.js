'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.cascade = cascade;
exports.clone = clone;
exports.decodeURLEncodedURIComponent = decodeURLEncodedURIComponent;
exports.deepEquals = deepEquals;
exports.extend = extend;
exports.identity = identity;
exports.isUndefined = isUndefined;
exports.isFunction = isFunction;
exports.isPlainObject = isPlainObject;
exports.isArray = isArray;
exports.mapKeys = mapKeys;
exports.merge = merge;

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cascade(callbacks) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return new Promise(function (resolve) {
    if (callbacks.length === 0) {
      return resolve(true);
    }
    var cb = callbacks.shift();
    var recursiveResolve = function recursiveResolve() {
      var shouldUpdate = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
      return shouldUpdate ? cascade.apply(undefined, [callbacks].concat(args)).then(resolve) : resolve(false);
    };

    if (cb.length === args.length + 1) {
      cb.apply(undefined, args.concat([recursiveResolve]));
    } else {
      var v = cb.apply(undefined, args);
      if (isUndefined(v) || typeof v.then !== 'function') {
        recursiveResolve(v);
      } else {
        v.then(recursiveResolve);
      }
    }
  });
}

function clone(obj) {
  if (isArray(obj)) {
    return obj.slice(0);
  } else if (isPlainObject(obj)) {
    return extend({}, obj, false);
  } else {
    return obj;
  }
}

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

    return true;
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
      } else if (isPlainObject(src[prop])) {
        if (_shallow) {
          dest[prop] = {};
        }
        extend(dest[prop], src[prop], createAsObservable);
      } else if (isArray(src[prop])) {
        dest[prop] = src[prop].slice(0);
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

function isFunction(x) {
  return typeof x === 'function';
}

function isPlainObject(x) {
  return x.constructor === Object;
}

function isArray(x) {
  return isFunction(x.splice);
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