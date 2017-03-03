import * as ko from 'knockout';
import Router from './router';
import './binding';
ko.components.register('ko-component-router', {
    synchronous: true,
    viewModel: Router,
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
export default Router;
//# sourceMappingURL=index.js.map