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
exports.Zilliqa = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@zilliqa-js/core");
var account_1 = require("@zilliqa-js/account");
var contract_1 = require("@zilliqa-js/contract");
var blockchain_1 = require("@zilliqa-js/blockchain");
var subscriptions_1 = require("@zilliqa-js/subscriptions");
(0, tslib_1.__exportStar)(require("@zilliqa-js/util"), exports);
(0, tslib_1.__exportStar)(require("@zilliqa-js/crypto"), exports);
(0, tslib_1.__exportStar)(require("@zilliqa-js/subscriptions"), exports);
var Zilliqa = /** @class */ (function () {
    function Zilliqa(node, provider) {
        this.provider = provider || new core_1.HTTPProvider(node);
        this.wallet = new account_1.Wallet(this.provider);
        this.blockchain = new blockchain_1.Blockchain(this.provider, this.wallet);
        this.network = new blockchain_1.Network(this.provider, this.wallet);
        this.contracts = new contract_1.Contracts(this.provider, this.wallet);
        this.transactions = new account_1.TransactionFactory(this.provider, this.wallet);
        this.subscriptionBuilder = new subscriptions_1.SubscriptionBuilder();
    }
    return Zilliqa;
}());
exports.Zilliqa = Zilliqa;
//# sourceMappingURL=index.js.map