/* tslint:disable variable-name no-conditional-assignment */
import * as CryptoJS from "crypto-js";
import * as errors from "./errors";
import {
  tritsToWords,
  wordsToTrits,
  wordsToBytes,
  bytesToWords
} from "./word-converter";

const BIT_HASH_LENGTH = 256;
const BYTE_HASH_LENGTH = 32;
const HASH_LENGTH = 243;

/**
 * @class SHA256
 * @ignore
 */
export default class SHA256 {
  public static BIT_HASH_LENGTH = BIT_HASH_LENGTH;
  public static BYTE_HASH_LENGTH = BYTE_HASH_LENGTH;
  public static HASH_LENGTH = HASH_LENGTH;

  private k: any;

  /**
   * @constructor
   * @ignore
   */
  constructor() {
    this.k = (CryptoJS.algo as any).SHA256.create();
    this.k.init({});
  }

  public initialize(state?: any) {
    /* empty */
  }

  /**
   * Resets the internal state
   *
   * @method reset
   *
   * @ignore
   */
  public reset() {
    this.k.reset();
  }

  /**
   * Absorbs bytes given an offset and length
   *
   * @method update
   *
   * @ignore
   *
   * @param {Int8Array} bytes
   * @param {number} offset
   * @param {number} length
   **/
  public updateWithBytes(bytes: Int8Array, offset: number, length: number) {
    if (length && length % 4 !== 0) {
      throw new Error(errors.ILLEGAL_BYTES_LENGTH);
    }
    do {
      const limit =
        length < SHA256.BIT_HASH_LENGTH ? length : SHA256.BIT_HASH_LENGTH;

      const bytes_state = bytes.slice(offset, offset + limit);
      offset += limit;

      const wordsToUpdate = bytesToWords(bytes_state);
      // update bytes state as word array
      this.k.update(CryptoJS.lib.WordArray.create(wordsToUpdate));
    } while ((length -= SHA256.HASH_LENGTH) > 0);
  }

  /**
   * final bytes given an offset and length
   *
   * @method final
   *
   * @ignore
   *
   * @param {Int8Array} bytes
   * @param {number} offset
   * @param {number} length
   **/
  public finalWithBytes(bytes: Int8Array, offset: number, length: number) {
    if (length && length % 4 !== 0) {
      throw new Error(errors.ILLEGAL_BYTES_LENGTH);
    }
    // get the hash digest
    const kCopy = this.k.clone();
    const final = kCopy.finalize();
    const bytes_state = wordsToBytes(final.words);
    let i = 0;
    const limit =
      length < SHA256.BIT_HASH_LENGTH ? length : SHA256.BIT_HASH_LENGTH;

    while (i < limit) {
      bytes[offset++] = bytes_state[i++];
    }
    this.reset();
  }

  /**
   * Absorbs trits given an offset and length
   *
   * @method update
   *
   * @ignore
   *
   * @param {Int8Array} trits
   * @param {number} offset
   * @param {number} length
   **/
  public update(trits: Int8Array, offset: number, length: number) {
    if (length && length % 243 !== 0) {
      throw new Error(errors.ILLEGAL_TRITS_LENGTH);
    }

    do {
      const limit = length < SHA256.HASH_LENGTH ? length : SHA256.HASH_LENGTH;

      const trit_state = trits.slice(offset, offset + limit);
      offset += limit;

      // convert trit state to words
      const wordsToUpdate = tritsToWords(trit_state);

      // update trit stat as wordarray
      this.k.update(CryptoJS.lib.WordArray.create(wordsToUpdate));
    } while ((length -= SHA256.HASH_LENGTH) > 0);
  }

  /**
   * final trits given an offset and length
   *
   * @method final
   *
   * @ignore
   *
   * @param {Int8Array} trits
   * @param {number} offset
   * @param {number} length
   **/
  public final(trits: Int8Array, offset: number, length: number) {
    if (length && length !== 243) {
      throw new Error(errors.ILLEGAL_TRITS_LENGTH);
    }
    // get the hash digest
    const kCopy = this.k.clone();
    const final = kCopy.finalize();

    const trit_state = wordsToTrits(final.words);

    let i = 0;
    const limit = length < SHA256.HASH_LENGTH ? length : SHA256.HASH_LENGTH;

    while (i < limit) {
      trits[offset++] = trit_state[i++];
    }
    this.reset();
  }
}
