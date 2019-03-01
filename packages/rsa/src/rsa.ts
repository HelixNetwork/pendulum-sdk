/* tslint:disable variable-name no-conditional-assignment */

// note: cryptojs is using keccak rather than sha3, opposed to their naming, hence we currently use js-sha3. We might consider different sha3 implementations.
import * as rsa from "rsa";
import * as errors from "./errors";
import { hex } from "@helixnetwork/converter";


/**
 * @class Rsa
 * @ignore
 */

export default class Rsa {
  public static BIT_HASH_LENGTH = BIT_HASH_LENGTH;
  public static HASH_LENGTH = HASH_LENGTH;

  private rsa: any;

  /**
   * @constructor
   * @ignore
   */

  constructor() {
  }

  public initialize(state?: any) {
    /* empty */
  }

  /**
   * Generates a keypair
   *
   * @method generate
   *
   * @ignore
   *
   * @param {Uint8Array} input
   * @param {number} offset
   * @param {number} length
   **/

  public generate() {}


}
