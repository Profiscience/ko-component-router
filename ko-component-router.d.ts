interface KoComponentRouterRoute {
    component: string;
}

type CallbackResult = void | false | Promise<boolean>;
type DoneCallback = (boolean) => void;

type KoComponentRouterPromiseMiddleware = (ctx: KoComponentRouterContext) => CallbackResult;
type KoComponentRouterCallbackMiddleware = (ctx: KoComponentRouterContext, done: DoneCallback) => void;
type KoComponentRouterLifecycleMiddleware = (ctx: KoComponentRouterContext) => {
    beforeRender: () => CallbackResult;
    afterRender: () => CallbackResult;
    beforeDispose: () => CallbackResult;
    afterDispose: () => CallbackResult;
};
type KoComponentRouterMiddleware = KoComponentRouterPromiseMiddleware
    | KoComponentRouterCallbackMiddleware
    | KoComponentRouterLifecycleMiddleware;

interface KoComponentRouterContext {
    $child: KoComponentRouterContext;
    $parent: KoComponentRouterContext;
    addBeforeNavigateCallback(cb: () => CallbackResult);
    addBeforeNavigateCallback(cb: (done: DoneCallback) => void);
    canonicalPath: string;
    element: HTMLElement;
    fullPath: string;
    params: any;
    path: string;
    pathname: string;
    route: KoComponentRouterRoute;
    router: KoComponentRouterInstance;
}

interface KoComponentRouterInstance {
    $child: KoComponentRouterInstance;
    $parent: KoComponentRouterInstance;
    base: string;
    ctx: KoComponentRouterContext;
    isRoot: boolean;
    isNavigating: KnockoutObservable<boolean>;

    getPathFromLocation(): string;
    resolvePath(path): any;
    update(path: string, push?: boolean): Promise<boolean>;
}

interface KoComponentRouterRoutes {
    [path: string]: string
        | KoComponentRouterRoutes
        | Array<string | KoComponentRouterPromiseMiddleware | KoComponentRouterLifecycleMiddleware>;
}

interface KoComponentRouterConfig {
    base?: string;
    hashbang?: boolean;
}

declare module 'ko-component-router' {
    class Router implements KoComponentRouterInstance {
        static config: KoComponentRouterConfig;
        static middleware: KoComponentRouterMiddleware[];
        static plugins: any[];
        static routes: KoComponentRouterRoutes;
        static head: KoComponentRouterInstance;
        static tail: KoComponentRouterInstance;

        static canonicalizePath(path: string): string;
        static get(index: number): KoComponentRouterInstance;
        static getPath(url: string): string;
        static parseUrl(url: string): { hash: string, pathname: string, search: string };
        static sameOrigin(href: string): boolean;
        static setConfig(config: KoComponentRouterConfig): void;
        static update(path: string, push?: boolean): Promise<boolean>;
        static update(path: string, options: { push?: boolean; force?: boolean; with?: any }): Promise<boolean>;
        static use(...middleware: KoComponentRouterMiddleware[]): void;
        static usePlugin(...fns): void;    
        static useRoutes(routes: KoComponentRouterRoutes): void;

        $child: KoComponentRouterInstance;
        $parent: KoComponentRouterInstance;
        base: string;
        ctx: KoComponentRouterContext;
        isRoot: boolean;
        isNavigating: KnockoutObservable<boolean>;

        constructor();
        getPathFromLocation(): string;
        resolvePath(path): any;
        update(path: string, push?: boolean): Promise<boolean>;
    }

    export = Router;
}
