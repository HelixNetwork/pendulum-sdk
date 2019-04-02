import * as errors from "./errors";

/**
 * Converts hbytes or values to hbits
 *
 * @method hbits
 *
 * @memberof module:converter
 *
 * @param {String|Number} input - HByte string or value to be converted.
 *
 * @return {Int8Array} hbits
 */
export function hbits(input: string | number): Int8Array {
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
 * @method hbytesToHBits
 *
 * @memberof module:converter
 *
 * @ignore
 *
 * @alias hbits
 */
export const hbytesToHBits = hbits;

/**
 * Converts hbits to hbytes
 *
 * @method hbytes
 *
 * @memberof module:converter
 *
 * @param {Int8Array} hBits
 *
 * @return {String} hbytes
 */
export function hbytes(hBits: Int8Array | Uint8Array): string {
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
 * @method hBitsToHBytes
 *
 * @memberof module:converter
 *
 * @ignore
 *
 * @alias hbytes
 */
export const hBitsToHBytes = hbytes;

/**
 * Converts hbits into an integer value
 *
 * @method value
 *
 * @memberof module:converter
 *
 * @param {Int8Array} hBits
 *
 * @return {Number}
 */
// tslint:disable-next-line no-shadowed-variable
export function value(hBits: Int8Array): number {
  const isNegative = hBits[0] === 1;
  let strBits = "";
  for (let i = 0; i < hBits.length; i++) {
    strBits += isNegative ? ~hBits[i] & 0x01 : hBits[i] & 0x01;
  }
  return (isNegative ? -1 * (parseInt(strBits, 2) + 1): parseInt(strBits, 2));
}

/**
 * @method hBitsToValue
 *
 * @memberof module:converter
 *
 * @ignore
 *
 * @alias value
 */
export const hBitsToValue = value;

/**
 * Converts an integer value to hbits
 *
 * @method fromValue
 *
 * @memberof module:converter
 *
 * @param {Number} value
 *
 * @return {Int8Array} hbits
 */
// tslint:disable-next-line no-shadowed-variable
export function fromValue(value: number): Int8Array {
  const isNegative = value < 0;
  const binary = isNegative? (-value-1).toString(2): value.toString(2);
  let destination = new Int8Array(64).fill(isNegative? 1: 0);
  for (let i = 0; i < binary.length; i++) {
    destination[i + (64 - binary.length)] = isNegative ?
    ~parseInt(binary[i], 10) & 0x01
    : parseInt(binary[i], 10);
  }
  return destination;
}

/**
 * @method valueToHBits
 *
 * @memberof module:converter
 *
 * @ignore
 *
 * @alias fromValue
 */
export const valueToHBits = fromValue;
