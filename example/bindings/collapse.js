import $ from 'jquery'
import ko from 'knockout'

const COLLAPSE_DURATION = 400

ko.bindingHandlers.collapsed = {
  init(el, valueAccessor, allBindings, viewModel, ctx) {
    const collapsed = valueAccessor()
    const initClosed = collapsed()
    let initalized = false

    const innerCtx = ctx.createChildContext().extend({
      $collapsed: collapsed
    })

    if (initClosed) {
      const maxHeight = $(el).css('max-height')
      const overflow = $(el).css('overflow')
      const padding = $(el).css('padding')
      const border = $(el).css('border')

      $(el)
        .css('padding', '0')
        .css('border', 'none')
        .css('max-height', '0')
        .css('overflow', 'hidden')

      const killMe = collapsed.subscribe((v) => {
        if (v) return
        $(el)
          .css('max-height', maxHeight)
          .css('overflow', overflow)
          .css('padding', padding)
          .css('border', border)

        killMe.dispose()
      })
    }

    ko.applyBindingsToDescendants(innerCtx, el)

    ko.computed(() => {
      const isCollapsed = ko.unwrap(valueAccessor())

      if (!initalized) {
        initalized = true
        if (!isCollapsed) return
      }

      $(el)
        .velocity(isCollapsed ? 'slideUp' : 'slideDown', {
          duration: COLLAPSE_DURATION,
          easing: 'easeInOutSine'
        })


    }, null, { disposeWhenNodeIsRemoved: el })

    return { controlsDescendantBindings: true }
  }
}
