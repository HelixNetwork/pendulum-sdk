/* tslint:disable variable-name no-conditional-assignment */
import { hbits, hbytes, hex } from "@helixnetwork/converter";
import SHA3 from "@helixnetwork/sha3";

const HASH_SHA3 = "sha3";

/**
 * @class HHash - only this class should be used for hashing
 * @ignore
 */
export default class HHash {
  public static HASH_ALGORITHM_1 = HASH_SHA3;
  public static HASH_ALGORITHM_2 = HASH_SHA3;
  public static HASH_ALGORITHM_3 = HASH_SHA3;

  private h: any;
  private readonly t: string;
  /**
   * @constructor
   * @ignore
   */
  constructor(type: string, public param1?: any) {
    this.t = type;
    if (type === HASH_SHA3) {
      this.h = new SHA3();
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
   * Absorbs toTxBytes given an offset and length
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
   * final toTxBytes given an offset and length
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
    bytes: Int8Array | Uint8Array,
    offset: number,
    length: number
  ) {
    this.h.squeeze(bytes, offset, length);
  }

  /**
   * final toTxBytes given an offset and length
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
    bits.forEach((_element, index, array) => (array[index] &= 0x01));
  }

  public getHashLength(): number {
    if (this.t === HASH_SHA3) {
      return SHA3.HASH_LENGTH;
    }
    return 0;
  }
}
