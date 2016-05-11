'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var ko = require('knockout');

function decodeURLEncodedURIComponent(val) {
  if (typeof val !== 'string') {
    return val;
  }
  return decodeURIComponent(val.replace(/\+/g, ' '));
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
  var prune = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

  if (!src) {
    return prune ? undefined : dest;
  }

  var props = Object.keys(src);

  if (prune) {
    for (var prop in dest) {
      if (props.indexOf(prop) < 0) {
        props.push(prop);
      }
    }
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _prop = _step.value;

      if (isUndefined(dest[_prop])) dest[_prop] = createAsObservable ? fromJS(src[_prop]) : src[_prop];else if (ko.isWritableObservable(dest[_prop])) {
        if (!deepEquals(dest[_prop](), src[_prop])) {
          dest[_prop](src[_prop]);
        }
      } else if (isUndefined(src[_prop])) dest[_prop] = undefined;else if (src[_prop].constructor === Object) {
        if (prune) {
          dest[_prop] = {};
        }

        merge(dest[_prop], src[_prop], createAsObservable);
      } else dest[_prop] = src[_prop];
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

  return dest;
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
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = fooProps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var prop = _step2.value;

        if (!deepEquals(foo[prop], bar[prop])) {
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
  } else if (Array.isArray(foo) && Array.isArray(bar)) {
    if (foo.length !== bar.length) {
      return false;
    }
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = foo[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var el = _step3.value;

        if (bar.indexOf(el) < 0) {
          return false;
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
  } else {
    return foo === bar;
  }
}

function fromJS(obj, parentIsArray) {
  var obs = void 0;

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

function identity(x) {
  return x;
}

function isUndefined(x) {
  return typeof x === 'undefined';
}

function isPrimitiveOrDate(obj) {
  return obj === null || obj === undefined || obj.constructor === String || obj.constructor === Number || obj.constructor === Boolean || obj instanceof Date;
}

module.exports = {
  decodeURLEncodedURIComponent: decodeURLEncodedURIComponent,
  mapKeys: mapKeys,
  merge: merge,
  deepEquals: deepEquals,
  identity: identity,
  isUndefined: isUndefined
};