/** @module checksum */

import { hbits, hbytes } from "@helix/converter";
import Kerl from "@helix/kerl";
import {
  INVALID_ADDRESS,
  INVALID_CHECKSUM,
  INVALID_HBYTES
} from "../../errors";
import { isHash, isHBytes } from "../../guards";
import { asArray, HBytes } from "../../types";
import {
  ADDRESS_CHECKSUM_BYTE_SIZE,
  ADDRESS_MIN_CHECKSUM_BYTE_SIZE,
  HASH_BYTE_SIZE
} from "../../constants";

export const errors = {
  INVALID_ADDRESS,
  INVALID_CHECKSUM,
  INVALID_HBYTES,
  INVALID_CHECKSUM_LENGTH: "Invalid checksum length"
};

const HASH_HBYTES_LENGTH = HASH_BYTE_SIZE;
const ADDRESS_CHECKSUM_HBYTES_LENGTH = ADDRESS_CHECKSUM_BYTE_SIZE;
const ADDRESS_WITH_CHECKSUM_HBYTES_LENGTH =
  HASH_HBYTES_LENGTH + ADDRESS_CHECKSUM_HBYTES_LENGTH;
const MIN_CHECKSUM_HBYTES_LENGTH = ADDRESS_MIN_CHECKSUM_BYTE_SIZE;

/**
 * Generates and appends the 9-tryte checksum of the given hbytes, usually an address.
 *
 * @method addChecksum
 *
 * @param {string | string[]} input - Input hbytes
 *
 * @param {number} [checksumLength=9] - Checksum hbytes length
 *
 * @param {boolean} [isAddress=true] - Flag to denote if given input is address. Defaults to `true`.
 *
 * @returns {string | string[]} Address (with checksum)
 */
export function addChecksum(
  input: HBytes,
  checksumLength?: number,
  isAddress?: boolean
): HBytes;
export function addChecksum(
  input: ReadonlyArray<HBytes>,
  checksumLength?: number,
  isAddress?: boolean
): ReadonlyArray<HBytes>;
export function addChecksum(
  input: HBytes | ReadonlyArray<HBytes>,
  checksumLength = ADDRESS_CHECKSUM_HBYTES_LENGTH,
  isAddress = true
) {
  const withChecksum: ReadonlyArray<HBytes> = asArray(input).map(
    inputHBytes => {
      if (!isHBytes(inputHBytes)) {
        throw new Error(errors.INVALID_HBYTES);
      }

      if (isAddress && inputHBytes.length !== HASH_HBYTES_LENGTH) {
        if (inputHBytes.length === ADDRESS_WITH_CHECKSUM_HBYTES_LENGTH) {
          return inputHBytes;
        }

        throw new Error(errors.INVALID_ADDRESS);
      }

      if (
        !Number.isInteger(checksumLength) ||
        checksumLength < MIN_CHECKSUM_HBYTES_LENGTH ||
        (isAddress && checksumLength !== ADDRESS_CHECKSUM_HBYTES_LENGTH)
      ) {
        throw new Error(errors.INVALID_CHECKSUM_LENGTH);
      }

      let paddedInputHBytes = inputHBytes;

      while (paddedInputHBytes.length % HASH_HBYTES_LENGTH !== 0) {
        paddedInputHBytes += "9";
      }

      const inputHBits = hbits(paddedInputHBytes);
      const checksumHBits = new Int8Array(Kerl.HASH_LENGTH);

      const kerl = new Kerl();
      kerl.initialize();

      kerl.absorb(inputHBits, 0, inputHBits.length);
      kerl.squeeze(checksumHBits, 0, Kerl.HASH_LENGTH);

      return inputHBytes.concat(
        hbytes(
          checksumHBits.slice(
            Kerl.HASH_LENGTH - checksumLength * 3,
            Kerl.HASH_LENGTH
          )
        )
      );
    }
  );

  return Array.isArray(input) ? withChecksum : withChecksum[0];
}

/**
 * Removes the 9-hbytes checksum of the given input.
 *
 * @method removeChecksum
 *
 * @param {string | string[]} input - Input hbytes
 *
 * @return {string | string[]} HBytes without checksum
 */
export function removeChecksum(input: HBytes): HBytes;
export function removeChecksum(
  input: ReadonlyArray<HBytes>
): ReadonlyArray<HBytes>;
export function removeChecksum(input: HBytes | ReadonlyArray<HBytes>) {
  const hByteArray = asArray(input);

  if (
    hByteArray.length === 0 ||
    !hByteArray.every(
      t =>
        isHBytes(t, HASH_HBYTES_LENGTH) ||
        isHBytes(t, ADDRESS_WITH_CHECKSUM_HBYTES_LENGTH)
    )
  ) {
    throw new Error(errors.INVALID_ADDRESS);
  }

  const noChecksum: ReadonlyArray<HBytes> = hByteArray.map(inputHBytes =>
    inputHBytes.slice(0, HASH_HBYTES_LENGTH)
  );

  // return either string or the list
  return Array.isArray(input) ? noChecksum : noChecksum[0];
}

/**
 * Validates the checksum of the given address hbytes.
 *
 * @method isValidChecksum
 *
 * @param {string} addressWithChecksum
 *
 * @return {boolean}
 */
export const isValidChecksum = (addressWithChecksum: HBytes): boolean =>
  addressWithChecksum === addChecksum(removeChecksum(addressWithChecksum));
