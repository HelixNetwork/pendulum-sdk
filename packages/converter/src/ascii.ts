import { hex, toTxBytes } from "./";
import * as errors from "./errors";

/**
 * Converts an ascii encoded string to hbytes.
 *
 * ### How conversion works:
 *
 * An ascii value of `1 Byte` can be represented in `2 HBytes`:
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
 * @method txHexToAscii
 *
 * @memberof module:converter
 *
 * @param {string} txHex - txHex
 *
 * @return {string} string in ascii
 */
export const txHexToAscii = (txHex: string): string => {
  if (
    typeof txHex !== "string" ||
    !new RegExp(`^[0-9abcdef]{1,}$`).test(txHex)
  ) {
    throw new Error(errors.INVALID_TX_HEX);
  }

  if (txHex.length % 2) {
    throw new Error(errors.INVALID_ODD_LENGTH);
  }

  let ascii = "";

  const txBytes = toTxBytes(txHex);
  for (let i = 0; i < txBytes.length; i++) {
    ascii += String.fromCharCode(txBytes[i]);
  }

  return ascii;
};
