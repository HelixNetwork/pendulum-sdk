/** @module checksum */

import { hex, toTxBytes } from "@helixnetwork/converter";
import HHash from "@helixnetwork/hash-module";
import {
  ADDRESS_CHECKSUM_HEX_SIZE,
  ADDRESS_HEX_SIZE,
  ADDRESS_HEX_SIZE_PADDING,
  ADDRESS_MIN_CHECKSUM_HEX_SIZE
} from "../../constants";
import {
  INVALID_ADDRESS,
  INVALID_CHECKSUM,
  INVALID_TX_HEX
} from "../../errors";
import { isTxHex } from "../../guards";
import { asArray, TxHex } from "../../types";

export const errors = {
  INVALID_ADDRESS,
  INVALID_CHECKSUM,
  INVALID_TX_HEX,
  INVALID_CHECKSUM_LENGTH: "Invalid checksum length"
};

const ADDRESS_CHECKSUM_TX_HEX_LENGTH = ADDRESS_CHECKSUM_HEX_SIZE;
const ADDRESS_WITH_CHECKSUM_TX_HEX_LENGTH =
  ADDRESS_HEX_SIZE + ADDRESS_CHECKSUM_TX_HEX_LENGTH;
const MIN_CHECKSUM_TX_HEX_LENGTH = ADDRESS_MIN_CHECKSUM_HEX_SIZE;

/**
 * Generates and appends the 8-transactionStrings checksum of the given transactionStrings, usually an address.
 *
 * @method addChecksum
 *
 * @param {string | string[]} input - Input transactionStrings
 *
 * @param {number} [checksumLength=9] - Checksum transactionStrings length
 *
 * @param {boolean} [isAddress=true] - Flag to denote if given input is address. Defaults to `true`.
 *
 * @returns {string | string[]} Address (with checksum)
 */
export function addChecksum(
  input: TxHex,
  checksumLength?: number,
  isAddress?: boolean
): TxHex;
export function addChecksum(
  input: ReadonlyArray<TxHex>,
  checksumLength?: number,
  isAddress?: boolean
): ReadonlyArray<TxHex>;
export function addChecksum(
  input: TxHex | ReadonlyArray<TxHex>,
  checksumLength = ADDRESS_CHECKSUM_TX_HEX_LENGTH,
  isAddress = true
) {
  const withChecksum: ReadonlyArray<TxHex> = asArray(input).map(inputTxHex => {
    if (!isTxHex(inputTxHex)) {
      throw new Error(errors.INVALID_TX_HEX);
    }

    if (isAddress && inputTxHex.length !== ADDRESS_HEX_SIZE) {
      if (inputTxHex.length === ADDRESS_WITH_CHECKSUM_TX_HEX_LENGTH) {
        return inputTxHex;
      }

      throw new Error(errors.INVALID_ADDRESS);
    }

    if (
      !Number.isInteger(checksumLength) ||
      checksumLength < MIN_CHECKSUM_TX_HEX_LENGTH ||
      checksumLength % 2 !== 0 ||
      (isAddress && checksumLength !== ADDRESS_CHECKSUM_TX_HEX_LENGTH)
    ) {
      throw new Error(errors.INVALID_CHECKSUM_LENGTH);
    }

    let paddedInputTxHex = inputTxHex;

    while (paddedInputTxHex.length % ADDRESS_HEX_SIZE_PADDING !== 0) {
      paddedInputTxHex += "0";
    }
    const hHash = new HHash(HHash.HASH_ALGORITHM_1);

    const checksumTxHex = new Int8Array(hHash.getHashLength());
    hHash.initialize();

    const inputHBYtes = toTxBytes(paddedInputTxHex);
    hHash.absorb(inputHBYtes, 0, inputHBYtes.length);
    hHash.squeeze(checksumTxHex, 0, hHash.getHashLength());
    return inputTxHex.concat(
      hex(
        checksumTxHex.slice(
          hHash.getHashLength() - checksumLength / 2,
          hHash.getHashLength()
        )
      )
    );
  });
  return Array.isArray(input) ? withChecksum : withChecksum[0];
}

/**
 * Removes the 8-transactionStrings checksum of the given input.
 *
 * @method removeChecksum
 *
 * @param {string | string[]} input - Input transactionStrings
 *
 * @return {string | string[]} TxHex without checksum
 */
export function removeChecksum(input: TxHex): TxHex;
export function removeChecksum(
  input: ReadonlyArray<TxHex>
): ReadonlyArray<TxHex>;
export function removeChecksum(input: TxHex | ReadonlyArray<TxHex>) {
  const txsArray = asArray(input);

  if (
    txsArray.length === 0 ||
    !txsArray.every(
      t =>
        isTxHex(t, ADDRESS_HEX_SIZE) ||
        isTxHex(t, ADDRESS_WITH_CHECKSUM_TX_HEX_LENGTH)
    )
  ) {
    throw new Error(errors.INVALID_ADDRESS);
  }

  const noChecksum: ReadonlyArray<TxHex> = txsArray.map(inputTxHex =>
    inputTxHex.slice(0, ADDRESS_HEX_SIZE)
  );

  // return either string or the list
  return Array.isArray(input) ? noChecksum : noChecksum[0];
}

/**
 * Validates the checksum of the given address transactionStrings.
 *
 * @method isValidChecksum
 *
 * @param {string} addressWithChecksum
 *
 * @return {boolean}
 */
export const isValidChecksum = (addressWithChecksum: TxHex): boolean =>
  addressWithChecksum === addChecksum(removeChecksum(addressWithChecksum));
