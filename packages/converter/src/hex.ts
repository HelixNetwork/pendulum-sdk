import * as errors from "./errors";

/**
 * Convert an array of bytes into a hexadecimal string representation of bytes HBytes
 * @param uint8arr
 */
export function hex(uint8arr: Uint8Array | Int8Array): string {
  if (!uint8arr) {
    return "";
  }
  // if (uint8arr.length % 2 !== 0) {
  //   throw new Error(errors.INVALID_HBYTES);
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
 * Converts an integer value to byte array
 *
 * @method toBytes
 *
 * @memberof module:converter
 *
 * @param {number} value
 *
 * @param {number} padding
 *Ł
 * @return {Uint8Array} bytes
 */

export function toHBytes(value: number | string, padding?: number): Uint8Array {
  if (typeof value === "string") {
    return toBytesFromString(value, padding);
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
 * Converts a string (hex representation) into a Uint8Array
 *
 * @param {string} input hexadecimal string representation
 *
 * @return {Uint8Array} byte array
 */

function toBytesFromString(input: string, padding?: number): Uint8Array {
  if (input.length % 2 !== 0) {
    throw new Error(errors.INVALID_STRING_LENGTH);
  }
  const paddingCt = padding ? padding : 1;
  const result = new Uint8Array(Math.max(paddingCt, input.length / 2));
  let ct = 0;
  for (let i = 0; i < input.length; i += 2) {
    result[ct++] = parseInt(input.substr(i, 2), 16);
  }
  return result;
}
