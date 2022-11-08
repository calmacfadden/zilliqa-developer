import { RPCMethod } from '../net';
import { Matcher, ReqMiddlewareFn, ResMiddlewareFn } from '../util';
declare const enum MiddlewareType {
    REQ = 0,
    RES = 1
}
export declare class BaseProvider {
    middleware: {
        request: {
            use: <I, O>(fn: ReqMiddlewareFn<I, O>, match?: Matcher) => void;
        };
        response: {
            use: <I_1, O_1, E>(fn: ResMiddlewareFn<I_1, O_1, E>, match?: Matcher) => void;
        };
    };
    protected nodeURL: string;
    protected reqMiddleware: Map<Matcher, ReqMiddlewareFn[]>;
    protected resMiddleware: Map<Matcher, ResMiddlewareFn[]>;
    constructor(nodeURL: string, reqMiddleware?: Map<Matcher, ReqMiddlewareFn[]>, resMiddleware?: Map<Matcher, ResMiddlewareFn[]>);
    /**
     * pushMiddleware
     *
     * Adds the middleware to the appropriate middleware map.
     *
     * @param {ResMiddlewareFn}
     * @param {T} type
     * @param {Matcher} match
     * @returns {void}
     */
    protected pushMiddleware<T extends MiddlewareType>(fn: T extends MiddlewareType.REQ ? ReqMiddlewareFn : ResMiddlewareFn, type: T, match: Matcher): void;
    /**
     * getMiddleware
     *
     * Returns the middleware that matches the matcher provided. Note that
     * middleware are called in order of specificity: string -> regexp ->
     * wildcard.
     *
     * @param {Matcher} match
     * @returns {[ReqMiddlewareFn[], ResMiddlewareFn[]]}
     */
    protected getMiddleware(method: RPCMethod): [ReqMiddlewareFn[], ResMiddlewareFn[]];
}
export {};
//# sourceMappingURL=base.d.ts.map