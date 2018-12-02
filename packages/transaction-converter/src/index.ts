/** @module transaction-converter */

import { hBitsToHBytes, hbytesToHBits, value } from "@helixnetwork/converter";
import HHash from "@helixnetwork/hash-module";
import { padHBits, padHBytes, padSignedHBits } from "@helixnetwork/pad";
import { transactionHash } from "@helixnetwork/transaction";
import {
  ADDRESS_BYTE_SIZE,
  HASH_BYTE_SIZE,
  NONCE_BYTE_SIZE,
  OBSOLETE_TAG_BYTE_SIZE,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE,
  TAG_BYTE_SIZE,
  TRANSACTION_CURRENT_INDEX_BITS_SIZE,
  TRANSACTION_CURRENT_INDEX_BYTE_SIZE,
  TRANSACTION_HBYTE_SIZE,
  TRANSACTION_LAST_INDEX_BITS_SIZE,
  TRANSACTION_LAST_INDEX_BYTE_SIZE,
  TRANSACTION_TIMESTAMP_BITS_SIZE,
  TRANSACTION_TIMESTAMP_BYTE_SIZE,
  TRANSACTION_TIMESTAMP_LOWER_BOUND_SIZE,
  TRANSACTION_TIMESTAMP_UPPER_BOUND_SIZE,
  TRANSACTION_VALUE_BITS_SIZE,
  TRANSACTION_VALUE_BYTE_SIZE
} from "../../constants";
import * as errors from "../../errors";
import { isHBytesOfExactLength } from "../../guards";
import { asArray, Hash, HBytes, Transaction } from "../../types";

export function asTransactionHBytes(transactions: Transaction): HBytes;
export function asTransactionHBytes(
  transactions: ReadonlyArray<Transaction>
): ReadonlyArray<HBytes>;
/**
 * Converts a transaction object or a list of those into transaction hbytes.
 *
 * @method asTransactionHBytes
 *
 * @param {Transaction | Transaction[]} transactions - Transaction object(s)
 *
 * @return {HBytes | HBytes[]} Transaction hbytes
 */
export function asTransactionHBytes(
  transactions: Transaction | ReadonlyArray<Transaction>
): HBytes | ReadonlyArray<HBytes> {
  const txHBytes = asArray(transactions).map(transaction =>
    [
      transaction.signatureMessageFragment,
      transaction.address,
      hBitsToHBytes(
        padSignedHBits(TRANSACTION_VALUE_BITS_SIZE)(
          hbytesToHBits(transaction.value)
        )
      ),
      padHBytes(OBSOLETE_TAG_BYTE_SIZE)(transaction.obsoleteTag),
      hBitsToHBytes(
        padHBits(TRANSACTION_TIMESTAMP_BITS_SIZE)(
          hbytesToHBits(transaction.timestamp)
        )
      ),
      hBitsToHBytes(
        padHBits(TRANSACTION_CURRENT_INDEX_BITS_SIZE)(
          hbytesToHBits(transaction.currentIndex)
        )
      ),
      hBitsToHBytes(
        padHBits(TRANSACTION_LAST_INDEX_BITS_SIZE)(
          hbytesToHBits(transaction.lastIndex)
        )
      ),
      transaction.bundle,
      transaction.trunkTransaction,
      transaction.branchTransaction,
      padHBytes(OBSOLETE_TAG_BYTE_SIZE)(
        transaction.tag || transaction.obsoleteTag
      ),
      hBitsToHBytes(
        padHBits(TRANSACTION_TIMESTAMP_BITS_SIZE)(
          hbytesToHBits(transaction.attachmentTimestamp)
        )
      ),
      hBitsToHBytes(
        padHBits(TRANSACTION_TIMESTAMP_BITS_SIZE)(
          hbytesToHBits(transaction.attachmentTimestampLowerBound)
        )
      ),
      hBitsToHBytes(
        padHBits(TRANSACTION_TIMESTAMP_BITS_SIZE)(
          hbytesToHBits(transaction.attachmentTimestampUpperBound)
        )
      ),
      transaction.nonce
    ].join("")
  );

  return Array.isArray(transactions) ? txHBytes : txHBytes[0];
}

