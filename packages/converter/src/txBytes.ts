import * as errors from "./errors";

/**
 * Converts TxBytes to word
 *
 * @method bytesToWord
 *
 * @param {TxBytes} bytes
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
 * Converts word to a TxBytes
 *
 * @method wordsToBytes
 *
 * @param {Uint32Array} words
 *
 * @return {TxBytes} toTxBytes
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
