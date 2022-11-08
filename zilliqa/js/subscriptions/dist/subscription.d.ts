import { WebSocketProvider } from './ws';
import { NewBlockQuery, NewEventQuery, SubscriptionOption } from './types';
export declare class Subscription extends WebSocketProvider {
    subject: NewBlockQuery | NewEventQuery;
    constructor(subject: NewBlockQuery | NewEventQuery, url: string, options?: SubscriptionOption);
    start(): Promise<boolean>;
    stop(): Promise<boolean>;
}
//# sourceMappingURL=subscription.d.ts.map