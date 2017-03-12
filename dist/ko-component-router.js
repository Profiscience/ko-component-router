(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('knockout')) :
	typeof define === 'function' && define.amd ? define(['exports', 'knockout'], factory) :
	(factory((global.ko = global.ko || {}, global.ko.router = global.ko.router || {}),global.ko));
}(this, (function (exports,ko) { 'use strict';

ko = 'default' in ko ? ko['default'] : ko;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */













function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var index$1 = function isObject(val) {
  return val != null && typeof val === 'object'
    && !Array.isArray(val);
};

var isObject = index$1;

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

var index = function isPlainObject(o) {
  var ctor,prot;
  
  if (isObjectObject(o) === false) return false;
  
  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;
  
  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;
  
  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }
  
  // Most likely a plain Object
  return true;
};

function isArray(arr) {
    return typeof arr.splice === 'function';
}
function isBool(x) {
    return typeof x === 'boolean';
}
function isString(x) {
    return typeof x === 'string';
}
function isFunction(x) {
    return typeof x === 'function';
}
function isUndefined(x) {
    return typeof x === 'undefined';
}
function flatMap(arr, fn) {
    return arr.reduce(function (flattened, x) {
        var v = fn(x);
        return flattened.concat(isArray(v) ? v : [v]);
    }, []);
}
function runMiddleware(middleware) {
    var _this = this;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var downstream = [];
    var callbacks = middleware.map(function (fn) {
        var runner = generatorify(fn).apply(void 0, args);
        var run = function () { return __awaiter(_this, void 0, void 0, function () {
            var ret, _a;
            return __generator(this, function (_b) {
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
function sequence(callbacks) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var _i, callbacks_1, _fn;
        return __generator(this, function (_a) {
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
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b, _c, _d, _e;
                        return __generator(this, function (_f) {
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
        return __awaiter(_this, void 0, void 0, function () {
            var fn, ret, _a;
            return __generator(this, function (_b) {
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
            return isUndefined(this.router.$child)
                ? undefined
                : this.router.$child.ctx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "$children", {
        get: function () {
            return this.router.$children.filter(function (r) { return !isUndefined(r.ctx); }).map(function (r) { return r.ctx; });
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
        return __awaiter(this, void 0, void 0, function () {
            var ctx, callbacks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = this;
                        callbacks = [];
                        while (ctx) {
                            callbacks = ctx._beforeNavigateCallbacks.concat(callbacks);
                            ctx = ctx.$child;
                        }
                        return [4 /*yield*/, sequence(callbacks)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Context.prototype.queue = function (promise) {
        this._queue.push(promise);
    };
    Context.prototype.flushQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _a, appBeforeRender, appDownstream, _b, routeBeforeRender, routeDownstream;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = runMiddleware(Router$1.middleware, this), appBeforeRender = _a[0], appDownstream = _a[1];
                        this._afterRenderCallbacks.push(appDownstream);
                        this._beforeDisposeCallbacks.push(appDownstream);
                        this._afterDisposeCallbacks.push(appDownstream);
                        return [4 /*yield*/, appBeforeRender];
                    case 1:
                        _c.sent();
                        _b = runMiddleware(this.route.middleware, this), routeBeforeRender = _b[0], routeDownstream = _b[1];
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sequence(this._afterRenderCallbacks)];
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.$child) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.$child.runBeforeDispose()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, sequence(this._beforeDisposeCallbacks)];
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sequence(this._afterDisposeCallbacks)];
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

var index$4 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

var isarray = index$4;

/**
 * Expose `pathToRegexp`.
 */
var index$3 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

index$3.parse = parse_1;
index$3.compile = compile_1;
index$3.tokensToFunction = tokensToFunction_1;
index$3.tokensToRegExp = tokensToRegExp_1;

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
            else if (index(m)) {
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
        var regexp = index$3(path, keys);
        return [keys, regexp];
    };
    return Route;
}());

var events = {
    click: document.ontouchstart ? 'touchstart' : 'click',
    popstate: 'popstate'
};
var onInit = [];
var routers = [];
var Router$1 = (function () {
    function Router() {
        var _this = this;
        this.component = ko.observable(null);
        this.isNavigating = ko.observable(true);
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
        return __awaiter(this, void 0, void 0, function () {
            var fromCtx, args, _a, search, hash, path, route, _b, params, pathname, childPath, shouldNavigate, toCtx, fromCtxChildren, _i, fromCtxChildren_1, fromCtxChild;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fromCtx = this.ctx;
                        if (isBool(_args)) {
                            args = { push: _args };
                        }
                        else if (isUndefined(_args)) {
                            args = {};
                        }
                        else {
                            args = _args;
                        }
                        if (isUndefined(args.push)) {
                            args.push = true;
                        }
                        if (isUndefined(args.with)) {
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
                        toCtx = new Context(Object.assign({}, args.with, {
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
                        ko.tasks.runEarly();
                        this.component(this.ctx.route.component);
                        ko.tasks.runEarly();
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return !isUndefined(Router.head.resolveRoute(Router.getPath(path)));
    };
    Router.createRoutes = function (config) {
        return Object.entries(Router.routes).map(function (_a) {
            var r = _a[0], c = _a[1];
            return new Route(r, Router.runPlugins(c));
        });
    };
    Router.runPlugins = function (config) {
        return flatMap(isArray(config) ? config : [config], function (m) {
            var middleware = Router.plugins.reduce(function (ms, p) {
                var _m = p(m);
                return _m ? ms.concat(isArray(_m) ? _m : [_m]) : ms;
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
Router$1.middleware = [];
Router$1.plugins = [];
Router$1.routes = {};
Router$1.config = {
    base: '',
    hashbang: false,
    activePathCSSClass: 'active-path'
};

ko.bindingHandlers['path'] = {
    init: function (el, valueAccessor, allBindings, viewModel, bindingCtx) {
        var activePathCSSClass = allBindings.get('pathActiveClass') || Router$1.config.activePathCSSClass;
        Router$1.initialized.then(function () {
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
function resolveHref(bindingCtx, _path) {
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
    return Router$1.get(0);
}

ko.components.register('ko-component-router', {
    synchronous: true,
    viewModel: Router$1,
    template: "<div data-bind=\"if: component\">\n      <div class=\"ko-component-router-view\" data-bind=\"__ko_component_router__\"></div>\n    </div>"
});
ko.bindingHandlers['__ko_component_router__'] = {
    init: function (el, valueAccessor, allBindings, viewModel, bindingCtx) {
        var $router = bindingCtx.$rawData;
        ko.applyBindingsToNode(el, {
            css: $router.component,
            component: {
                name: $router.component,
                params: $router.ctx
            }
        }, bindingCtx.extend({ $router: $router }));
        return { controlsDescendantBindings: true };
    }
};

exports['default'] = Router$1;
exports.Context = Context;
exports.Route = Route;

Object.defineProperty(exports, '__esModule', { value: true });

})));
