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
   * @param {string} input
   * @param {number} offset
   * @param {number} length
   **/
  public absorb(input: string, offset: number, length: number) {
    if (length && length % 64 !== 0) {
      throw new Error(errors.ILLEGAL_HASH_LENGTH);
    }

    do {
      const limit = length < Sha3.HASH_LENGTH ? length : Sha3.HASH_LENGTH;
      const input_state = input.slice(offset, offset + limit);
      offset += limit;

      // absorb the input state
      this.sha3.update(input_state);
      //this.reset()
    } while ((length -= Sha3.HASH_LENGTH) > 0);
  }

  /**
   * Squeezes string given an offset and length
   *
   * @method squeeze
   *
   * @ignore
   *
   * @param {string} input
   * @param {number} offset
   * @param {number} length
   **/
  // @TODO remove out and update state internally
  // @TODO add validation of limits

  public squeeze(input: string, offset: number, length: number) {
    if (length && length % 64 !== 0) {
      throw new Error(errors.ILLEGAL_HASH_LENGTH);
    }
    var out: string = "";
    do {
      console.log(out);
      var state = this.sha3.hex();
      out += state;
      this.reset();
      this.sha3.update(state);
    } while ((length -= Sha3.HASH_LENGTH) > 0);
    return out;
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
}
