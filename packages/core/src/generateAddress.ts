import { addChecksum } from "@helixnetwork/checksum";
import { hex, toTxBytes } from "@helixnetwork/converter";
import { address, digests, key, subseed } from "@helixnetwork/winternitz";
import { securityLevelValidator, seedValidator, validate } from "../../guards";
import {
  ADDRESS_BYTE_SIZE,
  ADDRESS_CHECKSUM_BYTE_SIZE,
  HASH_TX_HEX_SIZE
} from "../../constants";
import { Hash } from "../../types";

/**
 * Generates an address deterministically, according to the given seed, index and security level.
 * @todo set default security to 2 in future.
 * @method generateAddress
 *
 * @memberof module:core
 *
 * @param {string} seed
 * @param {number} index - Private key index
 * @param {number} [security=1] - Security level of the private key
 * @param {boolean} [checksum=false] - Flag to add 8 txBytes checksum
 *
 * @returns {Hash} Address transactionStrings
 */
export const generateAddress = (
  seed: string,
  index: number,
  security: number = 1,
  checksum: boolean = false
): Hash => {
  validate(seedValidator(seed), securityLevelValidator(security));

  const keyHBytes = key(subseed(toTxBytes(seed), index), security);
  const digestsHBytes = digests(keyHBytes);
  const addressHBytes = hex(address(digestsHBytes));

  return checksum ? addChecksum(addressHBytes) : addressHBytes;
};
