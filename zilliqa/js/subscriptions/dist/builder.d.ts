import { NewTxBlockSubscription } from './newblock';
import { NewEventSubscription } from './newevent';
import { SubscriptionOption } from './types';
export declare class SubscriptionBuilder {
    buildNewBlockSubscriptions(url: string, options?: SubscriptionOption): NewTxBlockSubscription;
    buildEventLogSubscriptions(url: string, options?: SubscriptionOption): NewEventSubscription;
}
//# sourceMappingURL=builder.d.ts.map