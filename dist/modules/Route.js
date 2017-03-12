import pathtoRegexp from 'path-to-regexp';
import { isFunction, isPlainObject, isString, isUndefined } from './utils';
var Route = (function () {
    function Route(path, config) {
        var _a = Route.parseConfig(config), component = _a[0], middleware = _a[1], children = _a[2];
        this.path = path;
        this.component = component;
        this.middleware = middleware;
        this.children = children;
        var _b = Route.parsePath(path, !isUndefined(children)), keys = _b[0], regexp = _b[1];
        this.keys = keys;
        this.regexp = regexp;
    }
    Route.prototype.matches = function (path) {
        var matches = this.regexp.exec(path);
        if (matches === null) {
            return false;
        }
        if (this.children) {
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var childRoute = _a[_i];
                var childPath = '/' + (matches[matches.length - 1] || '');
                if (childRoute.matches(childPath)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    };
    Route.prototype.parse = function (path) {
        var childPath;
        var params = {};
        var matches = this.regexp.exec(path);
        for (var i = 1, len = matches.length; i < len; ++i) {
            var k = this.keys[i - 1];
            var v = matches[i] || '';
            if (k.name === '__child_path__') {
                childPath = '/' + v;
            }
            else {
                params[k.name] = v;
            }
        }
        return [params, path.replace(new RegExp(childPath + '$'), ''), childPath];
    };
    Route.parseConfig = function (config) {
        var component;
        var children;
        var middleware = config
            .reduce(function (ms, m) {
            if (isString(m)) {
                m = m;
                component = m;
            }
            else if (isPlainObject(m)) {
                m = m;
                children = Object.entries(m).map(function (_a) {
                    var r = _a[0], m = _a[1];
                    return new Route(r, m);
                });
                if (!component) {
                    component = 'ko-component-router';
                }
            }
            else if (isFunction(m)) {
                m = m;
                ms.push(m);
            }
            return ms;
        }, []);
        return [component, middleware, children];
    };
    Route.parsePath = function (path, hasChildren) {
        if (hasChildren) {
            path = path.replace(/\/?!?$/, '/!');
        }
        if (path[path.length - 1] === '!') {
            path = path.replace('!', ':__child_path__(.*)?');
        }
        else {
            path = path.replace(/\(?\*\)?/, '(.*)');
        }
        var keys = [];
        var regexp = pathtoRegexp(path, keys);
        return [keys, regexp];
    };
    return Route;
}());
export default Route;
//# sourceMappingURL=Route.js.map