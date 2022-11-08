/// <reference types="node" />
export declare class Account {
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
    static fromFile(file: string, passphrase: string): Promise<Account>;
    privateKey: string;
    publicKey: string;
    address: string;
    bech32Address: string;
    constructor(privateKey: string);
    /**
     * toFile
     *
     * @param {string} passphrase
     * @param {kdf} 'pbkdf2' | 'scrypt'
     * @returns {Promise<string>}
     */
    toFile(passphrase: string, kdf?: 'pbkdf2' | 'scrypt'): Promise<string>;
    /**
     * signTransaction
     *
     * @param {Buffer} bytes - the data to be signed
     *
     * @returns {string} - the hex encoded signature. it is a concatenation of
     * the r and s values in hex, each padded to a length of 64.
     */
    signTransaction(bytes: Buffer): string;
    private normalizePrivateKey;
}
//# sourceMappingURL=account.d.ts.map