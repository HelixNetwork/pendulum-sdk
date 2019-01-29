/** @module checksum */

import { hex, toHBytes } from "@helixnetwork/converter";
import HHash from "@helixnetwork/hash-module";
import {
  ADDRESS_BYTE_SIZE,
  ADDRESS_BYTE_SIZE_PADDING,
  ADDRESS_CHECKSUM_BYTE_SIZE,
  ADDRESS_MIN_CHECKSUM_BYTE_SIZE
} from "../../constants";
import {
  INVALID_ADDRESS,
  INVALID_CHECKSUM,
  INVALID_HBYTES
} from "../../errors";
import { isHBytes } from "../../guards";
import { asArray, HBytes } from "../../types";

export const errors = {
  INVALID_ADDRESS,
  INVALID_CHECKSUM,
  INVALID_HBYTES,
  INVALID_CHECKSUM_LENGTH: "Invalid checksum length"
};

const ADDRESS_CHECKSUM_HBYTES_LENGTH = ADDRESS_CHECKSUM_BYTE_SIZE;
const ADDRESS_WITH_CHECKSUM_HBYTES_LENGTH =
  ADDRESS_BYTE_SIZE + ADDRESS_CHECKSUM_HBYTES_LENGTH;
const MIN_CHECKSUM_HBYTES_LENGTH = ADDRESS_MIN_CHECKSUM_BYTE_SIZE;

/**
 * Generates and appends the 8-hbytes checksum of the given hbytes, usually an address.
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

      if (isAddress && inputHBytes.length !== ADDRESS_BYTE_SIZE) {
        if (inputHBytes.length === ADDRESS_WITH_CHECKSUM_HBYTES_LENGTH) {
          return inputHBytes;
        }

        throw new Error(errors.INVALID_ADDRESS);
      }

      if (
        !Number.isInteger(checksumLength) ||
        checksumLength < MIN_CHECKSUM_HBYTES_LENGTH ||
        checksumLength % 2 !== 0 ||
        (isAddress && checksumLength !== ADDRESS_CHECKSUM_HBYTES_LENGTH)
      ) {
        throw new Error(errors.INVALID_CHECKSUM_LENGTH);
      }

      let paddedInputHBytes = inputHBytes;

      while (paddedInputHBytes.length % ADDRESS_BYTE_SIZE_PADDING !== 0) {
        paddedInputHBytes += "0";
      }
      const hHash = new HHash(HHash.HASH_ALGORITHM_1);

      const checksumHBytes = new Int8Array(hHash.getHashLength());
      hHash.initialize();

      const inputHBYtes = toHBytes(paddedInputHBytes);
      hHash.absorb(inputHBYtes, 0, inputHBYtes.length);
      hHash.squeeze(checksumHBytes, 0, hHash.getHashLength());
      return inputHBytes.concat(
        hex(
          checksumHBytes.slice(
            hHash.getHashLength() - checksumLength / 2,
            hHash.getHashLength()
          )
        )
      );
    }
  );
  return Array.isArray(input) ? withChecksum : withChecksum[0];
}

/**
 * Removes the 8-hbytes checksum of the given input.
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
        isHBytes(t, ADDRESS_BYTE_SIZE) ||
        isHBytes(t, ADDRESS_WITH_CHECKSUM_HBYTES_LENGTH)
    )
  ) {
    throw new Error(errors.INVALID_ADDRESS);
  }

  const noChecksum: ReadonlyArray<HBytes> = hByteArray.map(inputHBytes =>
    inputHBytes.slice(0, ADDRESS_BYTE_SIZE)
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
