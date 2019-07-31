import * as errors from "./errors";

/**
 * Converts txHex or values to txBits
 *
 * @method txBits
 *
 * @memberof module:converter
 *
 * @param {TxHex|Number} input - TxHex string or value to be converted.
 *
 * @return {TxBits} txBits
 */
export function txBits(input: string | number): Int8Array {
  if (typeof input === "string") {
    const hBits = new Int8Array(input.length * 4);
    for (let i = 0; i < hBits.length; i++) {
      const ct = Math.floor(i / 4);
      const halfByte = parseInt(input.substr(ct, 1), 16);
      hBits[i] = (halfByte >>> (3 - i % 4)) & 0x01;
    }
    return hBits;
  }
  return fromValue(input);
}

/**
 * Converts txHex to TxBits
 *
 * @method txHexToTxBits
 *
 * @memberof module:converter
 *
 * @ignore
 *
 * @alias txBits
 */
export const txHexToTxBits = txBits;

/**
 * Converts txBits to txHex
 *
 * @method txHex
 *
 * @memberof module:converter
 *
 * @param {Int8Array} hBits
 *
 * @return {String} txHex
 */
export function txHex(hBits: Int8Array | Uint8Array): string {
  if (hBits.length % 4 !== 0) {
    throw new Error(errors.INVALID_HBITS_LENGTH);
  }
  let hexStr = "";

  for (let i = 0; i < hBits.length; i += 4) {
    let val = 0;
    const partHbits = hBits.slice(i, i + 4).reverse();
    for (let j = partHbits.length; j-- > 0; ) {
      val = (val << 1) | (partHbits[j] & 0x01);
    }

    hexStr += (val & 0xff).toString(16);
  }
  return hexStr;
}

/**
 * Converts txBits to txHex
 *
 * @method txBitsToTxHex
 *
 * @memberof module:converter
 *
 * @ignore
 *
 * @alias txHex
 */
export const txBitsToTxHex = txHex;

/**
 * Converts txBits into an integer value
 *
 * @method value
 *
 * @memberof module:converter
 *
 * @param {Int8Array} txBits
 *
 * @return {Number}
 */
// tslint:disable-next-line no-shadowed-variable
export function value(txBits: Int8Array): number {
  const isNegative = txBits[0] === 1;
  let strBits = "";
  for (let i = 0; i < txBits.length; i++) {
    strBits += isNegative ? ~txBits[i] & 0x01 : txBits[i] & 0x01;
  }
  return isNegative ? -1 * (parseInt(strBits, 2) + 1) : parseInt(strBits, 2);
}

/**
 * @method txBitsToValue
 *
 * @memberof module:converter
 *
 * @ignore
 *
 * @alias value
 */
export const txBitsToValue = value;

/**
 * Converts an integer value to txBits
 *
 * @method fromValue
 *
 * @memberof module:converter
 *
 * @param {Number} value
 *
 * @return {Int8Array} txBits
 */
// tslint:disable-next-line no-shadowed-variable
export function fromValue(value: number): Int8Array {
  const isNegative = value < 0;
  const binary = isNegative ? (-value - 1).toString(2) : value.toString(2);
  let destination = new Int8Array(64).fill(isNegative ? 1 : 0);
  for (let i = 0; i < binary.length; i++) {
    destination[i + (64 - binary.length)] = isNegative
      ? ~parseInt(binary[i], 10) & 0x01
      : parseInt(binary[i], 10);
  }
  return destination;
}

/**
 * @method valueToTxBits
 *
 * @memberof module:converter
 *
 * @ignore
 *
 * @alias fromValue
 */
export const valueToTxBits = fromValue;
