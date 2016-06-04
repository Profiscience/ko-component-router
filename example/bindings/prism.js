import ko from 'knockout'
import prism from 'prismjs'
import escape from 'escape-html'

ko.bindingHandlers.prism = {
  init(el, valueAccessor, allBindings) {
    el.innerHTML = (allBindings.has('noEscape') && !ko.unwrap(allBindings.get('noEscape'))
      ? escape(el.innerHTML)
      : el.innerHTML)
      .replace(/^\s+|\s+$/g, '')

    el.classList.add(`language-${valueAccessor()}`)
    prism.highlightElement(el)
  }
}
