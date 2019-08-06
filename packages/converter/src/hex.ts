import * as errors from "./errors";

/**
 * Converts TxBytes to a TxHex
 * @param uint8arr
 */
export function hex(uint8arr: Uint8Array | Int8Array): string {
  if (!uint8arr) {
    return "";
  }
  // if (uint8arr.length % 2 !== 0) {
  //   throw new Error(errors.INVALID_TX_HEX);
  // }
  let hexStr = "";
  for (let i = 0; i < uint8arr.length; i++) {
    let hexs = (uint8arr[i] & 0xff).toString(16);
    hexs = hexs.length === 1 ? "0" + hexs : hexs;
    hexStr += hexs;
  }
  return hexStr;
}

/**
 * Converts an integer value to TxBytes
 *
 * @method toBytes
 *
 * @memberof module:converter
 *
 * @param {number} value
 *
 * @param {number} padding
 *Ł
 * @return {TxBytes} bytes
 */

export function toTxBytes(
  value: number | string,
  padding?: number
): Uint8Array {
  if (typeof value === "string") {
    return toTxBytesFromTxHex(value, padding);
  }
  const bitsInByte = 8;
  const size = value
    ? (1 + Math.floor(Math.log(Math.max(1, Math.abs(value))) / Math.log(2))) / 8
    : 0;
  const destination = new Uint8Array(
    padding !== undefined ? Math.max(size, padding) : size
  );
  for (let i = 0; i < size; i++) {
    const shiftNo = bitsInByte * (size - 1 - i);
    destination[i] = (shiftNo > 0 ? value >>> shiftNo : value) & 0xff;
  }
  return destination;
}

/**
 * Converts TxHex into TxBytes
 *
 * @param {TxHex} txs hexadecimal string representation
 *
 * @return {TxBytes} byte array
 */

function toTxBytesFromTxHex(txs: string, padding?: number): Uint8Array {
  if (txs.length % 2 !== 0) {
    throw new Error(errors.INVALID_STRING_LENGTH + txs.length);
  }
  const paddingCt = padding ? padding : 1;
  const result = new Uint8Array(Math.max(paddingCt, txs.length / 2));
  let ct = 0;
  for (let i = 0; i < txs.length; i += 2) {
    result[ct++] = parseInt(txs.substr(i, 2), 16);
  }
  return result;
}
