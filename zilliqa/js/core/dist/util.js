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
exports.composeMiddleware = exports.isValidResponse = void 0;
function isValidResponse(response) {
    if (response.jsonrpc === '2.0' &&
        (response.id === '1' || response.id === 1) &&
        (response.error || response.result)) {
        return true;
    }
    return false;
}
exports.isValidResponse = isValidResponse;
function composeMiddleware() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    if (fns.length === 0) {
        return function (arg) { return arg; };
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return fns.reduce(function (a, b) { return function (arg) { return a(b(arg)); }; });
}
exports.composeMiddleware = composeMiddleware;
//# sourceMappingURL=util.js.map