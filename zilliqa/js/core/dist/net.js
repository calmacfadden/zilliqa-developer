"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performBatchRPC = exports.performRPC = exports.RPCErrorCode = exports.RPCMethod = void 0;
var tslib_1 = require("tslib");
//  Copyright (C) 2018 Zilliqa
//
//  This file is part of zilliqa-js
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <https://www.gnu.org/licenses/>.
require("cross-fetch/polyfill");
/**
 * blockchain-side.
 */
var RPCMethod;
(function (RPCMethod) {
    // Network-related methods
    RPCMethod["GetNetworkId"] = "GetNetworkId";
    // Blockchain-related methods
    RPCMethod["GetBlockchainInfo"] = "GetBlockchainInfo";
    RPCMethod["GetShardingStructure"] = "GetShardingStructure";
    RPCMethod["GetDSBlock"] = "GetDsBlock";
    RPCMethod["GetLatestDSBlock"] = "GetLatestDsBlock";
    RPCMethod["GetNumDSBlocks"] = "GetNumDSBlocks";
    RPCMethod["GetDSBlockRate"] = "GetDSBlockRate";
    RPCMethod["DSBlockListing"] = "DSBlockListing";
    RPCMethod["GetTxBlock"] = "GetTxBlock";
    RPCMethod["GetLatestTxBlock"] = "GetLatestTxBlock";
    RPCMethod["GetNumTxBlocks"] = "GetNumTxBlocks";
    RPCMethod["GetTxBlockRate"] = "GetTxBlockRate";
    RPCMethod["TxBlockListing"] = "TxBlockListing";
    RPCMethod["GetNumTransactions"] = "GetNumTransactions";
    RPCMethod["GetTransactionRate"] = "GetTransactionRate";
    RPCMethod["GetCurrentMiniEpoch"] = "GetCurrentMiniEpoch";
    RPCMethod["GetCurrentDSEpoch"] = "GetCurrentDSEpoch";
    RPCMethod["GetPrevDifficulty"] = "GetPrevDifficulty";
    RPCMethod["GetPrevDSDifficulty"] = "GetPrevDSDifficulty";
    RPCMethod["GetTotalCoinSupply"] = "GetTotalCoinSupply";
    RPCMethod["GetMinerInfo"] = "GetMinerInfo";
    // Transaction-related methods
    RPCMethod["CreateTransaction"] = "CreateTransaction";
    RPCMethod["GetTransaction"] = "GetTransaction";
    RPCMethod["GetTransactionStatus"] = "GetTransactionStatus";
    RPCMethod["GetRecentTransactions"] = "GetRecentTransactions";
    RPCMethod["GetTransactionsForTxBlock"] = "GetTransactionsForTxBlock";
    RPCMethod["GetTransactionsForTxBlockEx"] = "GetTransactionsForTxBlockEx";
    RPCMethod["GetTxnBodiesForTxBlock"] = "GetTxnBodiesForTxBlock";
    RPCMethod["GetTxnBodiesForTxBlockEx"] = "GetTxnBodiesForTxBlockEx";
    RPCMethod["GetNumTxnsTxEpoch"] = "GetNumTxnsTxEpoch";
    RPCMethod["GetNumTxnsDSEpoch"] = "GetNumTxnsDSEpoch";
    RPCMethod["GetMinimumGasPrice"] = "GetMinimumGasPrice";
    // Contract-related methods
    RPCMethod["GetContractAddressFromTransactionID"] = "GetContractAddressFromTransactionID";
    RPCMethod["GetSmartContracts"] = "GetSmartContracts";
    RPCMethod["GetSmartContractCode"] = "GetSmartContractCode";
    RPCMethod["GetSmartContractInit"] = "GetSmartContractInit";
    RPCMethod["GetSmartContractState"] = "GetSmartContractState";
    RPCMethod["GetSmartContractSubState"] = "GetSmartContractSubState";
    RPCMethod["GetStateProof"] = "GetStateProof";
    // Account-related methods
    RPCMethod["GetBalance"] = "GetBalance";
})(RPCMethod = exports.RPCMethod || (exports.RPCMethod = {}));
var RPCErrorCode;
(function (RPCErrorCode) {
    // Standard JSON-RPC 2.0 errors
    // RPC_INVALID_REQUEST is internally mapped to HTTP_BAD_REQUEST (400).
    // It should not be used for application-layer errors.
    RPCErrorCode[RPCErrorCode["RPC_INVALID_REQUEST"] = -32600] = "RPC_INVALID_REQUEST";
    // RPC_METHOD_NOT_FOUND is internally mapped to HTTP_NOT_FOUND (404).
    // It should not be used for application-layer errors.
    RPCErrorCode[RPCErrorCode["RPC_METHOD_NOT_FOUND"] = -32601] = "RPC_METHOD_NOT_FOUND";
    RPCErrorCode[RPCErrorCode["RPC_INVALID_PARAMS"] = -32602] = "RPC_INVALID_PARAMS";
    // RPC_INTERNAL_ERROR should only be used for genuine errors in bitcoind
    // (for example datadir corruption).
    RPCErrorCode[RPCErrorCode["RPC_INTERNAL_ERROR"] = -32603] = "RPC_INTERNAL_ERROR";
    RPCErrorCode[RPCErrorCode["RPC_PARSE_ERROR"] = -32700] = "RPC_PARSE_ERROR";
    // General application defined errors
    RPCErrorCode[RPCErrorCode["RPC_MISC_ERROR"] = -1] = "RPC_MISC_ERROR";
    RPCErrorCode[RPCErrorCode["RPC_TYPE_ERROR"] = -3] = "RPC_TYPE_ERROR";
    RPCErrorCode[RPCErrorCode["RPC_INVALID_ADDRESS_OR_KEY"] = -5] = "RPC_INVALID_ADDRESS_OR_KEY";
    RPCErrorCode[RPCErrorCode["RPC_INVALID_PARAMETER"] = -8] = "RPC_INVALID_PARAMETER";
    RPCErrorCode[RPCErrorCode["RPC_DATABASE_ERROR"] = -20] = "RPC_DATABASE_ERROR";
    RPCErrorCode[RPCErrorCode["RPC_DESERIALIZATION_ERROR"] = -22] = "RPC_DESERIALIZATION_ERROR";
    RPCErrorCode[RPCErrorCode["RPC_VERIFY_ERROR"] = -25] = "RPC_VERIFY_ERROR";
    RPCErrorCode[RPCErrorCode["RPC_VERIFY_REJECTED"] = -26] = "RPC_VERIFY_REJECTED";
    RPCErrorCode[RPCErrorCode["RPC_IN_WARMUP"] = -28] = "RPC_IN_WARMUP";
    RPCErrorCode[RPCErrorCode["RPC_METHOD_DEPRECATED"] = -32] = "RPC_METHOD_DEPRECATED";
})(RPCErrorCode = exports.RPCErrorCode || (exports.RPCErrorCode = {}));
var DEFAULT_HEADERS = { 'Content-Type': 'application/json' };
var performRPC = function (request, handler) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var response, err_1;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetch(request.url, {
                        method: 'POST',
                        cache: 'no-cache',
                        mode: 'cors',
                        redirect: 'follow',
                        referrer: 'no-referrer',
                        body: JSON.stringify(request.payload),
                        headers: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DEFAULT_HEADERS), ((request.options && request.options.headers) || {})),
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response
                        .json()
                        .then(function (body) {
                        return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, body), { req: request });
                    })
                        .then(handler)];
            case 2:
                err_1 = _a.sent();
                throw err_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.performRPC = performRPC;
// identical to performRPC; difference is the response
var performBatchRPC = function (request, handler) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var response, err_2;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetch(request.url, {
                        method: 'POST',
                        cache: 'no-cache',
                        mode: 'cors',
                        redirect: 'follow',
                        referrer: 'no-referrer',
                        body: JSON.stringify(request.payload),
                        headers: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DEFAULT_HEADERS), ((request.options && request.options.headers) || {})),
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, (response
                        .json()
                        .then(function (batch_result) {
                        return { batch_result: batch_result, req: request };
                    })
                        // no handler as compared to performRPC to preserve the body array
                        // e.g. response
                        /*
                      { body:
                        [ { id: 1, jsonrpc: '2.0', result: [Object] },
                          { id: 1, jsonrpc: '2.0', result: [Object] } ],
                       req:
                        { url: 'https://dev-api.zilliqa.com',
                          payload: [ [Object], [Object] ] } }
                      */
                        .then())];
            case 2:
                err_2 = _a.sent();
                throw err_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.performBatchRPC = performBatchRPC;
//# sourceMappingURL=net.js.map