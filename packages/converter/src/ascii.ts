import { hex, toTxBytes } from "./";
import * as errors from "./errors";

/**
 * Converts an ascii encoded string to txs.
 *
 * ### How conversion works:
 *
 * An ascii value of `1 Byte` can be represented in `2 TxHex`:
 *
 * 1. We get the decimal unicode value of an individual ASCII character this code can be represented in a Byte
 *
 * 2. Decimal value is then converted into hexadecimal value
 *
 * ### Example:
 *
 * Lets say we want to convert ascii character `Z`.
 *
 * 1. `Z` has a decimal unicode value of `90`.
 *
 * 2. `90` in hexadecimal is 5a
 *
 * Therefore ascii character `Z` is represented as `IC` in 5a.
 *
 * @method asciiToTxHex
 *
 * @memberof module:converter
 *
 * @param {string} input - ascii input
 *
 * @return {string} string of TxHex
 */
export const asciiToTxHex = (input: string): string => {
  // If input is not an ascii string, throw error
  if (!/^[\x00-\x7f]*$/.test(input)) {
    throw new Error(errors.INVALID_ASCII_CHARS);
  }

  const txBytes = new Uint8Array(input.length);
  for (let i = 0; i < input.length; i++) {
    txBytes[i] = input[i].charCodeAt(0);
  }
  return hex(txBytes);
};

/**
 * Converts TxHex to ascii string
 *
 * @method txsToAscii
 *
 * @memberof module:converter
 *
 * @param {string} txs - txs
 *
 * @return {string} string in ascii
 */
export const txsToAscii = (txs: string): string => {
  if (typeof txs !== "string" || !new RegExp(`^[0-9abcdef]{1,}$`).test(txs)) {
    throw new Error(errors.INVALID_TX_HEX);
  }

  if (txs.length % 2) {
    throw new Error(errors.INVALID_ODD_LENGTH);
  }

  let ascii = "";

  const txBytes = toTxBytes(txs);
  for (let i = 0; i < txBytes.length; i++) {
    ascii += String.fromCharCode(txBytes[i]);
  }

  return ascii;
};
