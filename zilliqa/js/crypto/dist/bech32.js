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
exports.fromBech32Address = exports.toBech32Address = exports.convertBits = exports.HRP = exports.decode = exports.encode = void 0;
var util_1 = require("@zilliqa-js/util");
var util_2 = require("./util");
// This code is taken from https://github.com/sipa/bech32/tree/bdc264f84014c234e908d72026b7b780122be11f/ref/javascript
// Copyright (c) 2017 Pieter Wuille
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
var GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
var polymod = function (values) {
    var chk = 1;
    for (var p = 0; p < values.length; ++p) {
        var top_1 = chk >> 25;
        chk = ((chk & 0x1ffffff) << 5) ^ values[p];
        for (var i = 0; i < 5; ++i) {
            if ((top_1 >> i) & 1) {
                chk ^= GENERATOR[i];
            }
        }
    }
    return chk;
};
var hrpExpand = function (hrp) {
    var ret = [];
    var p;
    for (p = 0; p < hrp.length; ++p) {
        ret.push(hrp.charCodeAt(p) >> 5);
    }
    ret.push(0);
    for (p = 0; p < hrp.length; ++p) {
        ret.push(hrp.charCodeAt(p) & 31);
    }
    return Buffer.from(ret);
};
function verifyChecksum(hrp, data) {
    return polymod(Buffer.concat([hrpExpand(hrp), data])) === 1;
}
function createChecksum(hrp, data) {
    var values = Buffer.concat([
        Buffer.from(hrpExpand(hrp)),
        data,
        Buffer.from([0, 0, 0, 0, 0, 0]),
    ]);
    // var values = hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
    var mod = polymod(values) ^ 1;
    var ret = [];
    for (var p = 0; p < 6; ++p) {
        ret.push((mod >> (5 * (5 - p))) & 31);
    }
    return Buffer.from(ret);
}
var encode = function (hrp, data) {
    var combined = Buffer.concat([data, createChecksum(hrp, data)]);
    var ret = hrp + '1';
    for (var p = 0; p < combined.length; ++p) {
        ret += CHARSET.charAt(combined[p]);
    }
    return ret;
};
exports.encode = encode;
var decode = function (bechString) {
    var p;
    var hasLower = false;
    var hasUpper = false;
    for (p = 0; p < bechString.length; ++p) {
        if (bechString.charCodeAt(p) < 33 || bechString.charCodeAt(p) > 126) {
            return null;
        }
        if (bechString.charCodeAt(p) >= 97 && bechString.charCodeAt(p) <= 122) {
            hasLower = true;
        }
        if (bechString.charCodeAt(p) >= 65 && bechString.charCodeAt(p) <= 90) {
            hasUpper = true;
        }
    }
    if (hasLower && hasUpper) {
        return null;
    }
    bechString = bechString.toLowerCase();
    var pos = bechString.lastIndexOf('1');
    if (pos < 1 || pos + 7 > bechString.length || bechString.length > 90) {
        return null;
    }
    var hrp = bechString.substring(0, pos);
    var data = [];
    for (p = pos + 1; p < bechString.length; ++p) {
        var d = CHARSET.indexOf(bechString.charAt(p));
        if (d === -1) {
            return null;
        }
        data.push(d);
    }
    if (!verifyChecksum(hrp, Buffer.from(data))) {
        return null;
    }
    return { hrp: hrp, data: Buffer.from(data.slice(0, data.length - 6)) };
};
exports.decode = decode;
// HRP is the human-readable part of zilliqa bech32 addresses
exports.HRP = 'zil';
/**
 * convertBits
 *
 * groups buffers of a certain width to buffers of the desired width.
 *
 * For example, converts byte buffers to buffers of maximum 5 bit numbers,
 * padding those numbers as necessary. Necessary for encoding Ethereum-style
 * addresses as bech32 ones.
 *
 * @param {Buffer} data
 * @param {number} fromWidth
 * @param {number} toWidth
 * @param {boolean} pad
 * @returns {Buffer|null}
 */
var convertBits = function (data, fromWidth, toWidth, pad) {
    if (pad === void 0) { pad = true; }
    var acc = 0;
    var bits = 0;
    var ret = [];
    var maxv = (1 << toWidth) - 1;
    for (var p = 0; p < data.length; ++p) {
        var value = data[p];
        if (value < 0 || value >> fromWidth !== 0) {
            return null;
        }
        acc = (acc << fromWidth) | value;
        bits += fromWidth;
        while (bits >= toWidth) {
            bits -= toWidth;
            ret.push((acc >> bits) & maxv);
        }
    }
    if (pad) {
        if (bits > 0) {
            ret.push((acc << (toWidth - bits)) & maxv);
        }
    }
    else if (bits >= fromWidth || (acc << (toWidth - bits)) & maxv) {
        return null;
    }
    return Buffer.from(ret);
};
exports.convertBits = convertBits;
/**
 * toBech32Address
 *
 * Encodes a canonical 20-byte Ethereum-style address as a bech32 zilliqa
 * address.
 *
 * The expected format is zil1<address><checksum> where address and checksum
 * are the result of bech32 encoding a Buffer containing the address bytes.
 *
 * @param {string} 20 byte canonical address
 * @returns {string} 38 char bech32 encoded zilliqa address
 */
var toBech32Address = function (address) {
    if (!util_1.validation.isAddress(address)) {
        throw new Error('Invalid address format.');
    }
    var addrBz = (0, exports.convertBits)(Buffer.from(address.replace('0x', ''), 'hex'), 8, 5);
    if (addrBz === null) {
        throw new Error('Could not convert byte Buffer to 5-bit Buffer');
    }
    return (0, exports.encode)(exports.HRP, addrBz);
};
exports.toBech32Address = toBech32Address;
/**
 * fromBech32Address
 *
 * @param {string} address - a valid Zilliqa bech32 address
 * @returns {string} a canonical 20-byte Ethereum-style address
 */
var fromBech32Address = function (address) {
    var res = (0, exports.decode)(address);
    if (res === null) {
        throw new Error('Invalid bech32 address');
    }
    var hrp = res.hrp, data = res.data;
    var shouldBe = exports.HRP;
    if (hrp !== shouldBe) {
        throw new Error("Expected hrp to be " + shouldBe + " but got " + hrp);
    }
    var buf = (0, exports.convertBits)(data, 5, 8, false);
    if (buf === null) {
        throw new Error('Could not convert buffer to bytes');
    }
    return (0, util_2.toChecksumAddress)(buf.toString('hex'));
};
exports.fromBech32Address = fromBech32Address;
//# sourceMappingURL=bech32.js.map