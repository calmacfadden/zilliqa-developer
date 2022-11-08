import mitt from 'mitt';
import { w3cwebsocket as W3CWebsocket } from 'websocket';
import { NewBlockQuery, NewEventQuery, SubscriptionOption, Unsubscribe } from './types';
export declare class WebSocketProvider {
    static NewWebSocket(url: string, options?: SubscriptionOption): WebSocket | W3CWebsocket;
    url: string;
    options?: SubscriptionOption;
    emitter: mitt.Emitter;
    handlers: any;
    websocket: WebSocket | W3CWebsocket;
    subscriptions: any;
    constructor(url: string, options?: SubscriptionOption);
    registerEventListeners(): void;
    removeAllSocketListeners(): void;
    removeEventListener(type?: string, handler?: mitt.Handler): void;
    reconnect(): void;
    onClose(event: CloseEvent): Promise<void>;
    onError(event: Event): void;
    onConnect(): Promise<void>;
    onMessage(msg: MessageEvent): void;
    addEventListener(type: string, handler: mitt.Handler): void;
    connecting(): boolean;
    send(query: NewBlockQuery | NewEventQuery): Promise<any>;
    subscribe(payload: NewBlockQuery | NewEventQuery): Promise<boolean>;
    unsubscribe(payload: Unsubscribe): Promise<boolean>;
}
//# sourceMappingURL=ws.d.ts.map