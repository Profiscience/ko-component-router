'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Route = function () {
  function Route(path, component) {
    _classCallCheck(this, Route);

    if (path[path.length - 1] === '!') {
      path = path.replace('!', ':child_path(.*)?');
    } else {
      path = path.replace(/\(?\*\)?/, '(.*)');
    }

    this.component = component;

    this._keys = [];
    this._regexp = (0, _pathToRegexp2.default)(path, this._keys);
  }

  _createClass(Route, [{
    key: 'matches',
    value: function matches(path) {
      var qsIndex = path.indexOf('?');

      if (~qsIndex) {
        path = path.split('?')[0];
      }

      return this._regexp.exec(decodeURIComponent(path));
    }
  }, {
    key: 'parse',
    value: function parse(path) {
      var childPath = void 0;
      var hash = '';
      var params = {};
      var hIndex = path.indexOf('#');

      if (~hIndex) {
        var parts = path.split('#');
        path = parts[0];
        hash = (0, _utils.decodeURLEncodedURIComponent)(parts[1]);
      }

      var qsIndex = path.indexOf('?');

      var _ref = ~qsIndex ? path.split('?') : [path];

      var _ref2 = _slicedToArray(_ref, 2);

      var pathname = _ref2[0];
      var querystring = _ref2[1]; // eslint-disable-line

      var matches = this._regexp.exec(decodeURIComponent(pathname));

      for (var i = 1, len = matches.length; i < len; ++i) {
        var k = this._keys[i - 1];
        var v = (0, _utils.decodeURLEncodedURIComponent)(matches[i]);
        if ((0, _utils.isUndefined)(v) || !hasOwnProperty.call(params, k.name)) {
          if (k.name === 'child_path') {
            if (!(0, _utils.isUndefined)(v)) {
              childPath = '/' + v;
              path = path.substring(0, path.lastIndexOf(childPath));
              pathname = pathname.substring(0, pathname.lastIndexOf(childPath));
            }
          } else {
            params[k.name] = v;
          }
        }
      }

      return [path, params, hash, pathname, querystring, childPath];
    }
  }]);

  return Route;
}();

exports.default = Route;