(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./router", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var router_1 = require("./router");
    var utils_1 = require("./utils");
    var Context = (function () {
        function Context(params) {
            Object.assign(this, params);
            this.fullPath = this.router.base + this.pathname;
            this.canonicalPath = this.fullPath.replace(new RegExp(this.router.$root.base, 'i'), '');
            this._queue = [];
            this._beforeNavigateCallbacks = [];
            this._afterRenderCallbacks = [];
            this._beforeDisposeCallbacks = [];
            this._afterDisposeCallbacks = [];
        }
        Context.prototype.addBeforeNavigateCallback = function (cb) {
            this._beforeNavigateCallbacks.unshift(cb);
        };
        Object.defineProperty(Context.prototype, "$parent", {
            get: function () {
                return this.router.isRoot
                    ? undefined
                    : this.router.$parent.ctx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Context.prototype, "$parents", {
            get: function () {
                return this.router.$parents.map(function (r) { return r.ctx; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Context.prototype, "$child", {
            get: function () {
                return utils_1.isUndefined(this.router.$child)
                    ? undefined
                    : this.router.$child.ctx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Context.prototype, "$children", {
            get: function () {
                return this.router.$children.filter(function (r) { return !utils_1.isUndefined(r.ctx); }).map(function (r) { return r.ctx; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Context.prototype, "element", {
            get: function () {
                return document.getElementsByClassName('ko-component-router-view')[this.router.depth];
            },
            enumerable: true,
            configurable: true
        });
        Context.prototype.runBeforeNavigateCallbacks = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var ctx, callbacks;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ctx = this;
                            callbacks = [];
                            while (ctx) {
                                callbacks = ctx._beforeNavigateCallbacks.concat(callbacks);
                                ctx = ctx.$child;
                            }
                            return [4 /*yield*/, utils_1.sequence(callbacks)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        Context.prototype.queue = function (promise) {
            this._queue.push(promise);
        };
        Context.prototype.flushQueue = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _this = this;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.all(this._queue).then(function () { return (_this._queue = []); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Context.prototype.runBeforeRender = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _a, appBeforeRender, appDownstream, _b, routeBeforeRender, routeDownstream;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = utils_1.runMiddleware(router_1.default.middleware, this), appBeforeRender = _a[0], appDownstream = _a[1];
                            this._afterRenderCallbacks.push(appDownstream);
                            this._beforeDisposeCallbacks.push(appDownstream);
                            this._afterDisposeCallbacks.push(appDownstream);
                            return [4 /*yield*/, appBeforeRender];
                        case 1:
                            _c.sent();
                            _b = utils_1.runMiddleware(this.route.middleware, this), routeBeforeRender = _b[0], routeDownstream = _b[1];
                            this._afterRenderCallbacks.push(routeDownstream);
                            this._beforeDisposeCallbacks.unshift(routeDownstream);
                            this._afterDisposeCallbacks.unshift(routeDownstream);
                            return [4 /*yield*/, routeBeforeRender];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, this.flushQueue()];
                        case 3:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Context.prototype.runAfterRender = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, utils_1.sequence(this._afterRenderCallbacks)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.flushQueue()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Context.prototype.runBeforeDispose = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.$child) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.$child.runBeforeDispose()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4 /*yield*/, utils_1.sequence(this._beforeDisposeCallbacks)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.flushQueue()];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Context.prototype.runAfterDispose = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, utils_1.sequence(this._afterDisposeCallbacks)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.flushQueue()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return Context;
    }());
    exports.default = Context;
});
//# sourceMappingURL=context.js.map