'use strict';

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

require('./binding');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_knockout2.default.components.register('ko-component-router', {
  viewModel: _router2.default,
  template: '<div data-bind=\'if: ctx.route().component\'>\n      <div class="component-wrapper" data-bind=\'component: {\n        name: ctx.route().component,\n        params: ctx\n      }\'></div>\n    </div>'
});