(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "knockout", "tape", "./helpers/empty-template-loader", "./helpers/tape-browser-reporter"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var knockout_1 = require("knockout");
    var tape_1 = require("tape");
    require("./helpers/empty-template-loader");
    require("./helpers/tape-browser-reporter");
    // import './anchor'
    // import './binding'
    // import './routing'
    // import './history'
    // import './force-update'
    // import './with'
    // import './middleware'
    // import './queue'
    // import './before-navigate-callbacks'
    // import './element'
    // import './passthrough'
    // import './plugins'
    // import './issues'
    var tests = [
        'routing',
    ];
    var TestRunner = (function () {
        function TestRunner() {
            this.test = knockout_1.default.observable(null);
            this.runTests();
        }
        TestRunner.prototype.runTests = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _i, tests_1, test;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _i = 0, tests_1 = tests;
                            _a.label = 1;
                        case 1:
                            if (!(_i < tests_1.length)) return [3 /*break*/, 4];
                            test = tests_1[_i];
                            return [4 /*yield*/, this.runTest(test)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        TestRunner.prototype.runTest = function (test) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _this = this;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                return tape_1.default(test, function (t) {
                                    _this.t = t;
                                    _this.next = resolve;
                                    _this.test(test);
                                });
                            })];
                        case 1: 
                        // reset defaults
                        // Router.config = { base: '', hashbang: false, activePathCSSClass: 'active-path' }
                        // Router.middleware = []
                        // Router.plugins = []
                        // Router.routes = {}
                        return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return TestRunner;
    }());
    knockout_1.default.applyBindings(new TestRunner());
});
//# sourceMappingURL=index.js.map