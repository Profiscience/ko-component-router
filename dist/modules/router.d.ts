import Context from './context';
import Route, { RouteConfig } from './route';
export interface Middleware {
    (ctx: Context, done?: () => any): {
        beforeRender?: (done?: () => any) => Promise<any>;
        afterRender?: (done?: () => any) => Promise<any>;
        beforeDispose?: (done?: () => any) => Promise<any>;
        afterDispose?: (done?: () => any) => Promise<any>;
    };
}
export interface Plugin {
    (routeConfig: any): RouteMap;
}
export interface RouteMap {
    [name: string]: RouteConfig | Array<RouteConfig>;
}
declare class Router {
    static config: {
        base?: string;
        hashbang?: boolean;
        activePathCSSClass?: string;
    };
    static middleware: Array<Middleware>;
    static plugins: Array<Plugin>;
    static routes: RouteMap;
    component: KnockoutObservable<string>;
    isNavigating: KnockoutObservable<boolean>;
    routes: Array<Route>;
    isRoot: boolean;
    passthrough: Object;
    depth: number;
    ctx: Context;
    constructor();
    readonly base: string;
    readonly $root: Router;
    readonly $parent: Router;
    readonly $parents: Array<Router>;
    readonly $child: Router;
    readonly $children: Array<Router>;
    update(url: string, _args?: boolean | {
        push?: boolean;
        force?: boolean;
        with?: Object;
    }): Promise<boolean>;
    private resolveRoute(path);
    private getPathFromLocation();
    dispose(): void;
    static setConfig({base, hashbang, activePathCSSClass}: {
        base?: string;
        hashbang?: boolean;
        activePathCSSClass?: string;
    }): void;
    static use(...fns: Array<Middleware>): void;
    static usePlugin(...fns: Array<Plugin>): void;
    static useRoutes(routes: {
        [route: string]: any;
    }): void;
    static get(i: number): Router;
    static readonly head: Router;
    static readonly tail: Router;
    static readonly initialized: Promise<Router>;
    static update(url: string, _args?: boolean | {
        push?: boolean;
        force?: boolean;
        with?: Object;
    }): Promise<boolean>;
    private static link(router);
    private static unlink();
    private static onclick(e);
    private static onpopstate(e);
    private static canonicalizePath(path);
    private static parseUrl(url);
    private static getPath(url);
    private static hasRoute(path);
    private static createRoutes(config);
    private static runPlugins(config);
    private static sameOrigin(href);
    private static which(e);
}
export default Router;
