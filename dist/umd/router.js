(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "knockout", "./context", "./route", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var knockout_1 = require("knockout");
    var context_1 = require("./context");
    var route_1 = require("./route");
    var utils_1 = require("./utils");
    var events = {
        click: document.ontouchstart ? 'touchstart' : 'click',
        popstate: 'popstate'
    };
    var onInit = [];
    var routers = [];
    var Router = (function () {
        function Router() {
            var _this = this;
            this.component = knockout_1.default.observable(null);
            this.isNavigating = knockout_1.default.observable(true);
            Router.link(this);
            if (this.isRoot) {
                this.routes = Router.createRoutes(Router.routes);
                document.addEventListener(events.click, Router.onclick);
                window.addEventListener(events.popstate, Router.onpopstate);
            }
            else if (this.$parent.ctx.route.children) {
                this.routes = this.$parent.ctx.route.children;
            }
            this.update(this.getPathFromLocation(), false).then(function () { return onInit.forEach(function (r) { return r(_this); }); });
        }
        Object.defineProperty(Router.prototype, "base", {
            get: function () {
                return this.isRoot
                    ? Router.config.base + (Router.config.hashbang ? '/#!' : '')
                    : this.$parent.base + this.$parent.ctx.pathname;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "$root", {
            get: function () {
                return routers[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "$parent", {
            get: function () {
                return routers[this.depth - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "$parents", {
            get: function () {
                return routers.slice(0, this.depth).reverse();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "$child", {
            get: function () {
                return routers[this.depth + 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "$children", {
            get: function () {
                return routers.slice(this.depth + 1);
            },
            enumerable: true,
            configurable: true
        });
        Router.prototype.update = function (url, _args) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var fromCtx, args, _a, search, hash, path, route, _b, params, pathname, childPath, shouldNavigate, toCtx, fromCtxChildren, _i, fromCtxChildren_1, fromCtxChild;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            fromCtx = this.ctx;
                            if (utils_1.isBool(args)) {
                                args = { push: _args };
                            }
                            else if (utils_1.isUndefined(args)) {
                                args = {};
                            }
                            if (utils_1.isUndefined(args.push)) {
                                args.push = true;
                            }
                            if (utils_1.isUndefined(args.with)) {
                                args.with = {};
                            }
                            _a = Router.parseUrl(url), search = _a.search, hash = _a.hash;
                            path = Router.getPath(url);
                            route = this.resolveRoute(path);
                            if (!route) {
                                return [2 /*return*/, false];
                            }
                            _b = route.parse(path), params = _b[0], pathname = _b[1], childPath = _b[2];
                            if (!(fromCtx && fromCtx.pathname === pathname && !args.force)) return [3 /*break*/, 3];
                            if (!this.$child) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.$child.update(childPath + search + hash, args)];
                        case 1: return [2 /*return*/, _c.sent()];
                        case 2: return [2 /*return*/, false];
                        case 3:
                            if (!fromCtx) return [3 /*break*/, 5];
                            return [4 /*yield*/, fromCtx.runBeforeNavigateCallbacks()];
                        case 4:
                            shouldNavigate = _c.sent();
                            if (shouldNavigate === false) {
                                return [2 /*return*/, false];
                            }
                            this.isNavigating(true);
                            _c.label = 5;
                        case 5:
                            history[args.push ? 'pushState' : 'replaceState'](history.state, document.title, this.base + path + search + hash);
                            toCtx = new context_1.default(Object.assign({}, args.with, this.passthrough, {
                                router: this,
                                params: params,
                                route: route,
                                path: path,
                                pathname: pathname
                            }));
                            if (!fromCtx) return [3 /*break*/, 7];
                            return [4 /*yield*/, fromCtx.runBeforeDispose()];
                        case 6:
                            _c.sent();
                            _c.label = 7;
                        case 7:
                            fromCtxChildren = fromCtx && fromCtx.$children.reverse();
                            return [4 /*yield*/, toCtx.runBeforeRender()];
                        case 8:
                            _c.sent();
                            this.ctx = toCtx;
                            this.component(null);
                            knockout_1.default.tasks.runEarly();
                            this.component(this.ctx.route.component);
                            knockout_1.default.tasks.runEarly();
                            if (!fromCtx) return [3 /*break*/, 14];
                            _i = 0, fromCtxChildren_1 = fromCtxChildren;
                            _c.label = 9;
                        case 9:
                            if (!(_i < fromCtxChildren_1.length)) return [3 /*break*/, 12];
                            fromCtxChild = fromCtxChildren_1[_i];
                            return [4 /*yield*/, fromCtxChild.runAfterDispose()];
                        case 10:
                            _c.sent();
                            _c.label = 11;
                        case 11:
                            _i++;
                            return [3 /*break*/, 9];
                        case 12: return [4 /*yield*/, fromCtx.runAfterDispose()];
                        case 13:
                            _c.sent();
                            _c.label = 14;
                        case 14: return [4 /*yield*/, toCtx.runAfterRender()];
                        case 15:
                            _c.sent();
                            this.isNavigating(false);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Router.prototype.resolveRoute = function (path) {
            var matchingRouteWithFewestDynamicSegments;
            var fewestMatchingSegments = Infinity;
            for (var rn in this.routes) {
                var r = this.routes[rn];
                if (r.matches(path)) {
                    if (r.keys.length === 0) {
                        return r;
                    }
                    else if (fewestMatchingSegments === Infinity ||
                        (r.keys.length < fewestMatchingSegments && r.keys[0].pattern !== '.*')) {
                        fewestMatchingSegments = r.keys.length;
                        matchingRouteWithFewestDynamicSegments = r;
                    }
                }
            }
            return matchingRouteWithFewestDynamicSegments;
        };
        Router.prototype.getPathFromLocation = function () {
            var path = location.pathname + location.search + location.hash;
            var baseWithOrWithoutHashbangRegexp = this.base.replace('#!', '#?!?');
            return path.replace(new RegExp(baseWithOrWithoutHashbangRegexp, 'i'), '');
        };
        Router.prototype.dispose = function () {
            var _this = this;
            Router.unlink();
            if (this.isRoot) {
                document.removeEventListener(events.click, Router.onclick, false);
                window.removeEventListener(events.popstate, Router.onpopstate, false);
                this.ctx.runBeforeDispose().then(function () { return _this.ctx.runAfterDispose(); });
            }
        };
        Router.setConfig = function (_a) {
            var base = _a.base, hashbang = _a.hashbang, activePathCSSClass = _a.activePathCSSClass;
            if (base) {
                Router.config.base = base;
            }
            if (hashbang) {
                Router.config.hashbang = hashbang;
            }
            if (activePathCSSClass) {
                Router.config.activePathCSSClass = activePathCSSClass;
            }
        };
        Router.use = function () {
            var fns = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fns[_i] = arguments[_i];
            }
            (_a = Router.middleware).push.apply(_a, fns);
            var _a;
        };
        Router.usePlugin = function () {
            var fns = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fns[_i] = arguments[_i];
            }
            (_a = Router.plugins).push.apply(_a, fns);
            var _a;
        };
        Router.useRoutes = function (routes) {
            Object.assign(Router.routes, routes);
        };
        Router.get = function (i) {
            return routers[i];
        };
        Object.defineProperty(Router, "head", {
            get: function () {
                return routers[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router, "tail", {
            get: function () {
                return routers[routers.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router, "initialized", {
            get: function () {
                if (routers.length === 0) {
                    return new Promise(function (resolve) { return onInit.push(resolve); });
                }
                else {
                    return Promise.resolve(Router.head);
                }
            },
            enumerable: true,
            configurable: true
        });
        Router.update = function (url, _args) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, routers[0].update(url, _args)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        Router.link = function (router) {
            router.depth = routers.length;
            router.isRoot = router.depth === 0;
            routers.push(router);
        };
        Router.unlink = function () {
            routers.pop();
        };
        Router.onclick = function (e) {
            if (e.defaultPrevented) {
                return;
            }
            var el = e.target;
            while (el && el.nodeName !== 'A') {
                el = el.parentNode;
            }
            if (!el || el.nodeName !== 'A') {
                return;
            }
            var pathname = el.pathname, search = el.search, _a = el.hash, hash = _a === void 0 ? '' : _a;
            var path = (pathname + search + hash).replace(new RegExp(routers[0].base, 'i'), '');
            var isValidRoute = Router.hasRoute(path);
            var isCrossOrigin = !Router.sameOrigin(el.href);
            var isDoubleClick = Router.which(e) !== 1;
            var isDownload = el.hasAttribute('download');
            var isEmptyHash = el.getAttribute('href') === '#';
            var isMailto = (el.getAttribute('href') || '').indexOf('mailto:') === 0;
            var hasExternalRel = el.getAttribute('rel') === 'external';
            var hasModifier = e.metaKey || e.ctrlKey || e.shiftKey;
            var hasOtherTarget = el.hasAttribute('target');
            if (!isValidRoute ||
                isCrossOrigin ||
                isDoubleClick ||
                isDownload ||
                isEmptyHash ||
                isMailto ||
                hasExternalRel ||
                hasModifier ||
                hasOtherTarget) {
                return;
            }
            Router.update(path);
            e.preventDefault();
        };
        Router.onpopstate = function (e) {
            Router.update(routers[0].getPathFromLocation(), false);
            e.preventDefault();
        };
        Router.canonicalizePath = function (path) {
            return path.replace(new RegExp('/?#?!?/?'), '/');
        };
        Router.parseUrl = function (url) {
            var parser = document.createElement('a');
            var b = routers[0].base.toLowerCase();
            if (b && url.toLowerCase().indexOf(b) === 0) {
                url = url.replace(new RegExp(b, 'i'), '') || '/';
            }
            parser.href = Router.canonicalizePath(url);
            return {
                hash: parser.hash,
                pathname: (parser.pathname.charAt(0) === '/')
                    ? parser.pathname
                    : '/' + parser.pathname,
                search: parser.search
            };
        };
        Router.getPath = function (url) {
            return Router.parseUrl(url).pathname;
        };
        Router.hasRoute = function (path) {
            return !utils_1.isUndefined(Router.head.resolveRoute(Router.getPath(path)));
        };
        Router.createRoutes = function (config) {
            return Object.entries(Router.routes).map(function (_a) {
                var r = _a[0], c = _a[1];
                return new route_1.default(r, Router.runPlugins(c));
            });
        };
        Router.runPlugins = function (config) {
            return utils_1.flatMap(utils_1.isArray(config) ? config : [config], function (m) {
                var middleware = Router.plugins.reduce(function (ms, p) {
                    var _m = p(m);
                    return _m ? ms.concat(utils_1.isArray(_m) ? _m : [_m]) : ms;
                }, []);
                return middleware.length > 0
                    ? middleware
                    : m;
            });
        };
        Router.sameOrigin = function (href) {
            var hostname = location.hostname, port = location.port, protocol = location.protocol;
            var origin = protocol + '//' + hostname;
            if (port) {
                origin += ':' + port;
            }
            return href && href.indexOf(origin) === 0;
        };
        Router.which = function (e) {
            e = e || window.event;
            return e.which === null ? e.button : e.which;
        };
        return Router;
    }());
    Router.config = {
        base: '',
        hashbang: false,
        activePathCSSClass: 'active-path'
    };
    exports.default = Router;
});
//# sourceMappingURL=router.js.map