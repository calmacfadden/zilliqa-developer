import { KeystoreV3, KDF } from './types';
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
export declare const encryptPrivateKey: (kdf: KDF, privateKey: string, passphrase: string) => Promise<string>;
/**
 * decryptPrivateKey
 *
 * Recovers the private key from a keystore file using the given passphrase.
 *
 * @param {string} passphrase
 * @param {KeystoreV3} keystore
 * @returns {Promise<string>}
 */
export declare const decryptPrivateKey: (passphrase: string, keystore: KeystoreV3) => Promise<string>;
//# sourceMappingURL=keystore.d.ts.map