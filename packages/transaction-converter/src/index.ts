/** @module transaction-converter */

import {
  txBitsToTxHex,
  txHexToTxBits,
  txBits,
  value,
  toTxBytes
} from "@helixnetwork/converter";
import HHash from "@helixnetwork/hash-module";
import { padHBits, padTxHex, padSignedHBits } from "@helixnetwork/pad";
import {
  START_INDEX_SIGNATURE_MESSAGE_HEX,
  transactionHash
} from "@helixnetwork/transaction";
import {
  START_BRANCH_TRANS_HEX,
  START_INDEX_ADDRESS_HEX,
  START_INDEX_ATTACHED_TIMESTAMP_HEX,
  START_INDEX_BUNDLE_HEX,
  START_INDEX_CURRENT_INDEX_HEX,
  START_INDEX_LAST_INDEX_HEX,
  START_INDEX_NONCE_HEX,
  START_INDEX_OBSOLETE_TAG_HEX,
  START_INDEX_TAG_HEX,
  START_INDEX_TIMESTAMP_HEX,
  START_INDEX_TIMESTAMP_LOW_HEX,
  START_INDEX_TIMESTAMP_UP_HEX,
  START_INDEX_VALUE_HEX,
  START_TRUNK_TRANS_HEX
} from "@helixnetwork/transaction/";
import {
  ADDRESS_HEX_SIZE,
  HASH_TX_HEX_SIZE,
  NONCE_BYTE_HEX_SIZE,
  OBSOLETE_TAG_HEX_SIZE,
  PAD_HEX_SIZE,
  SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE,
  TAG_HEX_SIZE,
  TRANSACTION_CURRENT_INDEX_BITS_SIZE,
  TRANSACTION_CURRENT_INDEX_HEX_SIZE,
  TRANSACTION_TX_HEX_SIZE,
  TRANSACTION_LAST_INDEX_BITS_SIZE,
  TRANSACTION_LAST_INDEX_HEX_SIZE,
  TRANSACTION_OBSOLETE_TAG_BITS_SIZE,
  TRANSACTION_TAG_BITS_SIZE,
  TRANSACTION_TIMESTAMP_BITS_SIZE,
  TRANSACTION_TIMESTAMP_HEX_SIZE,
  TRANSACTION_TIMESTAMP_LOWER_BOUND_HEX_SIZE,
  TRANSACTION_TIMESTAMP_UPPER_BOUND_HEX_SIZE,
  TRANSACTION_VALUE_BITS_SIZE,
  TRANSACTION_VALUE_HEX_SIZE
} from "../../constants";
import * as errors from "../../errors";
import { isTxHexOfExactLength } from "../../guards";
import { asArray, Hash, TxHex, Transaction } from "../../types";

export { Transaction };

export function asTransactionStrings(transactions: Transaction): TxHex;
export function asTransactionStrings(
  transactions: ReadonlyArray<Transaction>
): ReadonlyArray<TxHex>;
/**
 * Converts a transaction object or a list of those into transaction transactionStrings.
 *
 * @method asTransactionStrings
 *
 * @param {Transaction | Transaction[]} transactions - Transaction object(s)
 *
 * @return {TxHex | TxHex[]} Transaction transactionStrings
 */
export function asTransactionStrings(
  transactions: Transaction | ReadonlyArray<Transaction>
): TxHex | ReadonlyArray<TxHex> {
  asArray(transactions).forEach(transaction => {
    const val = txBitsToTxHex(txBits(transaction.value));
    const obsoleteTag = padTxHex(OBSOLETE_TAG_HEX_SIZE)(
      transaction.obsoleteTag
    );
    const attachedTimestamp = txBitsToTxHex(
      txBits(transaction.attachmentTimestamp)
    );
  });

  const txTxHex = asArray(transactions).map(transaction =>
    [
      transaction.signatureMessageFragment,
      transaction.address,
      padTxHex(TRANSACTION_VALUE_HEX_SIZE)(
        txBitsToTxHex(txBits(transaction.value))
      ),
      padTxHex(OBSOLETE_TAG_HEX_SIZE)(transaction.obsoleteTag),
      txBitsToTxHex(txBits(transaction.timestamp)),
      txBitsToTxHex(txBits(transaction.currentIndex)),
      txBitsToTxHex(txBits(transaction.lastIndex)),
      transaction.bundle,
      transaction.trunkTransaction,
      transaction.branchTransaction,
      padTxHex(TAG_HEX_SIZE)(
        transaction.tag || transaction.obsoleteTag
          ? transaction.obsoleteTag.length > TAG_HEX_SIZE
            ? transaction.obsoleteTag.slice(0, TAG_HEX_SIZE)
            : transaction.obsoleteTag
          : ""
      ),
      txBitsToTxHex(txBits(transaction.attachmentTimestamp)),
      txBitsToTxHex(txBits(transaction.attachmentTimestampLowerBound)),
      txBitsToTxHex(txBits(transaction.attachmentTimestampUpperBound)),
      transaction.nonce,
      "0".repeat(PAD_HEX_SIZE)
    ].join("")
  );

  return Array.isArray(transactions) ? txTxHex : txTxHex[0];
}

/**
 * Converts transaction transactionStrings of 2673 transactionStrings into a transaction object.
 *
 * @method asTransactionObject
 *
 * @param {TxHex} txHex - Transaction transactionStrings
 *
 * @return {Transaction} Transaction object
 */
