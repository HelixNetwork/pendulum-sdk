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
 * @return {Int8Array} hbitsŁ
 */
export function hbits(input: string | number): Int8Array {
  let hbits;
  if (typeof input === "string") {
    hbits = new Int8Array(input.length * 4);
    for (let i = 0; i < hbits.length; i++) {
      let ct = Math.floor(i / 4);
      let halfByte = parseInt(input.substr(ct, 1), 16);
      //hbits[i] = ( halfByte >>>  i % 4) & 0x01;
      hbits[i] = (halfByte >>> (3 - i % 4)) & 0x01;
    }
    return hbits;
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
 * @param {Int8Array} trits
 *
 * @return {String} hbytes
 */
export function hbytes(hbits: Int8Array): string {
  if (hbits.length % 4 !== 0) {
    throw new Error(errors.INVALID_HBITS_LENGTH);
  }
  let hexStr = "";

  for (let i = 0; i < hbits.length; i += 4) {
    const val = value(hbits.slice(i, i + 4).reverse());
    const hex = (val & 0xff).toString(16);
    hexStr += hex;
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
 * @param {Int8Array} hbits
 *
 * @return {Number}
 */
// tslint:disable-next-line no-shadowed-variable
export function value(hbits: Int8Array): number {
  let returnValue = 0;
  for (let i = hbits.length; i-- > 0; ) {
    returnValue = (returnValue << 1) | (hbits[i] & 0x01);
  }

  return returnValue;
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
  const binary = (value >>> 0)
    .toString(2)
    .split("")
    .reverse();
  const destination = new Int8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    destination[i] = parseInt(binary[i], 10);
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
