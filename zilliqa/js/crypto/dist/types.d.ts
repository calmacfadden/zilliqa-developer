export declare type KDF = 'pbkdf2' | 'scrypt';
export interface PBKDF2Params {
    salt: string;
    dklen: number;
    c: number;
}
export interface ScryptParams {
    salt: string;
    dklen: number;
    n: number;
    r: number;
    p: number;
}
export declare type KDFParams = PBKDF2Params | ScryptParams;
export interface KeystoreV3 {
    address: string;
    crypto: {
        cipher: string;
        cipherparams: {
            iv: string;
        };
        ciphertext: string;
        kdf: KDF;
        kdfparams: KDFParams;
        mac: string;
    };
    id: string;
    version: 3;
}
//# sourceMappingURL=types.d.ts.map