import ko from 'knockout'

ko.bindingHandlers.async = {
  init(el, valueAccessor, bindings, viewModel, bindingCtx) {
    window.requestAnimationFrame(() => ko.applyBindingsToNode(el, valueAccessor(), bindingCtx))
    return { controlsDescendantBindings: true }
  }
}
