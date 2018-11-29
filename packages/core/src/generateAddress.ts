import { addChecksum } from "@helix/checksum";
import { hbits, hbytes, hex } from "@helix/converter";
import { digests, key, subseed } from "@helix/signing";
import { Hash } from "../../types";
import { ADDRESS_BYTE_SIZE, ADDRESS_CHECKSUM_BYTE_SIZE } from "../../constants";

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
  while (seed.length % ADDRESS_BYTE_SIZE !== 0) {
    seed += 0;
  }
  const keyHBytes = key(subseed(hbits(seed), index), security);
  const digestsHBytes = digests(keyHBytes);
  const addressHBytes = hex(digestsHBytes); // hbytes(address(digestsHBits));

  return checksum ? addChecksum(addressHBytes) : addressHBytes;
};
