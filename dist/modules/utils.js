import * as tslib_1 from "tslib";
export { default as isPlainObject } from 'is-plain-object';
export function isArray(arr) {
    return typeof arr.splice === 'function';
}
export function isBool(x) {
    return typeof x === 'boolean';
}
export function isString(x) {
    return typeof x === 'string';
}
export function isFunction(x) {
    return typeof x === 'function';
}
export function isUndefined(x) {
    return typeof x === 'undefined';
}
export function flatMap(arr, fn) {
    return arr.reduce(function (flattened, x) {
        var v = fn(x);
        return flattened.concat(isArray(v) ? v : [v]);
    }, []);
}
export function runMiddleware(middleware) {
    var _this = this;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var downstream = [];
    var callbacks = middleware.map(function (fn) {
        var runner = generatorify(fn).apply(void 0, args);
        var run = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var ret, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ret = runner.next();
                        if (!isThenable(ret)) return [3 /*break*/, 2];
                        return [4 /*yield*/, ret];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = ret.value;
                        _b.label = 3;
                    case 3:
                        ret = _a;
                        return [2 /*return*/, ret || true];
                }
            });
        }); };
        downstream.push(run);
        return run;
    });
    return [
        sequence.apply(void 0, [callbacks].concat(args)),
        function () { return sequence.apply(void 0, [callbacks].concat(args)); }
    ];
}
export function sequence(callbacks) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _i, callbacks_1, _fn;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, callbacks_1 = callbacks;
                    _a.label = 1;
                case 1:
                    if (!(_i < callbacks_1.length)) return [3 /*break*/, 4];
                    _fn = callbacks_1[_i];
                    return [4 /*yield*/, promisify(_fn).apply(void 0, args)];
                case 2:
                    if ((_a.sent()) === false) {
                        return [2 /*return*/, false];
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function isGenerator(x) {
    return x.constructor.name === 'GeneratorFunction';
}
function isThenable(x) {
    return !isUndefined(x) && isFunction(x.then);
}
// ts why u no haz generators?? babel why ur generators so $$$?????
function generatorify(fn) {
    return isGenerator(fn)
        ? fn
        : function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var count = 1, ret;
            return {
                next: function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var _a, _b, _c, _d, _e;
                        return tslib_1.__generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    _a = count++;
                                    switch (_a) {
                                        case 1: return [3 /*break*/, 1];
                                        case 2: return [3 /*break*/, 6];
                                        case 3: return [3 /*break*/, 9];
                                        case 4: return [3 /*break*/, 12];
                                    }
                                    return [3 /*break*/, 15];
                                case 1: return [4 /*yield*/, promisify(fn).apply(void 0, args)];
                                case 2:
                                    ret = (_f.sent()) || false;
                                    if (!(ret && ret.beforeRender)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, promisify(ret.beforeRender)()];
                                case 3:
                                    _b = _f.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    _b = ret;
                                    _f.label = 5;
                                case 5: return [2 /*return*/, _b];
                                case 6:
                                    _c = ret;
                                    if (!_c) return [3 /*break*/, 8];
                                    return [4 /*yield*/, promisify(ret.afterRender)()];
                                case 7:
                                    _c = (_f.sent());
                                    _f.label = 8;
                                case 8: return [2 /*return*/, _c];
                                case 9:
                                    _d = ret;
                                    if (!_d) return [3 /*break*/, 11];
                                    return [4 /*yield*/, promisify(ret.beforeDispose)()];
                                case 10:
                                    _d = (_f.sent());
                                    _f.label = 11;
                                case 11: return [2 /*return*/, _d];
                                case 12:
                                    _e = ret;
                                    if (!_e) return [3 /*break*/, 14];
                                    return [4 /*yield*/, promisify(ret.afterDispose)()];
                                case 13:
                                    _e = (_f.sent());
                                    _f.label = 14;
                                case 14: return [2 /*return*/, _e];
                                case 15: return [2 /*return*/];
                            }
                        });
                    });
                }
            };
        };
}
// function generatorify(fn) {
//   return isGenerator(fn)
//     ? fn
//     : async function * (...args) {
//         const ret = await promisify(fn)(...args)
//
//         if (isPlainObject(ret)) {
//           yield await promisify(ret.beforeRender)()
//           yield await promisify(ret.afterRender)()
//           yield await promisify(ret.beforeDispose)()
//           yield await promisify(ret.afterDispose)()
//         } else {
//           yield ret
//         }
//       }
// }
function promisify(_fn) {
    var _this = this;
    if (_fn === void 0) { _fn = noop; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fn, ret, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fn = function () {
                            return _fn.length === args.length + 1
                                ? new Promise(function (r) {
                                    _fn.apply(void 0, args.concat([r]));
                                })
                                : _fn.apply(void 0, args);
                        };
                        ret = fn();
                        if (!isThenable(ret)) return [3 /*break*/, 2];
                        return [4 /*yield*/, ret];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = ret;
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
}
function noop() {
    // do nothing
}
//# sourceMappingURL=utils.js.map