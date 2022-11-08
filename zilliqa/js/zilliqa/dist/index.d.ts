import { Provider } from '@zilliqa-js/core';
import { TransactionFactory, Wallet } from '@zilliqa-js/account';
import { Contracts } from '@zilliqa-js/contract';
import { Blockchain, Network } from '@zilliqa-js/blockchain';
import { SubscriptionBuilder } from '@zilliqa-js/subscriptions';
export * from '@zilliqa-js/util';
export * from '@zilliqa-js/crypto';
export * from '@zilliqa-js/subscriptions';
export declare class Zilliqa {
    provider: Provider;
    blockchain: Blockchain;
    network: Network;
    contracts: Contracts;
    transactions: TransactionFactory;
    wallet: Wallet;
    subscriptionBuilder: SubscriptionBuilder;
    constructor(node: string, provider?: Provider);
}
//# sourceMappingURL=index.d.ts.map