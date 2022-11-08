"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@zilliqa-js/core");
var crypto_1 = require("@zilliqa-js/crypto");
var util_1 = require("@zilliqa-js/util");
var types_1 = require("./types");
var util_2 = require("./util");
var hash_js_1 = (0, tslib_1.__importDefault)(require("hash.js"));
/**
 * Transaction
 *
 * Transaction is a functor. Its purpose is to encode the possible states a
 * Transaction can be in:  Confirmed, Rejected, Pending, or Initialised (i.e., not broadcasted).
 */
var Transaction = /** @class */ (function () {
    function Transaction(params, provider, status, toDS, enableSecureToAddress) {
        if (status === void 0) { status = types_1.TxStatus.Initialised; }
        if (toDS === void 0) { toDS = false; }
        if (enableSecureToAddress === void 0) { enableSecureToAddress = true; }
        this.code = '';
        this.data = '';
        // private members
        this.version = params.version;
        this.toAddr = enableSecureToAddress
            ? (0, crypto_1.normaliseAddress)(params.toAddr)
            : (0, crypto_1.toChecksumAddress)(params.toAddr);
        this.nonce = params.nonce;
        this.pubKey = params.pubKey;
        this.amount = params.amount;
        this.code = params.code || '';
        this.data = params.data || '';
        this.signature = params.signature;
        this.gasPrice = params.gasPrice;
        this.gasLimit = params.gasLimit;
        this.receipt = params.receipt;
        // public members
        this.provider = provider;
        this.status = status;
        this.toDS = toDS;
        this.blockConfirmation = 0;
        this.eventEmitter = new core_1.EventEmitter();
    }
    /**
     * confirm
     *
     * constructs an already-confirmed transaction.
     *
     * @static
     * @param {BaseTx} params
     */
    Transaction.confirm = function (params, provider) {
        return new Transaction(params, provider, types_1.TxStatus.Confirmed);
    };
    /**
     * reject
     *
     * constructs an already-rejected transaction.
     *
     * @static
     * @param {BaseTx} params
     */
    Transaction.reject = function (params, provider) {
        return new Transaction(params, provider, types_1.TxStatus.Rejected);
    };
    Object.defineProperty(Transaction.prototype, "hash", {
        /**
         * to get hash or transaction id of this transaction
         * this can be identical returned by zilliqa network while calling CreateTransaction
         */
        get: function () {
            var payload = this.bytes.toString('hex');
            return hash_js_1.default.sha256().update(payload, 'hex').digest('hex');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "bytes", {
        get: function () {
            return (0, util_2.encodeTransactionProto)(this.txParams);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "senderAddress", {
        get: function () {
            if (!this.pubKey) {
                return '0'.repeat(40);
            }
            return (0, crypto_1.getAddressFromPublicKey)(this.pubKey);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "txParams", {
        get: function () {
            return {
                version: this.version,
                toAddr: (0, crypto_1.normaliseAddress)(this.toAddr),
                nonce: this.nonce,
                pubKey: this.pubKey,
                amount: this.amount,
                gasPrice: this.gasPrice,
                gasLimit: this.gasLimit,
                code: this.code,
                data: this.data,
                signature: this.signature,
                receipt: this.receipt,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "payload", {
        get: function () {
            return {
                version: this.version,
                toAddr: this.toAddr,
                nonce: this.nonce,
                pubKey: this.pubKey,
                amount: this.amount.toString(),
                gasPrice: this.gasPrice.toString(),
                gasLimit: this.gasLimit.toString(),
                code: this.code,
                data: this.data,
                signature: this.signature,
                receipt: this.receipt,
            };
        },
        enumerable: false,
        configurable: true
    });
    /**
     * isPending
     *
     * @returns {boolean}
     */
    Transaction.prototype.isPending = function () {
        return this.status === types_1.TxStatus.Pending;
    };
    /**
     * isInitialised
     *
     * @returns {boolean}
     */
    Transaction.prototype.isInitialised = function () {
        return this.status === types_1.TxStatus.Initialised;
    };
    Transaction.prototype.getReceipt = function () {
        return this.receipt;
    };
    /**
     * isConfirmed
     *
     * @returns {boolean}
     */
    Transaction.prototype.isConfirmed = function () {
        return this.status === types_1.TxStatus.Confirmed;
    };
    /**
     * isRejected
     *
     * @returns {boolean}
     */
    Transaction.prototype.isRejected = function () {
        return this.status === types_1.TxStatus.Rejected;
    };
    /**
     * setProvider
     *
     * Sets the provider on this instance.
     *
     * @param {Provider} provider
     */
    Transaction.prototype.setProvider = function (provider) {
        this.provider = provider;
    };
    /**
     * setStatus
     *
     * Escape hatch to imperatively set the state of the transaction.
     *
     * @param {TxStatus} status
     * @returns {undefined}
     */
    Transaction.prototype.setStatus = function (status) {
        this.status = status;
        return this;
    };
    Transaction.prototype.observed = function () {
        return this.eventEmitter;
    };
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
    Transaction.prototype.blockConfirm = function (txHash, maxblockCount, interval) {
        if (maxblockCount === void 0) { maxblockCount = 4; }
        if (interval === void 0) { interval = 1000; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var blockStart, blockChecked, attempt, blockLatest, blockNext, err_1, blockFailed, errorMessage;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.status = types_1.TxStatus.Pending;
                        return [4 /*yield*/, this.getBlockNumber()];
                    case 1:
                        blockStart = _a.sent();
                        blockChecked = blockStart;
                        attempt = 0;
                        _a.label = 2;
                    case 2:
                        if (!(attempt < maxblockCount)) return [3 /*break*/, 12];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 8, , 9]);
                        return [4 /*yield*/, this.getBlockNumber()];
                    case 4:
                        blockLatest = _a.sent();
                        blockNext = blockChecked.add(new util_1.BN(attempt === 0 ? attempt : 1));
                        if (!blockLatest.gte(blockNext)) return [3 /*break*/, 6];
                        blockChecked = blockLatest;
                        this.emit(types_1.TxEventName.Track, {
                            txHash: txHash,
                            attempt: attempt,
                            currentBlock: blockChecked.toString(),
                        });
                        return [4 /*yield*/, this.trackTx(txHash)];
                    case 5:
                        if (_a.sent()) {
                            this.blockConfirmation = blockLatest.sub(blockStart).toNumber();
                            return [2 /*return*/, this];
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        attempt = attempt - 1 >= 0 ? attempt - 1 : 0;
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_1 = _a.sent();
                        this.status = types_1.TxStatus.Rejected;
                        throw err_1;
                    case 9:
                        if (!(attempt + 1 < maxblockCount)) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, util_2.sleep)(interval)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        attempt += 1;
                        return [3 /*break*/, 2];
                    case 12: return [4 /*yield*/, this.getBlockNumber()];
                    case 13:
                        blockFailed = _a.sent();
                        this.blockConfirmation = blockFailed.sub(blockStart).toNumber();
                        this.status = types_1.TxStatus.Rejected;
                        errorMessage = "The transaction is still not confirmed after " + maxblockCount + " blocks.";
                        throw new Error(errorMessage);
                }
            });
        });
    };
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
    Transaction.prototype.confirm = function (txHash, maxAttempts, interval) {
        if (maxAttempts === void 0) { maxAttempts = core_1.GET_TX_ATTEMPTS; }
        if (interval === void 0) { interval = 1000; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var attempt, err_2, errorMessage;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.status = types_1.TxStatus.Pending;
                        attempt = 0;
                        _a.label = 1;
                    case 1:
                        if (!(attempt < maxAttempts)) return [3 /*break*/, 8];
                        this.emit(types_1.TxEventName.Track, {
                            txHash: txHash,
                            attempt: attempt,
                        });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.trackTx(txHash)];
                    case 3:
                        if (_a.sent()) {
                            return [2 /*return*/, this];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        this.status = types_1.TxStatus.Rejected;
                        throw err_2;
                    case 5:
                        if (!(attempt + 1 < maxAttempts)) return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, util_2.sleep)(interval * attempt)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        attempt++;
                        return [3 /*break*/, 1];
                    case 8:
                        this.status = types_1.TxStatus.Rejected;
                        errorMessage = "The transaction is still not confirmed after " + maxAttempts + " attempts.";
                        throw new Error(errorMessage);
                }
            });
        });
    };
    /**
     * map
     *
     * maps over the transaction, allowing for manipulation.
     *
     * @param {(prev: TxParams) => TxParams} fn - mapper
     * @returns {Transaction}
     */
    Transaction.prototype.map = function (fn) {
        var newParams = fn(this.txParams);
        this.setParams(newParams);
        return this;
    };
    Transaction.prototype.setParams = function (params) {
        this.version = params.version;
        this.toAddr = (0, crypto_1.normaliseAddress)(params.toAddr);
        this.nonce = params.nonce;
        this.pubKey = params.pubKey;
        this.amount = params.amount;
        this.code = params.code || '';
        this.data = params.data || '';
        this.signature = params.signature;
        this.gasPrice = params.gasPrice;
        this.gasLimit = params.gasLimit;
        this.receipt = params.receipt;
    };
    Transaction.prototype.trackTx = function (txHash) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var res;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.send(core_1.RPCMethod.GetTransaction, txHash)];
                    case 1:
                        res = _a.sent();
                        if (res.error) {
                            this.emit(types_1.TxEventName.Error, res.error);
                            return [2 /*return*/, false];
                        }
                        this.id = res.result.ID;
                        this.receipt = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, res.result.receipt), { cumulative_gas: parseInt(res.result.receipt.cumulative_gas, 10) });
                        this.emit(types_1.TxEventName.Receipt, this.receipt);
                        this.status =
                            this.receipt && this.receipt.success
                                ? types_1.TxStatus.Confirmed
                                : types_1.TxStatus.Rejected;
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Transaction.prototype.getBlockNumber = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var res, error_1;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.provider.send(core_1.RPCMethod.GetLatestTxBlock)];
                    case 1:
                        res = _a.sent();
                        if (res.error === undefined && res.result.header.BlockNum) {
                            // if blockNumber is too high, we use BN to be safer
                            return [2 /*return*/, new util_1.BN(res.result.header.BlockNum)];
                        }
                        else {
                            throw new Error('Can not get latest BlockNumber');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Transaction.prototype.emit = function (event, txEvent) {
        this.eventEmitter.emit(event, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, txEvent), { event: event }));
    };
    return Transaction;
}());
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map