import { RouteMap, Middleware } from './router';
export declare type RouteConfig = string | RouteMap | Middleware;
export default class Route {
    path: string;
    component: string;
    middleware: Array<Middleware>;
    children: Array<Route>;
    keys: any;
    private regexp;
    constructor(path: string, config: RouteConfig | Array<RouteConfig>);
    matches(path: any): boolean;
    parse(path: any): [Object, string, string];
    static parseConfig(config: any): [string, Array<Middleware>, Array<Route>];
    static parsePath(path: any, hasChildren: any): any[];
}
