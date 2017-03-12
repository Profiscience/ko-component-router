(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tape"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tape_1 = require("tape");
    var io = window.io;
    var tap = tape_1.default.createStream();
    var socket = io();
    tap.on('data', function (m) {
        socket.emit('tap', m);
    });
    tap.on('end', function (m) {
        console.log('hit');
        socket.emit('end', m);
    });
});
//# sourceMappingURL=tape-browser-reporter.js.map