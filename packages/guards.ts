import {
  ADDRESS_CHECKSUM_HEX_SIZE,
  ADDRESS_HEX_SIZE,
  HASH_TX_HEX_SIZE,
  MAX_INDEX_DIFF,
  TAG_HEX_SIZE
} from "./constants";
import * as errors from "./errors";
import { Address, Hash, Tag, Transfer, TxHex } from "./types";

// Required for markdown generation with JSDoc
/**
 * @module validators
 */

/* Type guards */

/**
 * Checks if input is correct txs consisting of [9A-Z]; optionally validate length
 * @method isTxHex
 *
 * @param {string} txs
 * @param {string | number} [length='1,']
 *
 * @return {boolean}
 */
export const isTxHex = (
  txs: string,
  length: string | number = "1,"
): txs is TxHex =>
  typeof txs === "string" && new RegExp(`^[0-9a-f]{${length}}$`).test(txs);
/**
 * @method isTxHexOfExactLength
 *
 * @param {string} txs
 * @param {number} length
 *
 * @return {boolean}
 */
export const isTxHexOfExactLength = (txs: string, length: number) =>
  typeof txs === "string" && new RegExp(`^[0-9a-f]{${length}}$`).test(txs);

/**
 * @method isTxHexOfMaxLength
 *
 * @param {string} txs
 * @param {number} length
 *
 * @return {boolean}
 */
export const isTxHexOfMaxLength = (txs: string, length: number) =>
  typeof txs === "string" && new RegExp(`^[0-9a-f]{1,${length}}$`).test(txs);

/**
 * Checks if input contains `0`s only.
 * @method isEmpty
 *
 * @param {string} hash
 *
 * @return {boolean}
 */
export const isEmpty = (txs: any): txs is TxHex =>
  typeof txs === "string" && /^[00]+$/.test(txs);

/**
 * Checks if input contains `0`s only.
 * @method isEmptyBytes
 *
 * @param {Uint8Array} bytes
 *
 * @return {boolean}
 */
export const isEmptyBytes = (bytes: Uint8Array) => {
  let isValid = true;
  bytes.forEach(val => (isValid = isValid && val === 0));
  return isValid;
};

export const isNinesTxHex = isEmpty;

/**
 * Checks if input is correct hash (81 txs) or address with checksum (90 txs)
 *
 * @method isHash
 *
 * @param {string} hash
 *
 * @return {boolean}
 */
export const isHash = (hash: any): hash is Hash =>
  isTxHexOfExactLength(hash, HASH_TX_HEX_SIZE) ||
  isTxHexOfExactLength(hash, HASH_TX_HEX_SIZE + ADDRESS_CHECKSUM_HEX_SIZE);
/**
 * Checks if input is correct address or address with checksum (90 txs)
 *
 * @method isAddress
 *
 * @param {string} hash
 *
 * @return {boolean}
 */
export const isAddress = (hash: any): hash is Hash =>
  isTxHexOfExactLength(hash, ADDRESS_HEX_SIZE) ||
  isTxHexOfExactLength(hash, ADDRESS_HEX_SIZE + ADDRESS_CHECKSUM_HEX_SIZE); // address w/ checksum is valid hash

/* Check if security level is valid positive integer */
export const isSecurityLevel = (security: any): security is number =>
  Number.isInteger(security) && security > 0 && security < 4;

/**
 * Checks if input is valid input object. Address can be passed with or without checksum.
 * It does not validate the checksum.
 *
 * @method isInput
 *
 * @param {string} address
 *
 * @return {boolean}
 */
export const isInput = (input: any): input is Address => {
  return (
    isAddress(input.address) &&
    isSecurityLevel(input.security) &&
    (typeof input.balance === "undefined" ||
      (Number.isInteger(input.balance) && input.balance > 0)) &&
    Number.isInteger(input.keyIndex) &&
    input.keyIndex >= 0
  );
};

/**
 * Checks that input is valid tag txs.
 *
 * @method isTag
 *
 * @param {string} tag
 *
 * @return {boolean}
 */
export const isTag = (tag: any): tag is Tag =>
  isTxHexOfMaxLength(tag, TAG_HEX_SIZE);

/**
 * Checks if input is valid `transfer` object.
 *
 * @method isTransfer
 *
 * @param {Transfer} transfer
 *
 * @return {boolean}
 */
export const isTransfer = (transfer: Transfer): transfer is Transfer =>
  isAddress(transfer.address) &&
  Number.isInteger(transfer.value) &&
  transfer.value >= 0 &&
  (!transfer.message || isTxHex(transfer.message, "0,")) &&
  (!transfer.tag || isTag(transfer.tag));

/**
 * Checks that a given `URI` is valid
 *
 * Valid Examples:
 * - `udp://[2001:db8:a0b:12f0::1]:14265`
 * - `udp://[2001:db8:a0b:12f0::1]`
 * - `udp://8.8.8.8:14265`
 * - `udp://domain.com`
 * - `udp://domain2.com:14265`
 *
 * @method isUri
 *
 * @param {string} uri
 *
 * @return {boolean}
 */
