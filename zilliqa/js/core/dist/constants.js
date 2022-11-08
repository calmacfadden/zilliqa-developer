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
exports.GET_TX_ATTEMPTS = void 0;
// this constant is used to indicate the number of times to poll the
// blockchain for a transaction confirmation. this number has been selected by
// using a heuristic to calculate the approximate maximum amount of time it
// should take for a transaction to be confirmed, even during a PoW submission
// round.
exports.GET_TX_ATTEMPTS = 33;
//# sourceMappingURL=constants.js.map