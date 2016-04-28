'use strict';

var ko = require('knockout');
var router = require('./router');
require('./binding');

ko.components.register('ko-component-router', {
  synchronous: true,
  viewModel: router,
  template: '<div data-bind=\'if: ctx.route().component\'>\n      <div class="component-wrapper" data-bind=\'component: {\n        name: ctx.route().component,\n        params: ctx\n      }\'></div>\n    </div>'
});