export const isUri = (uri: any): uri is TxHex => {
  if (typeof uri !== "string") {
    return false;
  }

  const getInside = /^(udp|tcp):\/\/([\[][^\]\.]*[\]]|[^\[\]:]*)[:]{0,1}([0-9]{1,}$|$)/i;

  const stripBrackets = /[\[]{0,1}([^\[\]]*)[\]]{0,1}/;

  const uriTest = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))|(^\s*((?=.{1,255}$)(?=.*[A-Za-z].*)[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?)*)\s*$)/;

  return (
    getInside.test(uri) &&
    uriTest.test(stripBrackets.exec(getInside.exec(uri)![1])![1])
  );
};

/* Check if start & end options are valid */
export const isStartEndOptions = ({
  start,
  end
}: {
  start: number;
  end: number;
}): boolean => !end || (start <= end && end < start + MAX_INDEX_DIFF);

/* Checks all array items */
export const isArray = (f: (x: any) => boolean) => (x: ReadonlyArray<any>) =>
  Array.isArray(x) && x.length > 0 && x.every(y => f(y));

/* Validators */

export type Validatable<T = any> = [T, (x: T) => boolean, string];

export type Validator<T> = (x: T, err?: string) => Validatable<T>;

/**
 * Runs each validator in sequence, and throws on the first occurence of invalid data.
 * Validators are passed as arguments and executed in given order.
 * You might want place `validate()` in promise chains before operations that require valid inputs,
 * taking advantage of built-in promise branching.
 *
 * @example
 *
 * ```js
 * try {
 *   validate([
 *     value, // Given value
 *     isTxHex, // Validator function
 *     'Invalid txs' // Error message
 *   ])
 * } catch (err) {
 *   console.log(err.message) // 'Invalid txs'
 * }
 * ```
 *
 * @method validate
 *
 * @throws {Error} error
 * @return {boolean}
 */
export const validate = (...validators: Array<Validatable | false>) => {
  validators.forEach(validator => {
    if (Array.isArray(validator)) {
      const [value, isValid, msg] = validator;

      if (!isValid(value)) {
        throw new Error(`${msg}: ${value}`);
      }
    }
  });

  return true;
};

export const arrayValidator = <T>(
  validator: Validator<T>,
  allowEmpty = false
): Validator<ReadonlyArray<T>> => (
  arr: ReadonlyArray<any>,
  customMsg?: string
) => {
  const [_, isValid, msg] = validator(arr[0]);

  return [
    arr,
    (x: ReadonlyArray<any>): x is ReadonlyArray<T> =>
      Array.isArray(x) && x.every(value => isValid(value)),
    customMsg || msg
  ];
};

export const depthValidator: Validator<number> = depth => [
  depth,
  n => Number.isInteger(n) && n > 0,
  errors.INVALID_DEPTH
];

export const minWeightMagnitudeValidator: Validator<
  number
> = minWeightMagnitude => [
  minWeightMagnitude,
  Number.isInteger,
  errors.INVALID_MIN_WEIGHT_MAGNITUDE
];

export const seedValidator: Validator<string> = seed => [
  seed,
  isTxHex,
  errors.INVALID_SEED
];

export const securityLevelValidator: Validator<number> = security => [
  security,
  isSecurityLevel,
  errors.INVALID_SECURITY_LEVEL
];

export const inputValidator: Validator<Address> = input => [
  input,
  isInput,
  errors.INVALID_INPUT
];

export const remainderAddressValidator: Validator<string> = input => [
  input,
  isAddress,
  errors.INVALID_REMAINDER_ADDRESS
];

export const addressValidator: Validator<string> = input => [
  input,
  isAddress,
  errors.INVALID_ADDRESS
];

export const tagValidator: Validator<string> = tag => [
  tag,
  isTag,
  errors.INVALID_TAG
];

export const transferValidator: Validator<Transfer> = transfer => [
  transfer,
  isTransfer,
  errors.INVALID_TRANSFER
];

export const hashValidator: Validator<Hash> = hash => [
  hash,
  isHash,
  errors.INVALID_HASH
];

export const txHexValidator: Validator<TxHex> = (txs, msg?: string) => [
  txs,
  isTxHex,
  msg || errors.INVALID_TX_HEX
];

export const uriValidator: Validator<string> = uri => [
  uri,
  isUri,
  errors.INVALID_URI
];

export const integerValidator: Validator<number> = (integer, msg?: string) => [
  integer,
  Number.isInteger,
  msg || errors.NOT_INT
];

export const indexValidator: Validator<number> = index => [
  index,
  Number.isInteger,
  errors.INVALID_INDEX
];

export const startOptionValidator: Validator<number> = start => [
  start,
  s => Number.isInteger(s) && s >= 0,
  errors.INVALID_START_OPTION
];

export const startEndOptionsValidator: Validator<any> = options => [
  options,
  isStartEndOptions,
  errors.INVALID_START_END_OPTIONS
];

export const getInputsThresholdValidator: Validator<number> = threshold => [
  threshold,
  s => Number.isInteger(s) && s >= 0,
  errors.INVALID_THRESHOLD
];

export const getBalancesThresholdValidator: Validator<number> = threshold => [
  threshold,
  t => Number.isInteger(t) && t <= 100,
  errors.INVALID_THRESHOLD
];
