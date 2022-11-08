/// <reference types="node" />
import { RPCResponse } from './net';
import { Middleware } from './util';
export declare type Subscriber = (event: any) => void;
export declare type Subscribers = Map<SubscriptionToken, Subscriber>;
declare type SubscriptionToken = symbol;
export interface Provider {
    middleware: Middleware;
    send<R = any, E = string>(method: string, ...params: any[]): Promise<RPCResponse<R, E>>;
    sendBatch<R = any, E = string>(method: string, ...params: any[]): Promise<RPCResponse<R, E>>;
    subscribe?(event: string, subscriber: Subscriber): symbol;
    unsubscribe?(token: symbol): void;
}
export declare abstract class Signer {
    abstract sign(payload: Signable): Promise<Signable>;
}
export interface Signable {
    bytes: Buffer;
}
/**
 * ZilliqaModule
 *
 * This interface must be implemented by all top-level modules.
 */
export interface ZilliqaModule {
    provider: Provider;
    signer: Signer;
}
export interface BlockchainInfo {
    NumPeers: number;
    NumTxBlocks: string;
    NumDSBlocks: string;
    NumTransactions: string;
    TransactionRate: number;
    TxBlockRate: number;
    DSBlockRate: number;
    CurrentMiniEpoch: string;
    CurrentDSEpoch: string;
    NumTxnsDSEpoch: string;
    NumTxnsTxEpoch: string;
    ShardingStructure: ShardingStructure;
}
export interface ShardingStructure {
    NumPeers: number[];
}
export interface TransactionObj {
    ID: string;
    version: string;
    nonce: string;
    toAddr: string;
    amount: string;
    code: string;
    data: string;
    gasPrice: string;
    gasLimit: string;
    signature: string;
    senderPubKey: string;
    receipt: TransactionReceiptObj;
}
export interface TransactionStatusObj {
    ID: string;
    _id: StatusID;
    amount: string;
    epochInserted: string;
    epochUpdated: string;
    gasLimit: string;
    gasPrice: string;
    lastModified: string;
    modificationState: number;
    nonce: string;
    senderAddr: string;
    signature: string;
    status: number;
    success: boolean;
    toAddr: string;
    version: string;
    statusMessage: string;
}
export interface StatusID {
    $oid: string;
}
export interface DsBlockHeader {
    BlockNum: string;
    Difficulty: number;
    DifficultyDS: number;
    GasPrice: string;
    LeaderPubKey: string;
    PoWWinners: string[];
    PrevHash: string;
    Timestamp: string;
}
export interface DsBlockObj {
    header: DsBlockHeader;
    signature: string;
}
interface BlockShort {
    BlockNum: number;
    Hash: string;
}
export interface BlockList {
    data: BlockShort[];
    maxPages: number;
}
export interface TxBlockHeader {
    BlockNum: string;
    DSBlockNum: string;
    GasLimit: string;
    GasUsed: string;
    MbInfoHash: string;
    MinerPubKey: string;
    NumMicroBlocks: number;
    NumPages: number;
    NumTxns: number;
    PrevBlockHash: string;
    Rewards: string;
    StateDeltaHash: string;
    StateRootHash: string;
    Timestamp: string;
    TxnFees: string;
    Version: number;
}
export interface MicroBlockInfoObj {
    MicroBlockHash: string;
    MicroBlockShardId: number;
    MicroBlockTxnRootHash: string;
}
export interface TxBlockObj {
    body: {
        BlockHash: string;
        HeaderSign: string;
        MicroBlockInfos: MicroBlockInfoObj[];
    };
    header: TxBlockHeader;
}
export interface TxList {
    number: number;
    TxnHashes: string[];
}
export declare enum TransactionError {
    CHECKER_FAILED = 0,
    RUNNER_FAILED = 1,
    BALANCE_TRANSFER_FAILED = 2,
    EXECUTE_CMD_FAILED = 3,
    EXECUTE_CMD_TIMEOUT = 4,
    NO_GAS_REMAINING_FOUND = 5,
    NO_ACCEPTED_FOUND = 6,
    CALL_CONTRACT_FAILED = 7,
    CREATE_CONTRACT_FAILED = 8,
    JSON_OUTPUT_CORRUPTED = 9,
    CONTRACT_NOT_EXIST = 10,
    STATE_CORRUPTED = 11,
    LOG_ENTRY_INSTALL_FAILED = 12,
    MESSAGE_CORRUPTED = 13,
    RECEIPT_IS_NULL = 14,
    MAX_DEPTH_REACHED = 15,
    CHAIN_CALL_DIFF_SHARD = 16,
    PREPARATION_FAILED = 17,
    NO_OUTPUT = 18,
    OUTPUT_ILLEGAL = 19
}
export interface TransactionErrorObj {
    [depth: number]: TransactionError[];
}
export interface TransactionReceiptObj<TGas = string> {
    accepted?: boolean;
    cumulative_gas: TGas;
    epoch_num: string;
    event_logs?: EventLogEntry[];
    exceptions?: ExceptionEntry[];
    success: boolean;
    transitions?: TransitionEntry[];
    errors?: any;
}
export interface ExceptionEntry {
    line: number;
    message: string;
}
export interface EventLogEntry {
    address: string;
    _eventname: string;
    params: EventParam[];
}
export interface TransitionEntry {
    accepted: boolean;
    addr: string;
    depth: number;
    msg: TransitionMsg;
}
export interface TransitionMsg {
    _amount: string;
    _recipient: string;
    _tag: string;
    params: EventParam[];
}
export interface EventParam {
    vname: string;
    type: string;
    value: any;
}
export interface TransactionStatus {
    code: number;
    TxnHash: string;
    info: string;
}
export interface MinerInfo {
    dscommittee: string[];
    shards: ShardInfo[];
}
export interface ShardInfo {
    nodes: string[];
    size: number;
}
export {};
//# sourceMappingURL=types.d.ts.map