/*!
 * schnorr.js - schnorr signatures for bcoin
 * Copyright (c) 2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */
/// <reference types="node" />
import { BN } from '@zilliqa-js/util';
import { Signature } from '.';
/**
 * generatePrivateKey
 *
 * @returns {string} - the hex-encoded private key
 */
export declare const generatePrivateKey: () => string;
/**
 * Hash (r | M).
 * @param {Buffer} msg
 * @param {BN} r
 *
 * @returns {Buffer}
 */
export declare const hash: (q: BN, pubkey: Buffer, msg: Buffer) => BN;
/**
 * sign
 *
 * @param {Buffer} msg
 * @param {Buffer} key
 * @param {Buffer} pubkey
 *
 * @returns {Signature}
 */
export declare const sign: (msg: Buffer, privKey: Buffer, pubKey: Buffer) => Signature;
/**
 * trySign
 *
 * @param {Buffer} msg - the message to sign over
 * @param {BN} k - output of the HMAC-DRBG
 * @param {BN} privateKey - the private key
 * @param {Buffer} pubKey - the public key
 *
 * @returns {Signature | null =>}
 */
export declare const trySign: (msg: Buffer, k: BN, privKey: BN, pubKey: Buffer) => Signature | null;
/**
 * Verify signature.
 *
 * @param {Buffer} msg
 * @param {Buffer} signature
 * @param {Buffer} key
 *
 * @returns {boolean}
 *
 * 1. Check if r,s is in [1, ..., order-1]
 * 2. Compute Q = sG + r*kpub
 * 3. If Q = O (the neutral point), return 0;
 * 4. r' = H(Q, kpub, m)
 * 5. return r' == r
 */
export declare const verify: (msg: Buffer, signature: Signature, key: Buffer) => boolean;
export declare const toSignature: (serialised: string) => Signature;
//# sourceMappingURL=schnorr.d.ts.map