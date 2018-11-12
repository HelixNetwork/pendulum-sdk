/* tslint:disable variable-name no-conditional-assignment */
import * as CryptoJS from "crypto-js";
import * as errors from "./errors";
import { bytesToWords, wordsToBytes } from "@helix/converter";

const BIT_HASH_LENGTH = 256;
const HASH_LENGTH = 32;

/**
 * @class SHA256
 * @ignore
 */
export default class SHA256 {
  public static HASH_LENGTH = HASH_LENGTH;
  public static BIT_HASH_LENGTH = BIT_HASH_LENGTH;

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
   * @param {Uint8Array|string} data
   * @param {number} offset
   * @param {number} length
   **/
  public absorb(
    data: Uint8Array | Int8Array | string,
    offset: number,
    length: number
  ) {
    if (typeof data == "string") {
      this.k.update(data);
      return;
    }
    // if (data.constructor === Int8Array) {
    //   throw new Error(errors.ILLEGAL_TYPE_INT8);
    // }
    if (length && length % 4 !== 0) {
      throw new Error(errors.ILLEGAL_BYTES_LENGTH);
    }
    do {
      const limit = length < SHA256.HASH_LENGTH ? length : SHA256.HASH_LENGTH;

      const bytes_state = data.slice(offset, offset + limit);
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
   * @param {Uint8Array} bytes
   * @param {number} offset
   * @param {number} length
   **/
  public squeeze(
    bytes: Uint8Array | Int8Array,
    offset: number,
    length: number
  ) {
    if (length && length % 4 !== 0) {
      throw new Error(errors.ILLEGAL_BYTES_LENGTH);
    }
    /**
     * todo check if it's ok to rehash with sha256 again in order to achieve a longer output hash if yes remove this check
     **/
    // if (length > SHA256.HASH_LENGTH) {
    //   throw new Error(errors.ILLEGAL_BYTES_LENGTH_TOO_LARGE);
    // }
    do {
      // get the hash digest
      const kCopy = this.k.clone();
      const final = kCopy.finalize();

      let test: Uint32Array = new Uint32Array(final.words.length);
      for (let j = 0; j < final.words.length; j++) {
        test[j] = final.words[j];
      }

      const bytes_state = wordsToBytes(final.words);

      let i = 0;
      const limit = length < SHA256.HASH_LENGTH ? length : SHA256.HASH_LENGTH;

      while (i < limit) {
        bytes[offset++] = bytes_state[i++];
      }
      this.reset();
      this.k.update(final);
    } while ((length -= SHA256.HASH_LENGTH) > 0);
  }
}
