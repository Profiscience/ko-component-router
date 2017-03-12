(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "knockout"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var knockout_1 = require("knockout");
    knockout_1.default.components.loaders.unshift({
        loadComponent: function (name, config, done) {
            if (!config.template) {
                config.template = '<a></a>';
            }
            done(null);
        }
    });
});
//# sourceMappingURL=empty-template-loader.js.map