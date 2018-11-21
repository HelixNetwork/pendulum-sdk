/* tslint:disable variable-name no-conditional-assignment */

import Kerl from "@helix/kerl";
import Curl from "@helix/curl";
import SHA256 from "@helix/sha256";
import { hbits, hbytes, hex } from "@helix/converter";

const HASH_KERL = "kerl";
const HASH_CURL = "curl";
const HASH_SHA256 = "sha256";

/**
 * @class HHash - only this class should be used for hashing
 * @ignore
 */
export default class HHash {
  public static HASH_ALGORITHM_1 = HASH_SHA256;
  public static HASH_ALGORITHM_2 = HASH_SHA256;
  public static HASH_ALGORITHM_3 = HASH_SHA256;

  private h: any;
  private readonly t: string;
  /**
   * @constructor
   * @ignore
   */
  constructor(type: string, public param1?: any) {
    this.t = type;
    if (type === HASH_KERL) {
      this.h = new Kerl();
    }
    if (type === HASH_CURL) {
      this.h = new Curl(param1);
    }
    if (type === HASH_SHA256) {
      this.h = new SHA256();
    }
  }

  public initialize(state?: any) {
    this.h.initialize();
  }

  /**
   * Resets the internal state
   *
   * @method reset
   *
   * @ignore
   */
  public reset() {
    this.h.reset();
  }

  /**
   * Absorbs toHBytes given an offset and length
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
    data: Int8Array | Uint8Array | string,
    offset: number,
    length: number
  ) {
    this.h.absorb(data, offset, length);
  }
  public absorbBits(data: Int8Array, offset: number, length: number) {
    this.h.absorb(hbytes(data), offset, length);
  }

  /**
   * final toHBytes given an offset and length
   *
   * @method final
   *
   * @ignore
   *
   * @param {Uint8Array} bytes
   * @param {number} offset
   * @param {number} length
   **/
  public squeeze(bytes: Int8Array, offset: number, length: number) {
    this.h.squeeze(bytes, offset, length);
  }

  /**
   * final toHBytes given an offset and length
   *
   * @method final
   *
   * @ignore
   *
   * @param {Uint8Array} bytes
   * @param {number} offset
   * @param {number} length
   **/
  public squeezeBits(bits: Int8Array, offset: number, length: number) {
    hbits(hex(this.h.squeeze(bits, offset, length / 8)));
    bits.forEach((element, index, array) => (array[index] &= 0x01));
  }

  public getHashLength(): number {
    if (this.t === HASH_KERL) {
      return Kerl.HASH_LENGTH;
    }
    if (this.t === HASH_CURL) {
      return Curl.HASH_LENGTH;
    }
    if (this.t === HASH_SHA256) {
      return SHA256.HASH_LENGTH;
    }
    return 0;
  }
}
