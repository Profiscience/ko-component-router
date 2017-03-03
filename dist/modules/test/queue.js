import ko from 'knockout';
ko.components.register('queue', {
    template: '<ko-component-router params="routes: routes"></ko-component-router>',
    viewModel: (function () {
        function QueueTest(_a) {
            var t = _a.t, next = _a.next;
            var queuedPromiseResolved = false;
            this.routes = {
                '/': ['foo',
                    function (ctx) {
                        return ctx.queue(new Promise(function (resolve) {
                            setTimeout(function () {
                                queuedPromiseResolved = true;
                                resolve();
                            }, 1000);
                        }));
                    },
                    function () {
                        t.notOk(queuedPromiseResolved, 'queued promises let middleware continue');
                    }
                ]
            };
            ko.components.register('foo', {
                viewModel: function () {
                    t.ok(queuedPromiseResolved, 'queued promise resolves before component render');
                    next();
                }
            });
            history.replaceState(null, null, '/');
        }
        QueueTest.prototype.dispose = function () {
            ko.components.unregister('queue');
            ko.components.unregister('foo');
        };
        return QueueTest;
    }())
});
//# sourceMappingURL=queue.js.map