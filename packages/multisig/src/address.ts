import { txBits, hex } from "@helixnetwork/converter";
import HHash from "@helixnetwork/hash-module";
import { asArray } from "../../types";

/**
 * @class Address
 * @memberof module:multisig
 */
export default class Address {
  private hHash: HHash;

  constructor(digests?: string | ReadonlyArray<string>) {
    this.hHash = new HHash(HHash.HASH_ALGORITHM_1);
    this.hHash.initialize();

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
   * @param {string|array} digest digest txs
   *
   * @return {object} address instance
   */
  public absorb(digests: string | ReadonlyArray<string>) {
    // Construct array
    const digestsArray = asArray(digests);

    // Add digests
    for (let i = 0; i < digestsArray.length; i++) {
      // Get txBits of digest
      const digestHBits = txBits(digestsArray[i]);

      // Absorb digest
      this.hHash.absorb(digestHBits, 0, digestHBits.length);
    }

    return this;
  }
  /**
   * Finalizes and returns the multisig address in txs
   *
   * @member finalize
   *
   * @memberof Address
   *
   * @param {string} digest digest txs, optional
   *
   * @return {string} address txs
   */
  public finalize(digest?: string) {
    // Absorb last digest if provided
    if (digest) {
      this.absorb(digest);
    }

    // Squeeze the address txBits
    const addressTxHex: Int8Array = new Int8Array(this.hHash.getHashLength());
    this.hHash.squeeze(addressTxHex, 0, this.hHash.getHashLength());

    // Convert txBits into txs and return the address
    return hex(addressTxHex);
  }
}
