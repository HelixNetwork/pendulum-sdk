/* tslint:disable variable-name no-conditional-assignment */
import * as CryptoJS from "crypto-js";
import * as errors from "./errors";
import { tritsToWords, wordsToTrits } from "./word-converter";
import { bytesToWords, wordsToBytes } from "@helixnetwork/converter";

const BIT_HASH_LENGTH = 384;
const HASH_LENGTH = 256; // 243

/**
 * @class kerl
 * @ignore
 */
export default class Kerl {
  public static BIT_HASH_LENGTH = BIT_HASH_LENGTH;
  public static HASH_LENGTH = HASH_LENGTH;

  private k: any;

  /**
   * @constructor
   * @ignore
   */
  constructor() {
    this.k = (CryptoJS.algo as any).SHA3.create();
    this.k.init({
      outputLength: BIT_HASH_LENGTH
    });
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
   * Absorbs hbits given an offset and length
   *
   * @method absorb
   *
   * @ignore
   *
   * @param {Int8Array} hBits
   * @param {number} offset
   * @param {number} length
   **/
  public absorb(hBits: Int8Array, offset: number, length: number) {
    if (length && length % HASH_LENGTH !== 0) {
      throw new Error(errors.ILLEGAL_HBITS_LENGTH);
    }

    do {
      const limit = length < Kerl.HASH_LENGTH ? length : Kerl.HASH_LENGTH;

      const bytes_state = hBits.slice(offset, offset + limit);
      offset += limit;

      const wordsToUpdate = bytesToWords(bytes_state);
      // update toHBytes state as word array
      this.k.update(CryptoJS.lib.WordArray.create(wordsToUpdate));
    } while ((length -= Kerl.HASH_LENGTH) > 0);
  }

  /**
   * Squeezes hbits given an offset and length
   *
   * @method squeeze
   *
   * @ignore
   *
   * @param {Int8Array} hbits
   * @param {number} offset
   * @param {number} length
   **/
  public squeeze(hbits: Int8Array, offset: number, length: number) {
    if (length && length % HASH_LENGTH !== 0) {
      throw new Error(errors.ILLEGAL_HBITS_LENGTH);
    }
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
      const limit = length < Kerl.HASH_LENGTH ? length : Kerl.HASH_LENGTH;

      while (i < limit) {
        hbits[offset++] = bytes_state[i++];
      }

      this.reset();

      for (i = 0; i < final.words.length; i++) {
        final.words[i] = final.words[i] ^ 0xffffffff;
      }

      this.k.update(final);
    } while ((length -= Kerl.HASH_LENGTH) > 0);
  }
}
