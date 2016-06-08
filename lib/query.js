'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.factory = factory;

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var qsParams = {};
var trigger = _knockout2.default.observable(true);
var cache = {};

var Query = function () {
  function Query(ctx) {
    _classCallCheck(this, Query);

    this.ctx = ctx;

    if (!this.ctx.$parent) {
      var qsIndex = window.location.href.indexOf('?');
      if (~qsIndex) {
        this.updateFromString(window.location.href.split('?')[1]);
      }
    }

    // make work w/ click bindings w/o closure
    this.get = this.get.bind(this);
    this.clear = this.clear.bind(this);
    this.update = this.update.bind(this);
  }

  _createClass(Query, [{
    key: 'get',
    value: function get(prop, defaultVal) {
      var parser = arguments.length <= 2 || arguments[2] === undefined ? _utils.identity : arguments[2];

      var query = this;
      var ctx = this.ctx;
      var guid = this.ctx.config.depth + ctx.pathname();

      if (!cache[guid]) {
        cache[guid] = {};
      }

      if (!cache[guid][prop]) {
        cache[guid][prop] = {
          defaultVal: defaultVal,
          parser: parser,
          value: _knockout2.default.pureComputed({
            read: function read() {
              trigger();

              if (qsParams && qsParams[guid] && !(0, _utils.isUndefined)(qsParams[guid][prop])) {
                return cache[guid][prop].parser(qsParams[guid][prop]);
              }

              return defaultVal;
            },
            write: function write(v) {
              var _location = location;
              var pathname = _location.pathname;
              var hash = _location.hash;

              if ((0, _utils.deepEquals)(v, this.prev)) {
                return;
              }
              this.prev = v;

              (0, _utils.merge)(qsParams, _defineProperty({}, guid, _defineProperty({}, prop, v)), false);

              ctx.update(pathname + hash, ctx.state(), false, query.getNonDefaultParams()[guid]).then(function () {
                return trigger(!trigger());
              });
            },

            owner: {
              prev: null
            }
          })
        };
      }
      return cache[guid][prop].value;
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      var asObservable = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      var pathname = arguments.length <= 1 || arguments[1] === undefined ? this.ctx.pathname() : arguments[1];

      var guid = this.ctx.config.depth + pathname;
      return asObservable ? _knockout2.default.pureComputed({
        read: function read() {
          trigger();
          return this.getAll();
        },
        write: function write(q) {
          for (var pn in q) {
            this.get(pn)(q[pn]);
          }
        }
      }, this) : _knockout2.default.toJS((0, _utils.mapKeys)(qsParams[guid] || {}, function (prop) {
        return cache[guid] && cache[guid][prop] ? (0, _utils.isUndefined)(qsParams[guid][prop]) ? undefined : cache[guid][prop].parser(qsParams[guid][prop]) : qsParams[guid][prop];
      }));
    }
  }, {
    key: 'setDefaults',
    value: function setDefaults(q) {
      var parser = arguments.length <= 1 || arguments[1] === undefined ? _utils.identity : arguments[1];

      for (var pn in q) {
        this.get(pn, q[pn], parser);
      }
    }
  }, {
    key: 'clear',
    value: function clear(pathname) {
      if (typeof pathname !== 'string') {
        pathname = this.ctx.pathname();
      }
      var guid = this.ctx.config.depth + pathname;
      for (var pn in cache[guid]) {
        var p = cache[guid][pn];
        p.value(p.defaultVal);
      }
    }
  }, {
    key: 'reload',
    value: function reload() {
      var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      var guid = arguments.length <= 1 || arguments[1] === undefined ? this.ctx.config.depth + this.ctx.pathname() : arguments[1];

      if (!this.ctx.config.persistQuery || force) {
        for (var p in qsParams[guid]) {
          if (cache[guid] && cache[guid][p]) {
            cache[guid][p].value.dispose();
          }
        }
        delete qsParams[guid];
        delete cache[guid];
      }
      trigger(!trigger());
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      for (var guid in qsParams) {
        if (guid.indexOf(this.ctx.config.depth) === 0) {
          this.reload(true, guid);
        }
      }
    }
  }, {
    key: 'update',
    value: function update() {
      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var pathname = arguments.length <= 1 || arguments[1] === undefined ? this.ctx.pathname() : arguments[1];

      var guid = this.ctx.config.depth + pathname;

      if ((0, _utils.deepEquals)(qsParams[guid], query)) {
        return;
      }

      (0, _utils.merge)(qsParams, _defineProperty({}, guid, query), false);
      trigger(!trigger());
    }
  }, {
    key: 'updateFromString',
    value: function updateFromString(str, pathname) {
      if (pathname) {
        var guid = this.ctx.config.depth + pathname;
        (0, _utils.merge)(qsParams, _defineProperty({}, guid, _qs2.default.parse(str)[guid]), false);
      } else {
        (0, _utils.merge)(qsParams, _qs2.default.parse(str), false);
      }
      trigger(!trigger());
    }
  }, {
    key: 'getNonDefaultParams',
    value: function getNonDefaultParams(query, pathname) {
      var nonDefaultParams = {};
      var workingParams = qsParams;

      if (query) {
        (0, _utils.merge)(workingParams, _defineProperty({}, this.ctx.config.depth + pathname, query), false);
      }

      for (var id in workingParams) {
        if (!cache[id]) {
          nonDefaultParams[id] = workingParams[id];
        } else {
          nonDefaultParams[id] = {};
          for (var pn in workingParams[id]) {
            var p = workingParams[id][pn];
            var c = cache[id][pn];
            var d = c && c.defaultVal;
            if (!(0, _utils.isUndefined)(p) && !(0, _utils.deepEquals)(p, d)) {
              nonDefaultParams[id][pn] = p;
            }
          }
        }
      }

      return nonDefaultParams;
    }
  }, {
    key: 'getFullQueryString',
    value: function getFullQueryString(query, pathname) {
      return _qs2.default.stringify(this.getNonDefaultParams(query, pathname));
    }
  }]);

  return Query;
}();

function factory(ctx) {
  return new Query(ctx);
}