/**
 * Converts transaction hbytes of 2673 hbytes into a transaction object.
 *
 * @method asTransactionObject
 *
 * @param {HBytes} hbytes - Transaction hbytes
 *
 * @return {Transaction} Transaction object
 */
export const asTransactionObject = (
  hbytes: HBytes,
  hash?: Hash
): Transaction => {
  if (!isHBytesOfExactLength(hbytes, TRANSACTION_HBYTE_SIZE)) {
    throw new Error(errors.INVALID_HBYTES);
  }
  const hbits = hbytesToHBits(hbytes);

  const noOfBitsInBytes = 4;
  // TODO: check if this limitation is necessary:
  // previous value has been limitted to 11 trytes
  const usefulBytesFromValue = TRANSACTION_VALUE_BYTE_SIZE;
  const noOfBitsInValue = 4 * usefulBytesFromValue;

  const startIndexSignMsgFragBytes = 0;

  const startIndexAddressBytes =
    startIndexSignMsgFragBytes + SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE;
  const startIndexValueBytes = startIndexAddressBytes + ADDRESS_BYTE_SIZE;
  const startIndexObsoleteTagBytes =
    startIndexValueBytes + TRANSACTION_VALUE_BYTE_SIZE;

  // If the limitation is necessary this validation should be enabled otherwise removed
  // Value was represented using 27 trytes: 2268 -> 2295
  // Trits index 6804 -> 6885
  // Only first 11 trytes are used to store value all the other are expected to be 0
  // for (
  //   let i = startIndexValueBytes + usefulBytesFromValue;
  //   i < startIndexObsoleteTagBytes;
  //   i++
  // ) {
  //   if (hbytes.charAt(i) !== "0") {
  //     throw new Error(errors.INVALID_HBYTES);
  //   }
  // }

  const startIndexTimestampBytes =
    startIndexObsoleteTagBytes + OBSOLETE_TAG_BYTE_SIZE;
  const startIndexCurrIndexBytes =
    startIndexTimestampBytes + TRANSACTION_TIMESTAMP_BYTE_SIZE;
  const startIndexLastIndexBytes =
    startIndexCurrIndexBytes + TRANSACTION_CURRENT_INDEX_BYTE_SIZE;
  const startIndexBundleBytes =
    startIndexLastIndexBytes + TRANSACTION_LAST_INDEX_BYTE_SIZE;
  const startIndexTrunkTrasnBytes = startIndexBundleBytes + HASH_BYTE_SIZE;
  const startIndexBranchTrasnBytes = startIndexTrunkTrasnBytes + HASH_BYTE_SIZE;
  const startIndexTagTrasnBytes = startIndexBranchTrasnBytes + HASH_BYTE_SIZE;
  const startIndexTimestampTrasnBytes = startIndexTagTrasnBytes + TAG_BYTE_SIZE;
  const startIndexTimestampLowTrasnBytes =
    startIndexTimestampTrasnBytes + TRANSACTION_TIMESTAMP_BYTE_SIZE;
  const startIndexTimestampUpTrasnBytes =
    startIndexTimestampLowTrasnBytes + TRANSACTION_TIMESTAMP_LOWER_BOUND_SIZE;
  const startIndexNonceBytes =
    startIndexTimestampUpTrasnBytes + TRANSACTION_TIMESTAMP_UPPER_BOUND_SIZE;

  return {
    hash: hash || transactionHash(hbits),
    signatureMessageFragment: hbytes.slice(
      startIndexSignMsgFragBytes,
      startIndexSignMsgFragBytes + SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE
    ),
    address: hbytes.slice(
      startIndexAddressBytes,
      startIndexAddressBytes + ADDRESS_BYTE_SIZE
    ),
    value: value(
      hbits.slice(
        startIndexValueBytes * noOfBitsInBytes,
        startIndexValueBytes * noOfBitsInBytes + noOfBitsInValue
      )
    ), // 33 trits?
    obsoleteTag: hbytes.slice(
      startIndexObsoleteTagBytes,
      startIndexObsoleteTagBytes + OBSOLETE_TAG_BYTE_SIZE
    ), // 27 trytes
    timestamp: value(
      hbits.slice(
        noOfBitsInBytes * startIndexTimestampBytes,
        noOfBitsInBytes *
          (startIndexTimestampBytes + TRANSACTION_TIMESTAMP_BYTE_SIZE)
      )
    ), // 27 trits => 9 trytes
    currentIndex: value(
      hbits.slice(
        noOfBitsInBytes * startIndexCurrIndexBytes,
        noOfBitsInBytes *
          (startIndexCurrIndexBytes + TRANSACTION_CURRENT_INDEX_BYTE_SIZE)
      )
    ), // 27 trits
    lastIndex: value(
      hbits.slice(
        startIndexLastIndexBytes * noOfBitsInBytes,
        noOfBitsInBytes *
          (startIndexLastIndexBytes + TRANSACTION_LAST_INDEX_BYTE_SIZE)
      )
    ), // 27 trits => 9 trytes
    bundle: hbytes.slice(
      startIndexBundleBytes,
      startIndexBundleBytes + HASH_BYTE_SIZE
    ), // 81 trytes
    trunkTransaction: hbytes.slice(
      startIndexTrunkTrasnBytes,
      startIndexTrunkTrasnBytes + HASH_BYTE_SIZE
    ), // 81 trytes
    branchTransaction: hbytes.slice(
      startIndexBranchTrasnBytes,
      startIndexBranchTrasnBytes + HASH_BYTE_SIZE
    ), // 81 trytes
    tag: hbytes.slice(
      startIndexTagTrasnBytes,
      startIndexTagTrasnBytes + TAG_BYTE_SIZE
    ), // 27 trytes
    attachmentTimestamp: value(
      hbits.slice(
        noOfBitsInBytes * startIndexTimestampTrasnBytes,
        noOfBitsInBytes *
          (startIndexTimestampTrasnBytes + TRANSACTION_TIMESTAMP_BYTE_SIZE)
      )
    ), // 27 trits
    attachmentTimestampLowerBound: value(
      hbits.slice(
        noOfBitsInBytes * startIndexTimestampLowTrasnBytes,
        noOfBitsInBytes *
          (startIndexTimestampLowTrasnBytes +
            TRANSACTION_TIMESTAMP_LOWER_BOUND_SIZE)
      )
    ), // 27 trits
    attachmentTimestampUpperBound: value(
      hbits.slice(
        noOfBitsInBytes * startIndexTimestampUpTrasnBytes,
        noOfBitsInBytes *
          (startIndexTimestampUpTrasnBytes +
            TRANSACTION_TIMESTAMP_UPPER_BOUND_SIZE)
      )
    ), // 27 trits
    nonce: hbytes.slice(
      startIndexNonceBytes,
      startIndexNonceBytes + NONCE_BYTE_SIZE
    ) // 27 trytes
  };
};

