/// <reference types="node" />
export declare const encode: (hrp: string, data: Buffer) => string;
export declare const decode: (bechString: string) => {
    hrp: string;
    data: Buffer;
} | null;
export declare const HRP = "zil";
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
export declare const convertBits: (data: Buffer, fromWidth: number, toWidth: number, pad?: boolean) => Buffer | null;
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
export declare const toBech32Address: (address: string) => string;
/**
 * fromBech32Address
 *
 * @param {string} address - a valid Zilliqa bech32 address
 * @returns {string} a canonical 20-byte Ethereum-style address
 */
export declare const fromBech32Address: (address: string) => string;
//# sourceMappingURL=bech32.d.ts.map