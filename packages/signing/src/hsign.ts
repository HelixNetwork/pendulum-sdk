/** @module signing */

import { concatenate } from "@helix/converter";
import * as errors from "./errors";

const Schn = require("schnorr");

export default class HSign {
  public r: Uint8Array;
  public s: Uint8Array;

  constructor(r: Uint8Array, s: Uint8Array) {
    this.r = r;
    this.s = s;
  }

  public getSignatureArray(): Uint8Array {
    if (this.r === undefined) {
      throw new Error(errors.ILLEGAL_R_IN_SIGNATURE);
    }
    if (this.s === undefined) {
      throw new Error(errors.ILLEGAL_S_IN_SIGNATURE);
    }
    return concatenate(this.r, this.s);
  }

  public getSignature(): any {
    if (this.r === undefined) {
      throw new Error(errors.ILLEGAL_R_IN_SIGNATURE);
    }
    if (this.s === undefined) {
      throw new Error(errors.ILLEGAL_S_IN_SIGNATURE);
    }
    return { r: this.r, s: this.s };
  }
}