/**
 * Converts a list of transaction hbytes into list of transaction objects.
 * Accepts a list of hashes and returns a mapper. In cases hashes are given,
 * the mapper function map them to converted objects.
 *
 * @method asTransactionObjects
 *
 * @param {Hash[]} [hashes] - Optional list of known hashes.
 * Known hashes are directly mapped to transaction objects,
 * otherwise all hashes are being recalculated.
 *
 * @return {Function} {@link #module_transaction.transactionObjectsMapper `transactionObjectsMapper`}
 */
export const asTransactionObjects = (hashes?: ReadonlyArray<Hash>) => {
  /**
   * Maps the list of given hashes to a list of converted transaction objects.
   *
   * @method transactionObjectsMapper
   *
   * @param {HBytes[]} hbytes - List of transaction hbytes to convert
   *
   * @return {Transaction[]} List of transaction objects with hashes
   */
  return function transactionObjectsMapper(hbytes: ReadonlyArray<HBytes>) {
    return hbytes.map((hByteString, i) =>
      asTransactionObject(hByteString, hashes![i])
    );
  };
};

export const asFinalTransactionHBytes = (
  transactions: ReadonlyArray<Transaction>
) => [...asTransactionHBytes(transactions)].reverse();

export const transactionObject = (hBytes: HBytes): Transaction => {
  /* tslint:disable-next-line:no-console */
  console.warn("`transactionObject` has been renamed to `asTransactionObject`");

  return asTransactionObject(hBytes);
};

export const transactionHBytes = (transaction: Transaction): HBytes => {
  /* tslint:disable-next-line:no-console */
  console.warn("`transactionHBytes` has been renamed to `asTransactionHBytes`");

  return asTransactionHBytes(transaction);
};
