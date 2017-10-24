import './binding'
import './component'

export { Context } from './context'
export { Route, RouteConfig } from './route'
export { Router, RouteMap, Middleware, Plugin } from './router'
export { isActivePath, resolveHref } from './utils'

/**
 * IContext exists for the sole purpose that classes do not support declaration
 * merging.
 *
 * See https://github.com/Microsoft/TypeScript/issues/9532 for why this is here, and
 * not ./context.ts where it belongs...
 *
 * tl;dr, re-exported interfaces can't be declared w/ the top level name, so
 * to augment (declaration merging) IContext in consumer code, you'd need to do...
 *
 * declare module "ko-component-router/dist/typings/context" {
 *   // ...
 * }
 *
 * and IMO that's just bad; at least way worse than this.
 */
export interface IContext {} // tslint:disable-line no-empty-interface
