import { Wallet, Transaction } from '@zilliqa-js/account';
import { Provider, ZilliqaModule } from '@zilliqa-js/core';
import { Contract } from './contract';
import { ABI, Init, State } from './types';
/**
 * Contracts
 *
 * Unlike most zilliqa-js modules, `Contracts` is a factory class.
 * As a result, individual `Contract` instances are instead obtained by
 * calling `Contracts.at` (for an already-deployed contract) and
 * `Contracts.new` (to deploy a new contract).
 */
export declare class Contracts implements ZilliqaModule {
    /**
     * getAddressForContract
     *
     * @static
     * @param {Transaction} tx - transaction used to create the contract
     * @returns {string} - the contract address
     */
    static getAddressForContract(tx: Transaction): string;
    provider: Provider;
    signer: Wallet;
    constructor(provider: Provider, signer: Wallet);
    at(address: string, abi?: ABI, code?: string, init?: Init, state?: State): Contract;
    atBech32(address: string, abi?: ABI, code?: string, init?: Init, state?: State): Contract;
    new(code: string, init: Init, abi?: ABI): Contract;
}
//# sourceMappingURL=factory.d.ts.map