'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.factory = factory;

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function factory(ctx) {
  var trigger = _knockout2.default.observable(false);

  var state = _knockout2.default.pureComputed({
    read: function read() {
      trigger();
      return history.state ? history.state[ctx.config.depth + ctx.pathname()] : {};
    },
    write: function write(v) {
      if (v) {
        var s = history.state || {};
        var key = ctx.config.depth + ctx.pathname();

        if (!(0, _utils.deepEquals)(v, history.state ? history.state[ctx.config.depth + ctx.pathname()] : {})) {
          if (s[key]) {
            delete s[key];
          }
          s[key] = v;
          history.replaceState(s, document.title);
          trigger(!trigger());
        }
      }
    }
  });

  var _dispose = state.dispose;

  state.reload = function () {
    var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var guid = arguments.length <= 1 || arguments[1] === undefined ? ctx.config.depth + ctx.pathname() : arguments[1];

    if (!ctx.config.persistState || force) {
      if (history.state && history.state[guid]) {
        var newState = history.state;
        delete newState[guid];
      }
    }
  };

  state.dispose = function () {
    for (var guid in history.state) {
      if (guid.indexOf(ctx.config.depth) === 0) {
        state.reload(true, guid);
      }
    }
    _dispose.apply(state, arguments);
  };

  return state;
}