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
exports.TransactionFactory = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@zilliqa-js/core");
var transaction_1 = require("./transaction");
var types_1 = require("./types");
var util_1 = require("./util");
var util_2 = require("@zilliqa-js/util");
var TransactionFactory = /** @class */ (function () {
    function TransactionFactory(provider, signer) {
        this.provider = provider;
        this.provider.middleware.request.use(util_1.formatOutgoingTx, core_1.RPCMethod.CreateTransaction);
        this.signer = signer;
    }
    TransactionFactory.prototype.new = function (txParams, toDs, enableSecureAddress) {
        if (toDs === void 0) { toDs = false; }
        if (enableSecureAddress === void 0) { enableSecureAddress = true; }
        return new transaction_1.Transaction(txParams, this.provider, types_1.TxStatus.Initialised, toDs, enableSecureAddress);
    };
    /**
     * This constructor could help you to check if there is a default account to be used, and further more, if it has
     * sufficient fund to do the transfer.
     * @param txParams
     */
    TransactionFactory.prototype.payment = function (txParams) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var defaultAccount, addr, response, fund;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultAccount = this.signer.defaultAccount;
                        if (!(defaultAccount !== undefined)) return [3 /*break*/, 2];
                        addr = defaultAccount.address;
                        return [4 /*yield*/, this.provider.send(core_1.RPCMethod.GetBalance, addr.replace('0x', '').toLowerCase())];
                    case 1:
                        response = _a.sent();
                        if (response.error) {
                            throw response.error;
                        }
                        fund = new util_2.BN(response.result.balance);
                        if (txParams.amount.cmp(fund) === 1) {
                            throw new Error('No sufficient fund');
                        }
                        return [3 /*break*/, 3];
                    case 2: throw new Error('No default wallet');
                    case 3: return [2 /*return*/, this.new(txParams, true)];
                }
            });
        });
    };
    return TransactionFactory;
}());
exports.TransactionFactory = TransactionFactory;
//# sourceMappingURL=transactionFactory.js.map