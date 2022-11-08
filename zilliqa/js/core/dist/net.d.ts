import 'cross-fetch/polyfill';
import { WithRequest } from './util';
/**
 * blockchain-side.
 */
export declare enum RPCMethod {
    GetNetworkId = "GetNetworkId",
    GetBlockchainInfo = "GetBlockchainInfo",
    GetShardingStructure = "GetShardingStructure",
    GetDSBlock = "GetDsBlock",
    GetLatestDSBlock = "GetLatestDsBlock",
    GetNumDSBlocks = "GetNumDSBlocks",
    GetDSBlockRate = "GetDSBlockRate",
    DSBlockListing = "DSBlockListing",
    GetTxBlock = "GetTxBlock",
    GetLatestTxBlock = "GetLatestTxBlock",
    GetNumTxBlocks = "GetNumTxBlocks",
    GetTxBlockRate = "GetTxBlockRate",
    TxBlockListing = "TxBlockListing",
    GetNumTransactions = "GetNumTransactions",
    GetTransactionRate = "GetTransactionRate",
    GetCurrentMiniEpoch = "GetCurrentMiniEpoch",
    GetCurrentDSEpoch = "GetCurrentDSEpoch",
    GetPrevDifficulty = "GetPrevDifficulty",
    GetPrevDSDifficulty = "GetPrevDSDifficulty",
    GetTotalCoinSupply = "GetTotalCoinSupply",
    GetMinerInfo = "GetMinerInfo",
    CreateTransaction = "CreateTransaction",
    GetTransaction = "GetTransaction",
    GetTransactionStatus = "GetTransactionStatus",
    GetRecentTransactions = "GetRecentTransactions",
    GetTransactionsForTxBlock = "GetTransactionsForTxBlock",
    GetTransactionsForTxBlockEx = "GetTransactionsForTxBlockEx",
    GetTxnBodiesForTxBlock = "GetTxnBodiesForTxBlock",
    GetTxnBodiesForTxBlockEx = "GetTxnBodiesForTxBlockEx",
    GetNumTxnsTxEpoch = "GetNumTxnsTxEpoch",
    GetNumTxnsDSEpoch = "GetNumTxnsDSEpoch",
    GetMinimumGasPrice = "GetMinimumGasPrice",
    GetContractAddressFromTransactionID = "GetContractAddressFromTransactionID",
    GetSmartContracts = "GetSmartContracts",
    GetSmartContractCode = "GetSmartContractCode",
    GetSmartContractInit = "GetSmartContractInit",
    GetSmartContractState = "GetSmartContractState",
    GetSmartContractSubState = "GetSmartContractSubState",
    GetStateProof = "GetStateProof",
    GetBalance = "GetBalance"
}
export declare enum RPCErrorCode {
    RPC_INVALID_REQUEST = -32600,
    RPC_METHOD_NOT_FOUND = -32601,
    RPC_INVALID_PARAMS = -32602,
    RPC_INTERNAL_ERROR = -32603,
    RPC_PARSE_ERROR = -32700,
    RPC_MISC_ERROR = -1,
    RPC_TYPE_ERROR = -3,
    RPC_INVALID_ADDRESS_OR_KEY = -5,
    RPC_INVALID_PARAMETER = -8,
    RPC_DATABASE_ERROR = -20,
    RPC_DESERIALIZATION_ERROR = -22,
    RPC_VERIFY_ERROR = -25,
    RPC_VERIFY_REJECTED = -26,
    RPC_IN_WARMUP = -28,
    RPC_METHOD_DEPRECATED = -32
}
export interface RPCRequestPayload<T> {
    id: number;
    jsonrpc: '2.0';
    method: RPCMethod;
    params: T;
}
interface RPCRequestOptions {
    headers?: Headers;
    method?: string;
}
export interface RPCRequest<T> {
    url: string;
    payload: RPCRequestPayload<T> | RPCRequestPayload<T>[];
    options?: RPCRequestOptions;
}
interface RPCResponseBase {
    jsonrpc: '2.0';
    id: number;
}
export interface RPCResponseSuccess<R = any> extends RPCResponseBase {
    batch_result?: R;
    result: R;
    error: undefined;
}
export interface RPCResponseError<E = any> extends RPCResponseBase {
    result: undefined;
    error: RPCError<E>;
}
export interface RPCError<E> {
    code: RPCErrorCode;
    message: string;
    data?: E;
}
export declare type RPCResponse<R, E> = RPCResponseSuccess<R> | RPCResponseError<E>;
export declare type RPCResponseHandler<R, E, T> = (response: WithRequest<RPCResponse<R, E>>) => T;
export declare const performRPC: <R, E, D extends any[], T = RPCResponse<R, E>>(request: RPCRequest<D>, handler: RPCResponseHandler<R, E, T>) => Promise<T>;
export declare const performBatchRPC: <R, E, D extends any[], T = RPCResponse<R, E>>(request: RPCRequest<D>, handler: RPCResponseHandler<R, E, T>) => Promise<T>;
export {};
//# sourceMappingURL=net.d.ts.map