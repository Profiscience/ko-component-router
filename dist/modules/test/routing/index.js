import * as tslib_1 from "tslib";
import ko from 'knockout';
import { extend, mapValues } from 'lodash';
import Router from '../../src';
import init from './init';
import basic from './basic';
var paths = [
    '/basic',
];
ko.components.register('routing', {
    template: '<ko-component-router params="routes: routes"></ko-component-router>',
    viewModel: (function () {
        function RoutingTestSuite(_a) {
            var t = _a.t, _next = _a.next;
            var runner = this.runTests(_next);
            var next = runner.next.bind(runner);
            this.routes = mapValues(tslib_1.__assign({}, init, basic, params, nested, similar, ambiguous), function (r) { return [
                function (ctx) { return extend(ctx, { t: t, next: next }); },
                r
            ]; });
            Router.useRoutes(mapValues(tslib_1.__assign({}, _static), function (r) { return [
                function (ctx) { return extend(ctx, { t: t, next: next }); },
                r
            ]; }));
            next();
        }
        RoutingTestSuite.prototype.async = function* () { };
        RoutingTestSuite.prototype.runTests = function (next) {
            var begin = location.href;
            yield history.pushState(null, null, '/init');
            for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                var path = paths_1[_i];
                yield Router.update(path);
            }
            history.pushState(null, null, begin);
            next();
        };
        return RoutingTestSuite;
    }())
});
//# sourceMappingURL=index.js.map