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
exports.decryptPrivateKey = exports.encryptPrivateKey = void 0;
var tslib_1 = require("tslib");
var aes_js_1 = (0, tslib_1.__importDefault)(require("aes-js"));
var hash_js_1 = (0, tslib_1.__importDefault)(require("hash.js"));
var pbkdf2_1 = require("pbkdf2");
var scrypt_js_1 = (0, tslib_1.__importDefault)(require("scrypt-js"));
var uuid_1 = require("uuid");
var util_1 = require("@zilliqa-js/util");
var random_1 = require("./random");
var util_2 = require("./util");
var ALGO_IDENTIFIER = 'aes-128-ctr';
/**
 * getDerivedKey
 *
 * NOTE: only scrypt and pbkdf2 are supported.
 *
 * @param {Buffer} key - the passphrase
 * @param {KDF} kdf - the key derivation function to be used
 * @param {KDFParams} params - params for the kdf
 *
 * @returns {Promise<Buffer>}
 */
function getDerivedKey(key, kdf, params) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var salt, _a, c, dklen, _b, n, r, p, dklen, derivedKeyInt8Array;
        return (0, tslib_1.__generator)(this, function (_c) {
            salt = Buffer.from(params.salt, 'hex');
            if (kdf === 'pbkdf2') {
                _a = params, c = _a.c, dklen = _a.dklen;
                return [2 /*return*/, (0, pbkdf2_1.pbkdf2Sync)(key, salt, c, dklen, 'sha256')];
            }
            if (kdf === 'scrypt') {
                _b = params, n = _b.n, r = _b.r, p = _b.p, dklen = _b.dklen;
                derivedKeyInt8Array = scrypt_js_1.default.syncScrypt(key, salt, n, r, p, dklen);
                return [2 /*return*/, Buffer.from(derivedKeyInt8Array)];
            }
            throw new Error('Only pbkdf2 and scrypt are supported');
        });
    });
}
/**
 * encryptPrivateKey
 *
 * Encodes and encrypts an account in the format specified by
 * https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition.
 * However, note that, in keeping with the hash function used by Zilliqa's
 * core protocol, the MAC is generated using sha256 instead of keccak.
 *
 * NOTE: only scrypt and pbkdf2 are supported.
 *
 * @param {KDF} kdf - the key derivation function to be used
 * @param {string} privateKey - hex-encoded private key
 * @param {string} passphrase - a passphrase used for encryption
 *
 * @returns {Promise<string>}
 */
var encryptPrivateKey = function (kdf, privateKey, passphrase) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var address, salt, iv, kdfparams, derivedKey, cipher, ciphertext;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                address = (0, util_2.getAddressFromPrivateKey)(privateKey);
                salt = (0, random_1.randomBytes)(32);
                iv = Buffer.from((0, random_1.randomBytes)(16), 'hex');
                kdfparams = {
                    salt: salt,
                    n: 8192,
                    c: 262144,
                    r: 8,
                    p: 1,
                    dklen: 32,
                };
                return [4 /*yield*/, getDerivedKey(Buffer.from(passphrase), kdf, kdfparams)];
            case 1:
                derivedKey = _a.sent();
                cipher = new aes_js_1.default.ModeOfOperation.ctr(derivedKey.slice(0, 16), new aes_js_1.default.Counter(iv));
                ciphertext = Buffer.from(cipher.encrypt(Buffer.from(privateKey, 'hex')));
                return [2 /*return*/, JSON.stringify({
                        address: address,
                        crypto: {
                            cipher: ALGO_IDENTIFIER,
                            cipherparams: {
                                iv: iv.toString('hex'),
                            },
                            ciphertext: ciphertext.toString('hex'),
                            kdf: kdf,
                            kdfparams: kdfparams,
                            mac: hash_js_1.default
                                // @ts-ignore
                                .hmac(hash_js_1.default.sha256, derivedKey, 'hex')
                                .update(Buffer.concat([
                                derivedKey.slice(16, 32),
                                ciphertext,
                                iv,
                                Buffer.from(ALGO_IDENTIFIER),
                            ]), 'hex')
                                .digest('hex'),
                        },
                        id: (0, uuid_1.v4)({ random: util_1.bytes.hexToIntArray((0, random_1.randomBytes)(16)) }),
                        version: 3,
                    })];
        }
    });
}); };
exports.encryptPrivateKey = encryptPrivateKey;
/**
 * decryptPrivateKey
 *
 * Recovers the private key from a keystore file using the given passphrase.
 *
 * @param {string} passphrase
 * @param {KeystoreV3} keystore
 * @returns {Promise<string>}
 */
var decryptPrivateKey = function (passphrase, keystore) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var ciphertext, iv, kdfparams, derivedKey, mac, cipher;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                ciphertext = Buffer.from(keystore.crypto.ciphertext, 'hex');
                iv = Buffer.from(keystore.crypto.cipherparams.iv, 'hex');
                kdfparams = keystore.crypto.kdfparams;
                return [4 /*yield*/, getDerivedKey(Buffer.from(passphrase), keystore.crypto.kdf, kdfparams)];
            case 1:
                derivedKey = _a.sent();
                mac = hash_js_1.default
                    // @ts-ignore
                    .hmac(hash_js_1.default.sha256, derivedKey, 'hex')
                    .update(Buffer.concat([
                    derivedKey.slice(16, 32),
                    ciphertext,
                    iv,
                    Buffer.from(ALGO_IDENTIFIER),
                ]), 'hex')
                    .digest('hex');
                // we need to do a byte-by-byte comparison to avoid non-constant time side
                // channel attacks.
                if (!util_1.bytes.isEqual(mac.toUpperCase(), keystore.crypto.mac.toUpperCase())) {
                    return [2 /*return*/, Promise.reject('Failed to decrypt.')];
                }
                cipher = new aes_js_1.default.ModeOfOperation.ctr(derivedKey.slice(0, 16), new aes_js_1.default.Counter(iv));
                return [2 /*return*/, Buffer.from(cipher.decrypt(ciphertext)).toString('hex')];
        }
    });
}); };
exports.decryptPrivateKey = decryptPrivateKey;
//# sourceMappingURL=keystore.js.map