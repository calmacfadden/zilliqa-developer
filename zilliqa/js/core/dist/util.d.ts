import { RPCMethod, RPCRequest, RPCResponse } from './net';
export declare type WithRequest<T, I = any> = T & {
    req: RPCRequest<I>;
};
export declare type Matcher = RPCMethod | '*' | RegExp;
export interface Middleware {
    request: {
        use: <I, O>(fn: ReqMiddlewareFn<I, O>, match?: Matcher) => void;
    };
    response: {
        use: <I, O, E>(fn: ResMiddlewareFn<I, O, E>, match?: Matcher) => void;
    };
}
export declare type Transformer<I, O> = (payload: I) => O;
export declare type ReqMiddlewareFn<I = any, O = any> = Transformer<RPCRequest<I>, RPCRequest<O>>;
export declare type ResMiddlewareFn<I = any, O = any, E = any> = Transformer<WithRequest<RPCResponse<I, E>>, WithRequest<RPCResponse<O, E>>>;
export declare function isValidResponse<T, E>(response: any): response is RPCResponse<T, E>;
export declare function composeMiddleware<T extends ReqMiddlewareFn[]>(...fns: T): ReqMiddlewareFn;
export declare function composeMiddleware<T extends ResMiddlewareFn[]>(...fns: T): ResMiddlewareFn;
//# sourceMappingURL=util.d.ts.map