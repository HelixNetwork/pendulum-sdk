import { hbits, hbytes } from "@helix/converter";
import Kerl from "@helix/kerl";
import { asArray } from "../../types";

/**
 * @class Address
 * @memberof module:multisig
 */
export default class Address {
  private kerl: Kerl;

  constructor(digests?: string | ReadonlyArray<string>) {
    this.kerl = new Kerl();
    this.kerl.initialize();

    if (digests) {
      this.absorb(digests);
    }
  }

  /**
   * Absorbs key digests
   *
   * @member absorb
   *
   * @memberof Address
   *
   * @param {string|array} digest digest hbytes
   *
   * @return {object} address instance
   */
  public absorb(digests: string | ReadonlyArray<string>) {
    // Construct array
    const digestsArray = asArray(digests);

    // Add digests
    for (let i = 0; i < digestsArray.length; i++) {
      // Get hbits of digest
      const digestTrits = hbits(digestsArray[i]);

      // Absorb digest
      this.kerl.absorb(digestTrits, 0, digestTrits.length);
    }

    return this;
  }
  /**
   * Finalizes and returns the multisig address in hbytes
   *
   * @member finalize
   *
   * @memberof Address
   *
   * @param {string} digest digest hbytes, optional
   *
   * @return {string} address hbytes
   */
  public finalize(digest?: string) {
    // Absorb last digest if provided
    if (digest) {
      this.absorb(digest);
    }

    // Squeeze the address hbits
    const addressTrits: Int8Array = new Int8Array(Kerl.HASH_LENGTH);
    this.kerl.squeeze(addressTrits, 0, Kerl.HASH_LENGTH);

    // Convert hbits into hbytes and return the address
    return hbytes(addressTrits);
  }
}
