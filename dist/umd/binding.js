(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "knockout", "./router", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var knockout_1 = require("knockout");
    var router_1 = require("./router");
    var utils_1 = require("./utils");
    knockout_1.default.bindingHandlers['path'] = {
        init: function (el, valueAccessor, allBindings, viewModel, bindingCtx) {
            var activePathCSSClass = allBindings.get('pathActiveClass') || router_1.default.config.activePathCSSClass;
            router_1.default.initialized.then(function () {
                // allow adjacent routers to initialize
                knockout_1.default.tasks.schedule(function () {
                    return knockout_1.default.applyBindingsToNode(el, {
                        attr: {
                            href: knockout_1.default.pureComputed(function () { return resolveHref(bindingCtx, knockout_1.default.unwrap(valueAccessor())); })
                        },
                        css: (_a = {},
                            _a[activePathCSSClass] = knockout_1.default.pureComputed(function () { return isActivePath(bindingCtx, knockout_1.default.unwrap(valueAccessor())); }),
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
});
//# sourceMappingURL=binding.js.map