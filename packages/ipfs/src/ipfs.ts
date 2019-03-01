/* tslint:disable variable-name no-conditional-assignment */

// note: cryptojs is using keccak rather than sha3, opposed to their naming, hence we currently use js-sha3. We might consider different sha3 implementations.
import * as ipfs from "ipfs";
import * as errors from "./errors";
import { hex } from "@helixnetwork/converter";

/**
 * @class Ipfs
 * @ignore
 */

export default class Ipfs {

  private ipfs: any;

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
   * submit to ipfs node
   *
   * @method generate
   *
   * @ignore
   *
   **/

  public submit() {}


}
