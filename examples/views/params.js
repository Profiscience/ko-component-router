'use strict'

const ko = require('knockout')

class Params {
  constructor(ctx) {
    this.params = ctx.params
  }
}

ko.components.register('params', {
  viewModel: Params,
  template: `
    <h3>Params</h3>
    <strong>foo:</strong> <input type="text" data-bind="value: params.foo"></em>
    <br>
    <strong>bar:</strong> <input type="text" data-bind="value: params.bar"></em>
  `
})
