import * as ko from 'knockout';
ko.components.loaders.unshift({
    loadComponent: function (name, config, done) {
        if (!config.template) {
            config.template = '<a></a>';
        }
        done(null);
    }
});
//# sourceMappingURL=empty-template-loader.js.map