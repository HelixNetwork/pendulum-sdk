import { addChecksum } from "@helixnetwork/checksum";
import { toHBytes, hex } from "@helixnetwork/converter";
import { address, digests, key, subseed } from "@helixnetwork/schnorr";
import {
  ADDRESS_BYTE_SIZE,
  ADDRESS_CHECKSUM_BYTE_SIZE,
  HASH_BYTE_SIZE
} from "../../constants";
import { Hash } from "../../types";

/**
 * Generates an address deterministically, according to the given seed, index and security level.
 *
 * @method generateAddress
 *
 * @memberof module:core
 *
 * @param {string} seed
 * @param {number} index - Private key index
 * @param {number} [security=2] - Security level of the private key
 * @param {boolean} [checksum=false] - Flag to add 0hbytes checksum
 *
 * @returns {Hash} Address hbytes
 */
export const generateAddress = (
  seed: string,
  index: number,
  security: number = 2,
  checksum: boolean = false
): Hash => {
  // todo: this part is added only to address generation not also when bundle is sign,
  // because of this there are differences between address generated and seed for which address is generated

  // while (seed.length % HASH_BYTE_SIZE !== 0) {
  //   seed += 0;
  // }
  const keyHBytes = key(subseed(toHBytes(seed), index), security);
  const digestsHBytes = digests(keyHBytes);
  const addressHBytes = hex(address(digestsHBytes));

  return checksum ? addChecksum(addressHBytes) : addressHBytes;
};
