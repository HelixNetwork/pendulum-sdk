/**
 *
 * Copyright (c) 2017-2018 Helix Foundation. http://helix-foundation.org
 *
 */
/* tslint:disable variable-name no-conditional-assignment */

// @TODO investigate possibility of buffer inputs with js-sha3
// note: cryptojs is using keccak rather than sha3, opposed to their naming, hence we currently use js-sha3. We might consider different sha3 implementations.

import * as crypto from "js-sha3";
import * as errors from "./errors";

const BIT_HASH_LENGTH = 256;
const BYTE_HASH_LENGTH = 32;
const HASH_LENGTH = 64;

/**
 * @class SHA3
 * @ignore
 */

export default class Sha3 {
  public static BIT_HASH_LENGTH = BIT_HASH_LENGTH;
  public static BYTE_HASH_LENGTH = BYTE_HASH_LENGTH;
  public static HASH_LENGTH = HASH_LENGTH;

  private sha3: any;

  /**
   * @constructor
   * @ignore
   */
  constructor() {
    this.sha3 = (crypto.sha3_256 as any).create();
  }

  public initialize(state?: any) {
    /* empty */
  }

  /**
   * Absorbs string given an offset and length
   *
   * @method absorb
   *
   * @ignore
   *
   * @param {Uint8Array} input
   * @param {number} offset
   * @param {number} length
   **/
  public absorb(input: Uint8Array, offset: number, length: number) {
    if (length && length % BYTE_HASH_LENGTH !== 0) {
      throw new Error(errors.ILLEGAL_HASH_LENGTH);
    }

    do {
      const limit = length < Sha3.HASH_LENGTH ? length : Sha3.HASH_LENGTH;
      const input_state = input.slice(offset, offset + limit);
      offset += limit;

      // will become obsolete
      const hex_state = this.bytesToHex(input_state);

      // @TODO absorb the input state as Int8Array
      // js-sha3 only returns expected results when using hex strings as input.
      this.sha3.update(hex_state);
    } while ((length -= Sha3.HASH_LENGTH) > 0);
  }

  /**
   * Squeezes string given an offset and length
   *
   * @method squeeze
   *
   * @ignore
   *
   * @param {Uint8Array} input
   * @param {number} offset
   * @param {number} length
   **/
  // @TODO remove out and update state internally
  // @TODO add validation of limits

  public squeeze(input: Uint8Array, offset: number, length: number) {
    if (length && length % BYTE_HASH_LENGTH !== 0) {
      throw new Error(errors.ILLEGAL_HASH_LENGTH);
    }

    do {
      // finalize
      let state = this.sha3.digest();

      let i = 0;
      const limit = length < Sha3.HASH_LENGTH ? length : Sha3.HASH_LENGTH;

      // out += state;
      while (i < limit) {
        input[offset++] = state[i++];
      }

      const hex_state = this.bytesToHex(state);

      this.reset();
      this.sha3.update(hex_state);
    } while ((length -= Sha3.HASH_LENGTH) > 0);
  }

  /**
   * Resets the internal state
   *
   * @method reset
   *
   * @ignore
   */
  // @TODO state should be set to null, rather than re-initializing.

  public reset() {
    this.sha3 = (crypto.sha3_256 as any).create();
  }

  // This helper method will become obsolete when js-sha3 or our implementation returns
  // expected results with Int8Arrays as input
  private bytesToHex(uint8arr) {
    if (!uint8arr) {
      return "";
    }
    let hexStr = "";
    for (let i = 0; i < uint8arr.length; i++) {
      let hex = (uint8arr[i] & 0xff).toString(16);
      hex = hex.length === 1 ? "0" + hex : hex;
      hexStr += hex;
    }

    return hexStr;
  }
}
