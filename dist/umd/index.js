(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "knockout", "./router", "./binding", "./context", "./route"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var knockout_1 = require("knockout");
    var router_1 = require("./router");
    require("./binding");
    knockout_1.default.components.register('ko-component-router', {
        synchronous: true,
        viewModel: router_1.default,
        template: "<div data-bind=\"if: component\">\n      <div class=\"ko-component-router-view\" data-bind=\"__ko_component_router__\"></div>\n    </div>"
    });
    knockout_1.default.bindingHandlers['__ko_component_router__'] = {
        init: function (el, valueAccessor, allBindings, viewModel, bindingCtx) {
            var $router = bindingCtx.$rawData;
            knockout_1.default.applyBindingsToNode(el, {
                css: $router.component,
                component: {
                    name: $router.component,
                    params: $router.ctx
                }
            }, bindingCtx.extend({ $router: $router }));
            return { controlsDescendantBindings: true };
        }
    };
    exports.default = router_1.default;
    var context_1 = require("./context");
    exports.Context = context_1.default;
    var route_1 = require("./route");
    exports.Route = route_1.default;
});
//# sourceMappingURL=index.js.map