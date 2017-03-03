import * as tslib_1 from "tslib";
import $ from 'jquery';
import * as ko from 'knockout';
import tape from 'tape';
import './helpers/empty-template-loader';
import Router from '../src';
import './routing';
var tests = [
    'routing',
];
var Test = (function () {
    function Test() {
        this.test = ko.observable();
        $('body').append("\n      <div data-bind=\"if: test\">\n        <div id=\"test-container\" data-bind=\"component: {\n            name: test,\n            params: { t: t, next: next }\n        }\"></div>\n      </div>\n    ");
        this.runTests();
    }
    Test.prototype.runTests = function () {
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
    Test.prototype.runTest = function (test) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Router.config = { base: '', hashbang: false, activePathCSSClass: 'active-path' };
                        Router.middleware = [];
                        Router.plugins = [];
                        Router.routes = {};
                        return [4 /*yield*/, new Promise(function (resolve) {
                                return tape(test, function (t) {
                                    _this.t = test;
                                    _this.next = resolve;
                                    _this.test(test);
                                });
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Test;
}());
$(function () { return ko.applyBindings(new Test()); });
//# sourceMappingURL=index.js.map