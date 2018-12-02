/** @module signing */

import { concatenate } from "@helixnetwork/converter";
import * as errors from "./errors";
import {
  SIGNATURE_TOTAL_BYTE_SIZE,
  SIGNATURE_R_BYTE_SIZE,
  SIGNATURE_S_BYTE_SIZE
} from "../../constants";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

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
    if (this.r.length != SIGNATURE_R_BYTE_SIZE) {
      throw new Error(errors.ILLEGAL_R_IN_SIGNATURE + " " + this.r.length);
    }
    if (this.s.length != SIGNATURE_S_BYTE_SIZE) {
      throw new Error(errors.ILLEGAL_S_IN_SIGNATURE + " " + this.s.length);
    }

    return concatenate(Uint8Array, this.r, this.s);
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

  public static generateSignatureFromArray(arr: Uint8Array): HSign {
    if (arr.length != SIGNATURE_TOTAL_BYTE_SIZE) {
      throw new Error(errors.ILLEGAL_SIGNATURE_LENGTH_SCH + " " + arr.length);
    }
    const r = arr.slice(0, SIGNATURE_R_BYTE_SIZE);
    const s = arr.slice(SIGNATURE_R_BYTE_SIZE, arr.length);
    return new HSign(r, s);
  }
}
