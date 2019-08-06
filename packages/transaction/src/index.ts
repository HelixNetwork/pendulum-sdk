/**
 * @module transaction
 */

import { hex, toTxBytes, txsToTxBits } from "@helixnetwork/converter";
import HHash from "@helixnetwork/hash-module";
import {
  ADDRESS_HEX_SIZE,
  HASH_BITS_SIZE,
  HASH_TX_HEX_SIZE,
  NONCE_BYTE_HEX_SIZE,
  OBSOLETE_TAG_HEX_SIZE,
  SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE,
  START_INDEX_ATTACHED_TIMESTAMP_HEX,
  TAG_HEX_SIZE,
  TRANSACTION_CURRENT_INDEX_HEX_SIZE,
  TRANSACTION_LAST_INDEX_HEX_SIZE,
  TRANSACTION_TIMESTAMP_HEX_SIZE,
  TRANSACTION_TIMESTAMP_LOWER_BOUND_HEX_SIZE,
  TRANSACTION_TIMESTAMP_UPPER_BOUND_HEX_SIZE,
  TRANSACTION_TX_HEX_SIZE,
  TRANSACTION_VALUE_HEX_SIZE
} from "../../constants";
import * as errors from "../../errors";
import {
  isAddress,
  isArray,
  isHash,
  isTxHexOfExactLength,
  validate,
  Validator
} from "../../guards";
import { Hash, Transaction, TxHex } from "../../types";

export { Transaction };

/**
 * Calculates the transaction hash out of 768 transaction txBytes.
 *
 * @method transactionHash
 *
 * @param {Uint8Array} txBytes - Int8Array of 768 transaction txBytes
 *
 * @return {Hash} Transaction hash
 */
export const transactionHash = (txBytes: Uint8Array): Hash => {
  const hHash = new HHash(HHash.HASH_ALGORITHM_2);
  const hash: Uint8Array = new Uint8Array(hHash.getHashLength());

  // generate the transaction hash
  hHash.initialize();
  hHash.absorb(txBytes, 0, txBytes.length);
  hHash.squeeze(hash, 0, hHash.getHashLength());
  return hex(hash);
};

/* Type guards */

/**
 * Checks if input is valid transaction object.
 *
 * @method isTransaction
 *
 * @param {object} tx
 *
 * @return {boolean}
 */
export const isTransaction = (tx: any): tx is Transaction => {
  return (
    isHash(tx.hash) &&
    isTxHexOfExactLength(
      tx.signatureMessageFragment,
      SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE
    ) &&
    isAddress(tx.address) &&
    Number.isInteger(tx.value) &&
    isTxHexOfExactLength(tx.obsoleteTag, OBSOLETE_TAG_HEX_SIZE) &&
    Number.isInteger(tx.timestamp) &&
    (Number.isInteger(tx.currentIndex) &&
      tx.currentIndex >= 0 &&
      tx.currentIndex <= tx.lastIndex) &&
    Number.isInteger(tx.lastIndex) &&
    isHash(tx.bundle) &&
    isHash(tx.trunkTransaction) &&
    isHash(tx.branchTransaction) &&
    isTxHexOfExactLength(tx.tag, TAG_HEX_SIZE) &&
    Number.isInteger(tx.attachmentTimestamp) &&
    Number.isInteger(tx.attachmentTimestampLowerBound) &&
    Number.isInteger(tx.attachmentTimestampUpperBound) &&
    isTxHexOfExactLength(tx.nonce, NONCE_BYTE_HEX_SIZE)
  );
};

/**
 * Checks if given transaction object is tail transaction.
 * A tail transaction is one with `currentIndex=0`.
 *
 * @method isTailTransaction
 *
 * @param {object} transaction
 *
 * @return {boolean}
 */
export const isTailTransaction = (
  transaction: any
): transaction is Transaction =>
  isTransaction(transaction) && transaction.currentIndex === 0;

/**
 * Checks if input is correct transaction hash (32 txs)
 *
 * @method isTransactionHash
 *
 * @param {string} hash
 * @param {number} mwm
 *
 * @return {boolean}
 */
export const isTransactionHash = (
  hash: any,
  minWeightMagnitude?: number
): hash is Hash => {
  const hasCorrectHashLength = isTxHexOfExactLength(hash, HASH_TX_HEX_SIZE);

  if (minWeightMagnitude) {
    return (
      hasCorrectHashLength &&
      txsToTxBits(hash)
        .slice(-Math.abs(minWeightMagnitude))
        .every(hBit => hBit === 0)
    );
  }

  return hasCorrectHashLength;
};

/**
 * Checks if input is correct transaction txs (1536 txs)
 *
 * @method isTransactionTxHex
 *
 * @param {string} txs
 * @param {number} minWeightMagnitude
 *
 * @return {boolean}
 */
export const isTransactionTxHex = (
  txs: any,
  minWeightMagnitude?: number
): txs is TxHex => {
  const hasCorrectTxHexLength = isTxHexOfExactLength(
    txs,
    TRANSACTION_TX_HEX_SIZE
  );

  if (minWeightMagnitude) {
    return (
      hasCorrectTxHexLength &&
      isTransactionHash(transactionHash(toTxBytes(txs)), minWeightMagnitude)
    );
  }

  return hasCorrectTxHexLength;
};

/**
 * Checks if input is valid attached transaction txs.
 * For attached transactions last 64 txs are non-zero. // 241
 *
 * @method isAttachedTxHex
 *
 * @param {string} txs
 *
 * @return {boolean}
 */
export const isAttachedTxHex = (txs: any): txs is TxHex =>
  isTxHexOfExactLength(txs, TRANSACTION_TX_HEX_SIZE) &&
  txs
    .slice(
      START_INDEX_ATTACHED_TIMESTAMP_HEX,
      START_INDEX_ATTACHED_TIMESTAMP_HEX + TRANSACTION_TIMESTAMP_HEX_SIZE
    )
    .search("0") !== -1;

export const isAttachedTxHexArray = isArray(isAttachedTxHex);
export const isTransactionArray = isArray(isTransaction);
export const isTransactionHashArray = isArray(isTransactionHash);

/* Validators */

export const transactionValidator: Validator<Transaction> = (
  transaction: any
) => [transaction, isTransaction, errors.INVALID_TRANSACTION];

export const tailTransactionValidator: Validator<Transaction> = (
  transaction: any
) => [transaction, isTailTransaction, errors.INVALID_TAIL_TRANSACTION];

export const transactionHashValidator: Validator<Hash> = (
  hash: any,
  msg?: string
) => [hash, isTransactionHash, msg || errors.INVALID_TRANSACTION_HASH];

export const transactionTxHexValidator: Validator<TxHex> = (txs: any) => [
  txs,
  isTransactionTxHex,
  errors.INVALID_TRANSACTION_TX_HEX
];

export const attachedTxHexValidator: Validator<TxHex> = (txs: any) => [
  txs,
  isAttachedTxHex,
  errors.INVALID_ATTACHED_TX_HEX
];

export const validateTransaction = (transaction: any) =>
  validate(transactionValidator(transaction));
export const validateTailTransaction = (transaction: any) =>
  validate(tailTransactionValidator(transaction));
export const validateTransactionHash = (hash: any, msg?: string) =>
  validate(transactionHashValidator(hash, msg));
export const validateTransactionTxHex = (txs: any) =>
  validate(transactionTxHexValidator(txs));
export const validateAttachedTxHex = (txs: any) =>
  validate(attachedTxHexValidator(txs));
