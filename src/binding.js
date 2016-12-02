import ko from 'knockout'

ko.bindingHandlers.path = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {
    // allow adjacent routers to initialize
    ko.tasks.schedule(() => ko.applyBindingsToNode(el, {
      attr: {
        href: resolveHref(bindingCtx, valueAccessor())
      },
      css: {
        'active-path': isActivePath(bindingCtx, valueAccessor())
      }
    }))
  }
}

export function resolveHref(bindingCtx, _path) {
  const [router, path] = parsePathBinding(bindingCtx, _path)
  return router.config.base + path
}

function isActivePath(bindingCtx, _path) {
  return localPathMatches(...parsePathBinding(bindingCtx, _path))
}

function parsePathBinding(bindingCtx, path) {
  let router = getRouter(bindingCtx)

  if (path.indexOf('//') === 0) {
    path = path.replace('//', '/')

    while (router.$parent) {
      router = router.$parent
    }
  } else {
    while (path && path.match(/\/?\.\./i) && router.$parent) {
      router = router.$parent
      path = path.replace(/\/?\.\./i, '')
    }
  }

  return [router, path]
}

function getRouter(bindingCtx) {
  while (typeof bindingCtx !== 'undefined') {
    if (typeof bindingCtx.$router !== 'undefined') {
      return bindingCtx.$router
    }

    bindingCtx = bindingCtx.$parentContext
  }
}

function localPathMatches(router, path) {
  return (router.ctx.pathname || '/') === ('/' + path.split('/')[1])
}