export const asTransactionObject = (txHex: TxHex, hash?: Hash): Transaction => {
  if (!isTxHexOfExactLength(txHex, TRANSACTION_TX_HEX_SIZE)) {
    throw new Error(errors.INVALID_TX_HEX);
  }
  const txBits = txHexToTxBits(txHex);

  const noOfBitsInBytes = 4;
  const usefulBytesFromValue = TRANSACTION_VALUE_HEX_SIZE;
  const noOfBitsInValue = 4 * usefulBytesFromValue;

  return {
    hash: hash || transactionHash(toTxBytes(txHex)),
    signatureMessageFragment: txHex.slice(
      START_INDEX_SIGNATURE_MESSAGE_HEX,
      START_INDEX_SIGNATURE_MESSAGE_HEX + SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE
    ),
    address: txHex.slice(
      START_INDEX_ADDRESS_HEX,
      START_INDEX_ADDRESS_HEX + ADDRESS_HEX_SIZE
    ),
    value: value(
      txBits.slice(
        START_INDEX_VALUE_HEX * noOfBitsInBytes,
        START_INDEX_VALUE_HEX * noOfBitsInBytes + noOfBitsInValue
      )
    ),
    obsoleteTag: txHex.slice(
      START_INDEX_OBSOLETE_TAG_HEX,
      START_INDEX_OBSOLETE_TAG_HEX + OBSOLETE_TAG_HEX_SIZE
    ),
    timestamp: value(
      txBits.slice(
        noOfBitsInBytes * START_INDEX_TIMESTAMP_HEX,
        noOfBitsInBytes *
          (START_INDEX_TIMESTAMP_HEX + TRANSACTION_TIMESTAMP_HEX_SIZE)
      )
    ),
    currentIndex: value(
      txBits.slice(
        noOfBitsInBytes * START_INDEX_CURRENT_INDEX_HEX,
        noOfBitsInBytes *
          (START_INDEX_CURRENT_INDEX_HEX + TRANSACTION_CURRENT_INDEX_HEX_SIZE)
      )
    ),
    lastIndex: value(
      txBits.slice(
        START_INDEX_LAST_INDEX_HEX * noOfBitsInBytes,
        noOfBitsInBytes *
          (START_INDEX_LAST_INDEX_HEX + TRANSACTION_LAST_INDEX_HEX_SIZE)
      )
    ),
    bundle: txHex.slice(
      START_INDEX_BUNDLE_HEX,
      START_INDEX_BUNDLE_HEX + HASH_TX_HEX_SIZE
    ),
    trunkTransaction: txHex.slice(
      START_TRUNK_TRANS_HEX,
      START_TRUNK_TRANS_HEX + HASH_TX_HEX_SIZE
    ),
    branchTransaction: txHex.slice(
      START_BRANCH_TRANS_HEX,
      START_BRANCH_TRANS_HEX + HASH_TX_HEX_SIZE
    ),
    tag: txHex.slice(START_INDEX_TAG_HEX, START_INDEX_TAG_HEX + TAG_HEX_SIZE),
    attachmentTimestamp: value(
      txBits.slice(
        noOfBitsInBytes * START_INDEX_ATTACHED_TIMESTAMP_HEX,
        noOfBitsInBytes *
          (START_INDEX_ATTACHED_TIMESTAMP_HEX + TRANSACTION_TIMESTAMP_HEX_SIZE)
      )
    ),
    attachmentTimestampLowerBound: value(
      txBits.slice(
        noOfBitsInBytes * START_INDEX_TIMESTAMP_LOW_HEX,
        noOfBitsInBytes *
          (START_INDEX_TIMESTAMP_LOW_HEX +
            TRANSACTION_TIMESTAMP_LOWER_BOUND_HEX_SIZE)
      )
    ),
    attachmentTimestampUpperBound: value(
      txBits.slice(
        noOfBitsInBytes * START_INDEX_TIMESTAMP_UP_HEX,
        noOfBitsInBytes *
          (START_INDEX_TIMESTAMP_UP_HEX +
            TRANSACTION_TIMESTAMP_UPPER_BOUND_HEX_SIZE)
      )
    ),
    nonce: txHex.slice(
      START_INDEX_NONCE_HEX,
      START_INDEX_NONCE_HEX + NONCE_BYTE_HEX_SIZE
    )
  };
};

/**
 * Converts a list of transaction transactionStrings into list of transaction objects.
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
   * @param {TxHex[]} transactionStrings - List of transaction transactionStrings to convert
   *
   * @return {Transaction[]} List of transaction objects with hashes
   */
  return function transactionObjectsMapper(txHex: ReadonlyArray<TxHex>) {
    return txHex.map((txHexString, i) =>
      asTransactionObject(txHexString, hashes![i])
    );
  };
};

export const asFinalTransactionStrings = (
  transactions: ReadonlyArray<Transaction>
) => [...asTransactionStrings(transactions)].reverse();

export const transactionObject = (txHex: TxHex): Transaction => {
  /* tslint:disable-next-line:no-console */
  console.warn("`transactionObject` has been renamed to `asTransactionObject`");

  return asTransactionObject(txHex);
};

export const transactionTxHex = (transaction: Transaction): TxHex => {
  /* tslint:disable-next-line:no-console */
  console.warn("`transactionTxHex` has been renamed to `asTransactionStrings`");

  return asTransactionStrings(transaction);
};
