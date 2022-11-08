import { Provider, ZilliqaModule } from '@zilliqa-js/core';
import { Wallet } from '@zilliqa-js/account';
export declare class Network implements ZilliqaModule {
    provider: Provider;
    signer: Wallet;
    constructor(provider: Provider, signer: Wallet);
    getClientVersion(): Promise<any>;
    GetNetworkId(): Promise<any>;
    GetProtocolVersion(blockNum: number): Promise<any>;
}
//# sourceMappingURL=network.d.ts.map