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
    interface RouterStatic extends KoComponentRouterInstance {
    }
    namespace RouterStatic {
        export var config: KoComponentRouterConfig;
        export var middleware: KoComponentRouterMiddleware[];
        export var plugins: any[];
        export var routes: KoComponentRouterRoutes;
        export const head: KoComponentRouterInstance;
        export const tail: KoComponentRouterInstance;

        export function canonicalizePath(path: string): string;
        export function get(index: number): KoComponentRouterInstance;
        export function getPath(url: string): string;
        export function parseUrl(url: string): { hash: string, pathname: string, search: string };
        export function sameOrigin(href: string): boolean;
        export function setConfig(config: KoComponentRouterConfig): void;
        export function update(path: string, push?: boolean): Promise<boolean>;
        export function update(path: string, options: { push?: boolean; force?: boolean; with?: any }): Promise<boolean>;
        export function use(...middleware: KoComponentRouterMiddleware[]): void;
        export function usePlugin(...fns): void;    
        export function useRoutes(routes: KoComponentRouterRoutes): void;
    }

    export = RouterStatic;
}
