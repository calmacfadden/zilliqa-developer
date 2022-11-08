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
exports.toTxParams = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@zilliqa-js/core");
var crypto_1 = require("@zilliqa-js/crypto");
var util_1 = require("@zilliqa-js/util");
function toTxParams(response) {
    var _a = response.result, toAddr = _a.toAddr, senderPubKey = _a.senderPubKey, gasPrice = _a.gasPrice, gasLimit = _a.gasLimit, nonce = _a.nonce, amount = _a.amount, receipt = _a.receipt, version = _a.version, code = _a.code, data = _a.data, rest = (0, tslib_1.__rest)(_a, ["toAddr", "senderPubKey", "gasPrice", "gasLimit", "nonce", "amount", "receipt", "version", "code", "data"]);
    var msg = receipt.errors
        ? Object.keys(receipt.errors).reduce(function (acc, depth) {
            var _a;
            var errorMsgList = receipt.errors[depth].map(function (num) { return core_1.TransactionError[num]; });
            return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, acc), (_a = {}, _a[depth] = errorMsgList, _a));
        }, {})
        : {};
    return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), { version: parseInt(version, 10), toAddr: (0, crypto_1.toChecksumAddress)(toAddr), pubKey: senderPubKey.replace('0x', ''), gasPrice: new util_1.BN(gasPrice), gasLimit: util_1.Long.fromString(gasLimit, 10), amount: new util_1.BN(amount), nonce: parseInt(nonce, 10), code: code, data: data, receipt: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, receipt), { accepted: receipt.accepted, errors: msg, cumulative_gas: parseInt(receipt.cumulative_gas, 10) }) });
}
exports.toTxParams = toTxParams;
//# sourceMappingURL=util.js.map