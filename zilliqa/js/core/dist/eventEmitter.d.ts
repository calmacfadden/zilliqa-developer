import mitt from 'mitt';
declare class EventEmitter<T> {
    off: (type: string, handler: mitt.Handler) => void;
    emit: (type: string, event?: any) => void;
    promise: Promise<T>;
    resolve?: (value: T | PromiseLike<T>) => void;
    reject?: (reason?: any) => void;
    then?: any;
    private handlers?;
    private emitter;
    constructor();
    resetHandlers(): void;
    on(type: string, handler: mitt.Handler): this;
    once(type: string, handler: mitt.Handler): void;
    addEventListener(type: string, handler: mitt.Handler): void;
    removeEventListener(type?: string, handler?: mitt.Handler): void;
    onError(error: any): void;
    onData(data: any): void;
    listenerCount(listenKey: any): number;
}
export { EventEmitter };
//# sourceMappingURL=eventEmitter.d.ts.map