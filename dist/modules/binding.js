import ko from 'knockout';
import Router from './router';
import { isUndefined } from './utils';
ko.bindingHandlers['path'] = {
    init: function (el, valueAccessor, allBindings, viewModel, bindingCtx) {
        var activePathCSSClass = allBindings.get('pathActiveClass') || Router.config.activePathCSSClass;
        Router.initialized.then(function () {
            // allow adjacent routers to initialize
            ko.tasks.schedule(function () {
                return ko.applyBindingsToNode(el, {
                    attr: {
                        href: ko.pureComputed(function () { return resolveHref(bindingCtx, ko.unwrap(valueAccessor())); })
                    },
                    css: (_a = {},
                        _a[activePathCSSClass] = ko.pureComputed(function () { return isActivePath(bindingCtx, ko.unwrap(valueAccessor())); }),
                        _a)
                });
                var _a;
            });
        });
    }
};
export function resolveHref(bindingCtx, _path) {
    var _a = parsePathBinding(bindingCtx, _path), router = _a[0], path = _a[1];
    return router.base + path;
}
function isActivePath(bindingCtx, _path) {
    var _a = parsePathBinding(bindingCtx, _path), router = _a[0], path = _a[1];
    return !router.isNavigating() && (router.ctx.pathname || '/') === ('/' + path.split('/')[1]);
}
function parsePathBinding(bindingCtx, path) {
    var router = getRouter(bindingCtx);
    if (path.indexOf('//') === 0) {
        path = path.replace('//', '/');
        while (!router.isRoot) {
            router = router.$parent;
        }
    }
    else {
        if (path.indexOf('./') === 0) {
            path = path.replace('./', '/');
            router = router.$child;
        }
        while (path && path.match(/\/?\.\./i) && !router.isRoot) {
            router = router.$parent;
            path = path.replace(/\/?\.\./i, '');
        }
    }
    return [router, path];
}
function getRouter(bindingCtx) {
    while (!isUndefined(bindingCtx)) {
        if (!isUndefined(bindingCtx.$router)) {
            return bindingCtx.$router;
        }
        bindingCtx = bindingCtx.$parentContext;
    }
    return Router.get(0);
}
//# sourceMappingURL=binding.js.map