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
exports.sign = void 0;
var tslib_1 = require("tslib");
/**
 * sign
 *
 * This decorates a method by attempting to sign the first argument of the
 * intercepted method.
 *
 * @param {T} target
 * @param {K} key
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor | undefined}
 */
var sign = function (target, key, descriptor) {
    var original = descriptor.value;
    function interceptor(arg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var signed;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(original && arg.bytes)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.signer.sign(arg)];
                    case 1:
                        signed = _a.sent();
                        return [2 /*return*/, original.call.apply(original, (0, tslib_1.__spreadArray)([this, signed], (0, tslib_1.__read)(args), false))];
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    descriptor.value = interceptor;
    return descriptor;
};
exports.sign = sign;
//# sourceMappingURL=sign.js.map