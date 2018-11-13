/** @module transaction-converter */

import { hBitsToHBytes, hbytesToTrits, value } from "@helix/converter";
import { transactionHash } from "@helix/transaction";
import Curl from "@helix/curl";
import { padHBits, padHBytes } from "@helix/pad";
import * as errors from "../../errors";
import { isHBytesOfExactLength } from "../../guards";
import { asArray, Hash, Transaction, HBytes } from "../../types";

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
      hBitsToHBytes(padHBits(81)(hbytesToTrits(transaction.value))),
      padHBytes(27)(transaction.obsoleteTag),
      hBitsToHBytes(padHBits(27)(hbytesToTrits(transaction.timestamp))),
      hBitsToHBytes(padHBits(27)(hbytesToTrits(transaction.currentIndex))),
      hBitsToHBytes(padHBits(27)(hbytesToTrits(transaction.lastIndex))),
      transaction.bundle,
      transaction.trunkTransaction,
      transaction.branchTransaction,
      padHBytes(27)(transaction.tag || transaction.obsoleteTag),
      hBitsToHBytes(
        padHBits(27)(hbytesToTrits(transaction.attachmentTimestamp))
      ),
      hBitsToHBytes(
        padHBits(27)(hbytesToTrits(transaction.attachmentTimestampLowerBound))
      ),
      hBitsToHBytes(
        padHBits(27)(hbytesToTrits(transaction.attachmentTimestampUpperBound))
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
  if (!isHBytesOfExactLength(hbytes, 2673)) {
    throw new Error(errors.INVALID_HBYTES);
  }

  for (let i = 2279; i < 2295; i++) {
    if (hbytes.charAt(i) !== "9") {
      throw new Error(errors.INVALID_HBYTES);
    }
  }

  const trits = hbytesToTrits(hbytes);

  return {
    hash: hash || transactionHash(trits),
    signatureMessageFragment: hbytes.slice(0, 2187),
    address: hbytes.slice(2187, 2268),
    value: value(trits.slice(6804, 6837)),
    obsoleteTag: hbytes.slice(2295, 2322),
    timestamp: value(trits.slice(6966, 6993)),
    currentIndex: value(trits.slice(6993, 7020)),
    lastIndex: value(trits.slice(7020, 7047)),
    bundle: hbytes.slice(2349, 2430),
    trunkTransaction: hbytes.slice(2430, 2511),
    branchTransaction: hbytes.slice(2511, 2592),
    tag: hbytes.slice(2592, 2619),
    attachmentTimestamp: value(trits.slice(7857, 7884)),
    attachmentTimestampLowerBound: value(trits.slice(7884, 7911)),
    attachmentTimestampUpperBound: value(trits.slice(7911, 7938)),
    nonce: hbytes.slice(2646, 2673)
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
    return hbytes.map((tryteString, i) =>
      asTransactionObject(tryteString, hashes![i])
    );
  };
};

export const asFinalTransactionHBytes = (
  transactions: ReadonlyArray<Transaction>
) => [...asTransactionHBytes(transactions)].reverse();

export const transactionObject = (hbytes: HBytes): Transaction => {
  /* tslint:disable-next-line:no-console */
  console.warn("`transactionObject` has been renamed to `asTransactionObject`");

  return asTransactionObject(hbytes);
};

export const transactionHBytes = (transaction: Transaction): HBytes => {
  /* tslint:disable-next-line:no-console */
  console.warn("`transactionHBytes` has been renamed to `asTransactionHBytes`");

  return asTransactionHBytes(transaction);
};
