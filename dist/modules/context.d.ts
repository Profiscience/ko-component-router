import Route from './Route';
import Router from './router';
export default class Context {
    fullPath: string;
    router: Router;
    pathname: string;
    canonicalPath: string;
    route: Route;
    private _queue;
    private _beforeNavigateCallbacks;
    private _afterRenderCallbacks;
    private _beforeDisposeCallbacks;
    private _afterDisposeCallbacks;
    constructor(params: any);
    addBeforeNavigateCallback(cb: any): void;
    readonly $parent: Context;
    readonly $parents: Array<Context>;
    readonly $child: Context;
    readonly $children: Array<Context>;
    readonly element: Element;
    runBeforeNavigateCallbacks(): Promise<boolean>;
    private queue(promise);
    private flushQueue();
    runBeforeRender(): Promise<void>;
    runAfterRender(): Promise<void>;
    runBeforeDispose(): Promise<void>;
    runAfterDispose(): Promise<void>;
}
