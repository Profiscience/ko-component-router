'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ko = require('knockout');
var qs = require('qs');

var _require = require('./utils');

var deepEquals = _require.deepEquals;
var identity = _require.identity;
var isUndefined = _require.isUndefined;
var mapKeys = _require.mapKeys;
var merge = _require.merge;


var qsParams = {};
var trigger = ko.observable(true);
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
      var parser = arguments.length <= 2 || arguments[2] === undefined ? identity : arguments[2];

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
          value: ko.pureComputed({
            read: function read() {
              trigger();

              if (qsParams && qsParams[guid] && !isUndefined(qsParams[guid][prop])) {
                return cache[guid][prop].parser(qsParams[guid][prop]);
              }

              return defaultVal;
            },
            write: function write(v) {
              if (deepEquals(v, this.prev)) {
                return;
              }
              this.prev = v;

              merge(qsParams, _defineProperty({}, guid, _defineProperty({}, prop, v)), false);

              ctx.update(location.pathname + location.hash, ctx.state(), false, query.getNonDefaultParams()[guid]);
              trigger(!trigger());
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
      return asObservable ? ko.pureComputed({
        read: function read() {
          trigger();
          return this.getAll();
        },
        write: function write(q) {
          for (var pn in q) {
            this.get(pn)(q[pn]);
          }
        }
      }, this) : ko.toJS(mapKeys(qsParams[guid] || {}, function (prop) {
        return cache[guid] && cache[guid][prop] ? isUndefined(qsParams[guid][prop]) ? undefined : cache[guid][prop].parser(qsParams[guid][prop]) : qsParams[guid][prop];
      }));
    }
  }, {
    key: 'setDefaults',
    value: function setDefaults(q) {
      var parser = arguments.length <= 1 || arguments[1] === undefined ? identity : arguments[1];

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

      if (deepEquals(qsParams[guid], query)) {
        return;
      }

      merge(qsParams, _defineProperty({}, guid, query), false);
      trigger(!trigger());
    }
  }, {
    key: 'updateFromString',
    value: function updateFromString(str, pathname) {
      if (pathname) {
        var guid = this.ctx.config.depth + pathname;
        merge(qsParams, _defineProperty({}, guid, qs.parse(str)[guid]), false);
      } else {
        merge(qsParams, qs.parse(str), false);
      }
      trigger(!trigger());
    }
  }, {
    key: 'getNonDefaultParams',
    value: function getNonDefaultParams(query, pathname) {
      var nonDefaultParams = {};
      var workingParams = qsParams;

      if (query) {
        merge(workingParams, _defineProperty({}, this.ctx.config.depth + pathname, query), false);
      }

      for (var id in workingParams) {
        if (!cache[id]) {
          nonDefaultParams[id] = workingParams[id];
        } else {
          nonDefaultParams[id] = {};
          for (var pn in workingParams[id]) {
            var p = workingParams[id][pn];
            var d = cache[id][pn].defaultVal;
            if (!isUndefined(p) && !deepEquals(p, d)) {
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
      return qs.stringify(this.getNonDefaultParams(query, pathname));
    }
  }]);

  return Query;
}();

module.exports = {
  factory: function factory(ctx) {
    return new Query(ctx);
  }
};