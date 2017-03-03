import ko from 'knockout';
ko.components.register('with', {
    template: '<ko-component-router params="routes: routes"></ko-component-router>',
    viewModel: (function () {
        function With(_a) {
            var t = _a.t, next = _a.next;
            this.routes = {
                '/a': 'a',
                '/b': 'b'
            };
            history.pushState(null, null, '/a');
            ko.components.register('a', {
                viewModel: function (ctx) {
                    ctx.router.update('/b', { with: { foo: 'foo' } });
                }
            });
            ko.components.register('b', {
                viewModel: function (ctx) {
                    t.equals(ctx.foo, 'foo', 'can pass data using with');
                    next();
                }
            });
        }
        With.prototype.dispose = function () {
            ko.components.unregister('with');
            ko.components.unregister('a');
            ko.components.unregister('b');
        };
        return With;
    }())
});
//# sourceMappingURL=with.js.map