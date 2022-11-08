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
exports.TransactionError = exports.Signer = void 0;
var Signer = /** @class */ (function () {
    function Signer() {
    }
    return Signer;
}());
exports.Signer = Signer;
var TransactionError;
(function (TransactionError) {
    TransactionError[TransactionError["CHECKER_FAILED"] = 0] = "CHECKER_FAILED";
    TransactionError[TransactionError["RUNNER_FAILED"] = 1] = "RUNNER_FAILED";
    TransactionError[TransactionError["BALANCE_TRANSFER_FAILED"] = 2] = "BALANCE_TRANSFER_FAILED";
    TransactionError[TransactionError["EXECUTE_CMD_FAILED"] = 3] = "EXECUTE_CMD_FAILED";
    TransactionError[TransactionError["EXECUTE_CMD_TIMEOUT"] = 4] = "EXECUTE_CMD_TIMEOUT";
    TransactionError[TransactionError["NO_GAS_REMAINING_FOUND"] = 5] = "NO_GAS_REMAINING_FOUND";
    TransactionError[TransactionError["NO_ACCEPTED_FOUND"] = 6] = "NO_ACCEPTED_FOUND";
    TransactionError[TransactionError["CALL_CONTRACT_FAILED"] = 7] = "CALL_CONTRACT_FAILED";
    TransactionError[TransactionError["CREATE_CONTRACT_FAILED"] = 8] = "CREATE_CONTRACT_FAILED";
    TransactionError[TransactionError["JSON_OUTPUT_CORRUPTED"] = 9] = "JSON_OUTPUT_CORRUPTED";
    TransactionError[TransactionError["CONTRACT_NOT_EXIST"] = 10] = "CONTRACT_NOT_EXIST";
    TransactionError[TransactionError["STATE_CORRUPTED"] = 11] = "STATE_CORRUPTED";
    TransactionError[TransactionError["LOG_ENTRY_INSTALL_FAILED"] = 12] = "LOG_ENTRY_INSTALL_FAILED";
    TransactionError[TransactionError["MESSAGE_CORRUPTED"] = 13] = "MESSAGE_CORRUPTED";
    TransactionError[TransactionError["RECEIPT_IS_NULL"] = 14] = "RECEIPT_IS_NULL";
    TransactionError[TransactionError["MAX_DEPTH_REACHED"] = 15] = "MAX_DEPTH_REACHED";
    TransactionError[TransactionError["CHAIN_CALL_DIFF_SHARD"] = 16] = "CHAIN_CALL_DIFF_SHARD";
    TransactionError[TransactionError["PREPARATION_FAILED"] = 17] = "PREPARATION_FAILED";
    TransactionError[TransactionError["NO_OUTPUT"] = 18] = "NO_OUTPUT";
    TransactionError[TransactionError["OUTPUT_ILLEGAL"] = 19] = "OUTPUT_ILLEGAL";
})(TransactionError = exports.TransactionError || (exports.TransactionError = {}));
//# sourceMappingURL=types.js.map