"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ko = require("knockout");
var router_1 = require("./router");
var utils_1 = require("./utils");
ko.bindingHandlers['path'] = {
    init: function (el, valueAccessor, allBindings, viewModel, bindingCtx) {
        var activePathCSSClass = allBindings.get('pathActiveClass') || router_1.default.config.activePathCSSClass;
        router_1.default.initialized.then(function () {
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
function resolveHref(bindingCtx, _path) {
    var _a = parsePathBinding(bindingCtx, _path), router = _a[0], path = _a[1];
    return router.base + path;
}
exports.resolveHref = resolveHref;
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
    while (!utils_1.isUndefined(bindingCtx)) {
        if (!utils_1.isUndefined(bindingCtx.$router)) {
            return bindingCtx.$router;
        }
        bindingCtx = bindingCtx.$parentContext;
    }
    return router_1.default.get(0);
}
