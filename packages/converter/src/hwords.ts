import * as errors from "./errors";

/**
 * Converts the given toHBytes to word array
 *
 * @method bytesToWord
 *
 * @param {Uint8Array} bytes
 *
 * @return {Uint32Array} words
 */

export function bytesToWords(bytes: Uint8Array | Int8Array): Uint32Array {
  if (bytes.length % 4 !== 0) {
    throw new Error(errors.INVALID_ODD_LENGTH);
  }
  const size = bytes.length / 4;
  const result = new Uint32Array(size);

  for (let i = 0; i < size; i++) {
    const offset = i * 4;
    result[i] =
      (bytes[offset] & 0xff) * 0x1000000 +
      (((bytes[offset + 1] & 0xff) << 16) |
        ((bytes[offset + 2] & 0xff) << 8) |
        (bytes[offset + 3] & 0xff));
  }
  return result;
}

/**
 * Converts the given byte array to toHBytes
 *
 * @method wordsToBytes
 *
 * @param {Uint32Array} words
 *
 * @return {Uint8Array} toHBytes
 */
export function wordsToBytes(words: Uint32Array): Uint8Array {
  const size = words.length;
  const bytes = new Uint8Array(size * 4);

  for (let i = 0; i < size; i++) {
    const offset = i * 4;
    const value = words[i];
    bytes[offset] = value >>> 24;
    bytes[offset + 1] = (value >>> 16) & 0xff;
    bytes[offset + 2] = (value >>> 8) & 0xff;
    bytes[offset + 3] = value & 0xff;
  }
  return bytes;
}

export function longToBytes(value: number): Uint8Array {
  const bytes = new Uint8Array(8);
  const valueLow = value / Math.pow(2, 32);
  const valueHigh = value;
  for (let i = 0; i < 4; i++) {
    const shiftNo = 8 * (8 - i - 1);
    bytes[i] = (valueLow >>> shiftNo) & 0xff;
  }
  for (let i = 4; i < 8; i++) {
    const shiftNo = 8 * (8 - i - 1);
    bytes[i] = (valueHigh >>> shiftNo) & 0xff;
  }
  return bytes;
}
