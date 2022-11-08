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
export declare const sign: <T, K extends keyof T>(target: T, key: K, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=sign.d.ts.map