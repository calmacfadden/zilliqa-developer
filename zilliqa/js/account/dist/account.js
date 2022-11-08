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
exports.Account = void 0;
var tslib_1 = require("tslib");
var zcrypto = (0, tslib_1.__importStar)(require("@zilliqa-js/crypto"));
var Account = /** @class */ (function () {
    function Account(privateKey) {
        this.privateKey = this.normalizePrivateKey(privateKey);
        this.publicKey = zcrypto.getPubKeyFromPrivateKey(this.privateKey);
        this.address = zcrypto.getAddressFromPublicKey(this.publicKey);
        this.bech32Address = zcrypto.toBech32Address(this.address);
    }
    /**
     * fromFile
     *
     * Takes a JSON-encoded keystore and passphrase, returning a fully
     * instantiated Account instance.
     *
     * @param {string} file
     * @param {string} passphrase
     * @returns {Promise<Account>}
     */
    Account.fromFile = function (file, passphrase) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var keystore, privateKey, err_1;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        keystore = JSON.parse(file);
                        return [4 /*yield*/, zcrypto.decryptPrivateKey(passphrase, keystore)];
                    case 1:
                        privateKey = _a.sent();
                        return [2 /*return*/, new Account(privateKey)];
                    case 2:
                        err_1 = _a.sent();
                        throw new Error("Could not decrypt keystore file.");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * toFile
     *
     * @param {string} passphrase
     * @param {kdf} 'pbkdf2' | 'scrypt'
     * @returns {Promise<string>}
     */
    Account.prototype.toFile = function (passphrase, kdf) {
        if (kdf === void 0) { kdf = 'scrypt'; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var keystore;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!passphrase || !passphrase.length) {
                            throw new Error('Passphrase cannot have a length of 0');
                        }
                        return [4 /*yield*/, zcrypto.encryptPrivateKey(kdf, this.privateKey, passphrase)];
                    case 1:
                        keystore = _a.sent();
                        return [2 /*return*/, keystore];
                }
            });
        });
    };
    /**
     * signTransaction
     *
     * @param {Buffer} bytes - the data to be signed
     *
     * @returns {string} - the hex encoded signature. it is a concatenation of
     * the r and s values in hex, each padded to a length of 64.
     */
    Account.prototype.signTransaction = function (bytes) {
        return zcrypto.sign(bytes, this.privateKey, this.publicKey);
    };
    Account.prototype.normalizePrivateKey = function (privateKey) {
        return zcrypto.normalizePrivateKey(privateKey);
    };
    return Account;
}());
exports.Account = Account;
//# sourceMappingURL=account.js.map