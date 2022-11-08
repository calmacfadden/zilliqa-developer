/// <reference types="node" />
import { EventEmitter, Provider, Signable } from '@zilliqa-js/core';
import { TxParams, TxReceipt, TxStatus } from './types';
/**
 * Transaction
 *
 * Transaction is a functor. Its purpose is to encode the possible states a
 * Transaction can be in:  Confirmed, Rejected, Pending, or Initialised (i.e., not broadcasted).
 */
export declare class Transaction implements Signable {
    /**
     * confirm
     *
     * constructs an already-confirmed transaction.
     *
     * @static
     * @param {BaseTx} params
     */
    static confirm(params: TxParams, provider: Provider): Transaction;
    /**
     * reject
     *
     * constructs an already-rejected transaction.
     *
     * @static
     * @param {BaseTx} params
     */
    static reject(params: TxParams, provider: Provider): Transaction;
    provider: Provider;
    eventEmitter: EventEmitter<Transaction>;
    id?: string;
    status: TxStatus;
    toDS: boolean;
    blockConfirmation?: number;
    private version;
    private nonce?;
    private toAddr;
    private pubKey?;
    private amount;
    private gasPrice;
    private gasLimit;
    private code;
    private data;
    private receipt?;
    private signature?;
    /**
     * to get hash or transaction id of this transaction
     * this can be identical returned by zilliqa network while calling CreateTransaction
     */
    get hash(): string;
    get bytes(): Buffer;
    get senderAddress(): string;
    get txParams(): TxParams;
    get payload(): {
        version: number;
        toAddr: string;
        nonce: number | undefined;
        pubKey: string | undefined;
        amount: string;
        gasPrice: string;
        gasLimit: string;
        code: string;
        data: string;
        signature: string | undefined;
        receipt: TxReceipt | undefined;
    };
    constructor(params: TxParams, provider: Provider, status?: TxStatus, toDS?: boolean, enableSecureToAddress?: boolean);
    /**
     * isPending
     *
     * @returns {boolean}
     */
    isPending(): boolean;
    /**
     * isInitialised
     *
     * @returns {boolean}
     */
    isInitialised(): boolean;
    getReceipt(): TxReceipt | undefined;
    /**
     * isConfirmed
     *
     * @returns {boolean}
     */
    isConfirmed(): boolean;
    /**
     * isRejected
     *
     * @returns {boolean}
     */
    isRejected(): boolean;
    /**
     * setProvider
     *
     * Sets the provider on this instance.
     *
     * @param {Provider} provider
     */
    setProvider(provider: Provider): void;
    /**
     * setStatus
     *
     * Escape hatch to imperatively set the state of the transaction.
     *
     * @param {TxStatus} status
     * @returns {undefined}
     */
    setStatus(status: TxStatus): this;
    observed(): EventEmitter<Transaction>;
    /**
     * blockConfirm
     *
     * Use `RPCMethod.GetLatestBlock` to get latest blockNumber
     * Use interval to get the latestBlockNumber
     * After BlockNumber change, then we use `RPCMethod.GetTransaction` to get the receipt
     *
     * @param {string} txHash
     * @param {number} maxblockCount
     * @param {number} interval interval in milliseconds
     * @returns {Promise<Transaction>}
     */
    blockConfirm(txHash: string, maxblockCount?: number, interval?: number): Promise<this>;
    /**
     * confirmReceipt
     *
     * Similar to the Promise API. This sets the Transaction instance to a state
     * of pending. Calling this function kicks off a passive loop that polls the
     * lookup node for confirmation on the txHash.
     *
     * The polls are performed with a linear backoff:
     *
     * `const delay = interval * attempt`
     *
     * This is a low-level method that you should generally not have to use
     * directly.
     *
     * @param {string} txHash
     * @param {number} maxAttempts
     * @param {number} initial interval in milliseconds
     * @returns {Promise<Transaction>}
     */
    confirm(txHash: string, maxAttempts?: number, interval?: number): Promise<Transaction>;
    /**
     * map
     *
     * maps over the transaction, allowing for manipulation.
     *
     * @param {(prev: TxParams) => TxParams} fn - mapper
     * @returns {Transaction}
     */
    map(fn: (prev: TxParams) => TxParams): Transaction;
    private setParams;
    private trackTx;
    private getBlockNumber;
    private emit;
}
//# sourceMappingURL=transaction.d.ts.map