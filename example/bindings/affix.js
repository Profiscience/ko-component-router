import $ from 'jquery'
import ko from 'knockout'

ko.bindingHandlers.affix = {
  init(el) {
    let isAffixed = false

    $(window).on('scroll', () => {
      if ($(window).scrollTop() + 15 >= $(el.parentElement).offset().top) {
        if (!isAffixed) {
          $(el).addClass('affix')
          isAffixed = true
        }
      } else if (isAffixed) {
        $(el).removeClass('affix')
        isAffixed = false
      }
    })
  }
}
