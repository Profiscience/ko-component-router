import $ from 'jquery'
import 'velocity-animate'

const viewIndicies = {
  'getting-started': 1,
  'config': 2,
  'context': 3,
  'bindings': 4,
  'nested-routing': 5
}

export function inTransition(el, fromCtx, toCtx) {
  const fromComp = fromCtx.route.component
  const fromIndex = viewIndicies[fromComp]
  const toComp = toCtx.route.component
  const toIndex = viewIndicies[toComp]
  const toHash = toCtx.hash

  if (!toHash) {
    window.requestAnimationFrame(() => {
      if ($(window).scrollTop() > 100) {
        $(window).scrollTop(100)
      }
    })
  }

  if (!fromIndex) {
    $('.component-container', el)
      .velocity({ opacity: 1 }, {
        duration: 125,
        complete() {
          if (toHash) {
            $(`#${toHash}`).velocity('scroll')
          }
        }
      })
  } else {
    const translate = fromIndex > toIndex
      ? '-100px'
      : '100px'

    $('.component-container', el)
      .css('transform', `translateX(${translate})`)
      .velocity({
        translateX: '0px',
        opacity: 1
      }, {
        duration: 125,
        complete() {
          if (toHash) {
            $(`#${toHash}`).velocity('scroll')
          }
        }
      })
  }
}

export function outTransition(el, fromCtx, toCtx, done) {
  const fromComp = fromCtx.route.component
  const toComp = toCtx.route.component

  const fromIndex = viewIndicies[fromComp]
  const toIndex = viewIndicies[toComp]
  const translate = fromIndex > toIndex
    ? '100px'
    : '-100px'

  const $el = $('.component-container', el)

  if ($el.length > 0) {
    $el.velocity({
      translateX: translate,
      opacity: 0
    }, {
      easing: 'linear',
      duration: 125,
      complete: done
    })
  } else {
    done()
  }
}
