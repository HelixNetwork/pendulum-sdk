/**
 * @module transaction
 */

import { txHexToTxBits, hex } from "@helixnetwork/converter";
import HHash from "@helixnetwork/hash-module";
import {
  ADDRESS_BYTE_SIZE,
  HASH_BITS_SIZE,
  HASH_TX_HEX_SIZE,
  NONCE_BYTE_SIZE,
  OBSOLETE_TAG_BYTE_SIZE,
  SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE,
  TAG_BYTE_SIZE,
  TRANSACTION_CURRENT_INDEX_BYTE_SIZE,
  TRANSACTION_TX_HEX_SIZE,
  TRANSACTION_LAST_INDEX_BYTE_SIZE,
  TRANSACTION_TIMESTAMP_BYTE_SIZE,
  TRANSACTION_TIMESTAMP_LOWER_BOUND_SIZE,
  TRANSACTION_TIMESTAMP_UPPER_BOUND_SIZE,
  TRANSACTION_VALUE_BYTE_SIZE
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
import { Hash, TxHex, Transaction } from "../../types";

export { Transaction };

export const START_INDEX_SIGNATURE_MESSAGE = 0;

export const START_INDEX_ADDRESS =
  START_INDEX_SIGNATURE_MESSAGE + SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE;
export const START_INDEX_VALUE = START_INDEX_ADDRESS + ADDRESS_BYTE_SIZE;
export const START_INDEX_OBSOLETE_TAG =
  START_INDEX_VALUE + TRANSACTION_VALUE_BYTE_SIZE;
export const START_INDEX_TIMESTAMP =
  START_INDEX_OBSOLETE_TAG + OBSOLETE_TAG_BYTE_SIZE;
export const START_INDEX_CURRENT_INDEX =
  START_INDEX_TIMESTAMP + TRANSACTION_TIMESTAMP_BYTE_SIZE;
export const START_INDEX_LAST_INDEX_BYTES =
  START_INDEX_CURRENT_INDEX + TRANSACTION_CURRENT_INDEX_BYTE_SIZE;
export const START_INDEX_BUNDLE =
  START_INDEX_LAST_INDEX_BYTES + TRANSACTION_LAST_INDEX_BYTE_SIZE;
export const START_TRUNK_TRANS = START_INDEX_BUNDLE + HASH_TX_HEX_SIZE;
export const START_BRANCH_TRANS = START_TRUNK_TRANS + HASH_TX_HEX_SIZE;
export const START_INDEX_TAG = START_BRANCH_TRANS + HASH_TX_HEX_SIZE;
export const START_INDEX_ATTACHED_TIMESTAMP = START_INDEX_TAG + TAG_BYTE_SIZE;
export const START_INDEX_TIMESTAMP_LOW =
  START_INDEX_ATTACHED_TIMESTAMP + TRANSACTION_TIMESTAMP_BYTE_SIZE;
export const START_INDEX_TIMESTAMP_UP =
  START_INDEX_TIMESTAMP_LOW + TRANSACTION_TIMESTAMP_LOWER_BOUND_SIZE;
export const START_INDEX_NONCE =
  START_INDEX_TIMESTAMP_UP + TRANSACTION_TIMESTAMP_UPPER_BOUND_SIZE;

/**
 * Calculates the transaction hash out of 8019 transaction txBytes.
 *
 * @method transactionHash
 *
 * @param {Uint8Array} txBytes - Int8Array of 8019 transaction txBytes
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
      SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE
    ) &&
    isAddress(tx.address) &&
    Number.isInteger(tx.value) &&
    isTxHexOfExactLength(tx.obsoleteTag, OBSOLETE_TAG_BYTE_SIZE) &&
    Number.isInteger(tx.timestamp) &&
    (Number.isInteger(tx.currentIndex) &&
      tx.currentIndex >= 0 &&
      tx.currentIndex <= tx.lastIndex) &&
    Number.isInteger(tx.lastIndex) &&
    isHash(tx.bundle) &&
    isHash(tx.trunkTransaction) &&
    isHash(tx.branchTransaction) &&
    isTxHexOfExactLength(tx.tag, TAG_BYTE_SIZE) &&
    Number.isInteger(tx.attachmentTimestamp) &&
    Number.isInteger(tx.attachmentTimestampLowerBound) &&
    Number.isInteger(tx.attachmentTimestampUpperBound) &&
    isTxHexOfExactLength(tx.nonce, NONCE_BYTE_SIZE)
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
 * Checks if input is correct transaction hash (32 txHex)
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
    console.log(
      hasCorrectHashLength &&
        txHexToTxBits(hash)
          .slice(-Math.abs(minWeightMagnitude))
          .every(hBit => hBit === 0)
    );

    return (
      hasCorrectHashLength &&
      txHexToTxBits(hash)
        .slice(-Math.abs(minWeightMagnitude))
        .every(hBit => hBit === 0)
    );
  }

  return hasCorrectHashLength;
};

/**
 * Checks if input is correct transaction txHex (2673 txHex)
 *
 * @method isTransactionTxHex
 *
 * @param {string} txHex
 * @param {number} minWeightMagnitude
 *
 * @return {boolean}
 */
export const isTransactionTxHex = (
  txHex: any,
  minWeightMagnitude?: number
): txHex is TxHex => {
  const hasCorrectTxHexLength = isTxHexOfExactLength(
    txHex,
    TRANSACTION_TX_HEX_SIZE
  );

  if (minWeightMagnitude) {
    return (
      hasCorrectTxHexLength &&
      isTransactionHash(
        transactionHash(txHex), //txHexToTxBits(txHex)
        minWeightMagnitude
      )
    );
  }

  return hasCorrectTxHexLength;
};

/**
 * Checks if input is valid attached transaction txHex.
 * For attached transactions last 64 txHex are non-zero. // 241
 *
 * @method isAttachedTxHex
 *
 * @param {string} txHex
 *
 * @return {boolean}
 */
export const isAttachedTxHex = (txHex: any): txHex is TxHex =>
  isTxHexOfExactLength(txHex, TRANSACTION_TX_HEX_SIZE) &&
  txHex
    .slice(
      START_INDEX_ATTACHED_TIMESTAMP,
      START_INDEX_ATTACHED_TIMESTAMP + TRANSACTION_TIMESTAMP_BYTE_SIZE
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

export const transactionTxHexValidator: Validator<TxHex> = (txHex: any) => [
  txHex,
  isTransactionTxHex,
  errors.INVALID_TRANSACTION_TX_HEX
];

export const attachedTxHexValidator: Validator<TxHex> = (txHex: any) => [
  txHex,
  isAttachedTxHex,
  errors.INVALID_ATTACHED_TX_HEX
];

export const validateTransaction = (transaction: any) =>
  validate(transactionValidator(transaction));
export const validateTailTransaction = (transaction: any) =>
  validate(tailTransactionValidator(transaction));
export const validateTransactionHash = (hash: any, msg?: string) =>
  validate(transactionHashValidator(hash, msg));
export const validateTransactionTxHex = (txHex: any) =>
  validate(transactionTxHexValidator(txHex));
export const validateAttachedTxHex = (txHex: any) =>
  validate(attachedTxHexValidator(txHex));
