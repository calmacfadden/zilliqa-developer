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
exports.Contract = void 0;
var tslib_1 = require("tslib");
var account_1 = require("@zilliqa-js/account");
var core_1 = require("@zilliqa-js/core");
var crypto_1 = require("@zilliqa-js/crypto");
var util_1 = require("@zilliqa-js/util");
var blockchain_1 = require("@zilliqa-js/blockchain");
var factory_1 = require("./factory");
var types_1 = require("./types");
var NIL_ADDRESS = '0x0000000000000000000000000000000000000000';
var Contract = /** @class */ (function () {
    function Contract(factory, code, abi, address, init, state, checkAddr) {
        if (checkAddr === void 0) { checkAddr = false; }
        this.factory = factory;
        this.provider = factory.provider;
        this.signer = factory.signer;
        this.blockchain = new blockchain_1.Blockchain(factory.provider, factory.signer);
        // assume that we are accessing an existing contract
        if (address) {
            this.abi = abi;
            if (checkAddr) {
                this.address = (0, crypto_1.normaliseAddress)(address);
            }
            else {
                if (util_1.validation.isBech32(address)) {
                    this.address = (0, crypto_1.fromBech32Address)(address);
                }
                else if ((0, crypto_1.isValidChecksumAddress)(address)) {
                    this.address = address;
                }
                else {
                    this.address = (0, crypto_1.toChecksumAddress)(address);
                }
            }
            this.init = init;
            this.state = state;
            this.status = types_1.ContractStatus.Deployed;
        }
        else {
            // assume we're deploying
            this.abi = abi;
            this.code = code;
            this.init = init;
            this.status = types_1.ContractStatus.Initialised;
        }
    }
    /**
     * isInitialised
     *
     * Returns true if the contract has not been deployed
     *
     * @returns {boolean}
     */
    Contract.prototype.isInitialised = function () {
        return this.status === types_1.ContractStatus.Initialised;
    };
    /**
     * isDeployed
     *
     * Returns true if the contract is deployed
     *
     * @returns {boolean}
     */
    Contract.prototype.isDeployed = function () {
        return this.status === types_1.ContractStatus.Deployed;
    };
    /**
     * isRejected
     *
     * Returns true if an attempt to deploy the contract was made, but the
     * underlying transaction was unsuccessful.
     *
     * @returns {boolean}
     */
    Contract.prototype.isRejected = function () {
        return this.status === types_1.ContractStatus.Rejected;
    };
    Contract.prototype.prepareTx = function (tx, attempts, interval, isDeploy) {
        if (attempts === void 0) { attempts = core_1.GET_TX_ATTEMPTS; }
        if (interval === void 0) { interval = 1000; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.send(core_1.RPCMethod.CreateTransaction, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, tx.txParams), { priority: tx.toDS }))];
                    case 1:
                        response = _a.sent();
                        if (response.error) {
                            this.address = undefined;
                            this.error = response.error;
                            return [2 /*return*/, tx.setStatus(account_1.TxStatus.Rejected)];
                        }
                        if (isDeploy) {
                            this.address = response.result.ContractAddress
                                ? (0, crypto_1.toChecksumAddress)(response.result.ContractAddress)
                                : undefined;
                        }
                        return [2 /*return*/, tx.confirm(response.result.TranID, attempts, interval)];
                }
            });
        });
    };
    Contract.prototype.prepare = function (tx) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.send(core_1.RPCMethod.CreateTransaction, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, tx.txParams), { priority: tx.toDS }))];
                    case 1:
                        response = _a.sent();
                        if (response.error || !response.result) {
                            this.address = undefined;
                            this.error = response.error;
                            tx.setStatus(account_1.TxStatus.Rejected);
                        }
                        else {
                            tx.id = response.result.TranID;
                            tx.setStatus(account_1.TxStatus.Pending);
                            return [2 /*return*/, response.result.ContractAddress];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * deploy smart contract with no confirm
     * @param params
     * @param toDs
     */
    Contract.prototype.deployWithoutConfirm = function (params, toDs) {
        if (toDs === void 0) { toDs = false; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var tx, _a, err_1;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.code || !this.init) {
                            throw new Error('Cannot deploy without code or initialisation parameters.');
                        }
                        tx = new account_1.Transaction((0, tslib_1.__assign)((0, tslib_1.__assign)({}, params), { toAddr: NIL_ADDRESS, amount: new util_1.BN(0), code: this.code, data: JSON.stringify(this.init).replace(/\\"/g, '"') }), this.provider, account_1.TxStatus.Initialised, toDs);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.prepare(tx)];
                    case 2:
                        _a.address = _b.sent();
                        this.status =
                            this.address === undefined
                                ? types_1.ContractStatus.Rejected
                                : types_1.ContractStatus.Initialised;
                        return [2 /*return*/, [tx, this]];
                    case 3:
                        err_1 = _b.sent();
                        throw err_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * deploy
     *
     * @param {DeployParams} params
     * @returns {Promise<Contract>}
     */
    Contract.prototype.deploy = function (params, attempts, interval, toDs) {
        if (attempts === void 0) { attempts = 33; }
        if (interval === void 0) { interval = 1000; }
        if (toDs === void 0) { toDs = false; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var tx, err_2;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.code || !this.init) {
                            throw new Error('Cannot deploy without code or initialisation parameters.');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prepareTx(new account_1.Transaction((0, tslib_1.__assign)((0, tslib_1.__assign)({}, params), { toAddr: NIL_ADDRESS, amount: new util_1.BN(0), code: this.code, data: JSON.stringify(this.init).replace(/\\"/g, '"') }), this.provider, account_1.TxStatus.Initialised, toDs), attempts, interval, true)];
                    case 2:
                        tx = _a.sent();
                        if (tx.isRejected()) {
                            this.status = types_1.ContractStatus.Rejected;
                            this.address = undefined;
                            return [2 /*return*/, [tx, this]];
                        }
                        this.status = types_1.ContractStatus.Deployed;
                        this.address =
                            this.address && (0, crypto_1.isValidChecksumAddress)(this.address)
                                ? this.address
                                : factory_1.Contracts.getAddressForContract(tx);
                        return [2 /*return*/, [tx, this]];
                    case 3:
                        err_2 = _a.sent();
                        throw err_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Contract.prototype.callWithoutConfirm = function (transition, args, params, toDs) {
        if (toDs === void 0) { toDs = false; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var data, tx, err_3;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            _tag: transition,
                            params: args,
                        };
                        if (this.error) {
                            return [2 /*return*/, Promise.reject(this.error)];
                        }
                        if (!this.address) {
                            return [2 /*return*/, Promise.reject('Contract has not been deployed!')];
                        }
                        tx = new account_1.Transaction((0, tslib_1.__assign)((0, tslib_1.__assign)({}, params), { toAddr: this.address, data: JSON.stringify(data) }), this.provider, account_1.TxStatus.Initialised, toDs);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prepare(tx)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, tx];
                    case 3:
                        err_3 = _a.sent();
                        throw err_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * call
     *
     * @param {string} transition
     * @param {any} params
     * @returns {Promise<Transaction>}
     */
    Contract.prototype.call = function (transition, args, params, attempts, interval, toDs) {
        if (attempts === void 0) { attempts = 33; }
        if (interval === void 0) { interval = 1000; }
        if (toDs === void 0) { toDs = false; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var data, err_4;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            _tag: transition,
                            params: args,
                        };
                        if (this.error) {
                            return [2 /*return*/, Promise.reject(this.error)];
                        }
                        if (!this.address) {
                            return [2 /*return*/, Promise.reject('Contract has not been deployed!')];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prepareTx(new account_1.Transaction((0, tslib_1.__assign)((0, tslib_1.__assign)({}, params), { toAddr: this.address, data: JSON.stringify(data) }), this.provider, account_1.TxStatus.Initialised, toDs), attempts, interval, false)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_4 = _a.sent();
                        throw err_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Contract.prototype.getState = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.status !== types_1.ContractStatus.Deployed) {
                            return [2 /*return*/, Promise.resolve([])];
                        }
                        if (!this.address) {
                            throw new Error('Cannot get state of uninitialised contract');
                        }
                        return [4 /*yield*/, this.blockchain.getSmartContractState(this.address)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.result];
                }
            });
        });
    };
    Contract.prototype.getSubState = function (variableName, indices) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.status !== types_1.ContractStatus.Deployed) {
                            return [2 /*return*/, Promise.resolve([])];
                        }
                        if (!this.address) {
                            throw new Error('Cannot get state of uninitialised contract');
                        }
                        if (!variableName) {
                            throw new Error('Variable name required');
                        }
                        return [4 /*yield*/, this.blockchain.getSmartContractSubState(this.address, variableName, indices)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.result];
                }
            });
        });
    };
    Contract.prototype.getInit = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.status !== types_1.ContractStatus.Deployed) {
                            return [2 /*return*/, Promise.resolve([])];
                        }
                        if (!this.address) {
                            throw new Error('Cannot get state of uninitialised contract');
                        }
                        return [4 /*yield*/, this.blockchain.getSmartContractInit(this.address)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.result];
                }
            });
        });
    };
    (0, tslib_1.__decorate)([
        core_1.sign,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [account_1.Transaction, Number, Number, Boolean]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], Contract.prototype, "prepareTx", null);
    (0, tslib_1.__decorate)([
        core_1.sign,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [account_1.Transaction]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], Contract.prototype, "prepare", null);
    return Contract;
}());
exports.Contract = Contract;
//# sourceMappingURL=contract.js.map