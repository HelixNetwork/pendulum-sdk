/**
 * @module transaction
 */

import { hbytesToHBits, hex } from "@helixnetwork/converter";
import HHash from "@helixnetwork/hash-module";
import {
  HASH_HBYTE_SIZE,
  NONCE_BYTE_SIZE,
  OBSOLETE_TAG_BYTE_SIZE,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE,
  TAG_BYTE_SIZE,
  TRANSACTION_HBYTE_SIZE
} from "../../constants";
import * as errors from "../../errors";
import {
  isAddress,
  isArray,
  isHash,
  isHBytesOfExactLength,
  validate,
  Validator
} from "../../guards";
import { Hash, HBytes, Transaction } from "../../types";

/**
 * Calculates the transaction hash out of 8019 transaction hbits.
 *
 * @method transactionHash
 *
 * @param {Int8Array} hBits - Int8Array of 8019 transaction hbits
 *
 * @return {Hash} Transaction hash
 */
export const transactionHash = (hBits: Int8Array): Hash => {
  const hHash = new HHash(HHash.HASH_ALGORITHM_2);
  const hash: Int8Array = new Int8Array(hHash.getHashLength());

  // generate the transaction hash
  hHash.initialize();
  hHash.absorb(hBits, 0, hBits.length);
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
    isHBytesOfExactLength(
      tx.signatureMessageFragment,
      SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE
    ) &&
    isAddress(tx.address) &&
    Number.isInteger(tx.value) &&
    isHBytesOfExactLength(tx.obsoleteTag, OBSOLETE_TAG_BYTE_SIZE) &&
    Number.isInteger(tx.timestamp) &&
    (Number.isInteger(tx.currentIndex) &&
      tx.currentIndex >= 0 &&
      tx.currentIndex <= tx.lastIndex) &&
    Number.isInteger(tx.lastIndex) &&
    isHash(tx.bundle) &&
    isHash(tx.trunkTransaction) &&
    isHash(tx.branchTransaction) &&
    isHBytesOfExactLength(tx.tag, TAG_BYTE_SIZE) &&
    Number.isInteger(tx.attachmentTimestamp) &&
    Number.isInteger(tx.attachmentTimestampLowerBound) &&
    Number.isInteger(tx.attachmentTimestampUpperBound) &&
    isHBytesOfExactLength(tx.nonce, NONCE_BYTE_SIZE)
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
 * Checks if input is correct transaction hash (32 hbytes)
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
  const hasCorrectHashLength = isHBytesOfExactLength(hash, HASH_HBYTE_SIZE);

  if (minWeightMagnitude) {
    return (
      hasCorrectHashLength &&
      hbytesToHBits(hash)
        .slice(-Math.abs(minWeightMagnitude))
        .every(hBit => hBit === 0)
    );
  }

  return hasCorrectHashLength;
};

/**
 * Checks if input is correct transaction hbytes (2673 hbytes)
 *
 * @method isTransactionHBytes
 *
 * @param {string} hbytes
 * @param {number} minWeightMagnitude
 *
 * @return {boolean}
 */
export const isTransactionHBytes = (
  hbytes: any,
  minWeightMagnitude?: number
): hbytes is HBytes => {
  const hasCorrectHBytesLength = isHBytesOfExactLength(
    hbytes,
    TRANSACTION_HBYTE_SIZE
  );

  if (minWeightMagnitude) {
    return (
      hasCorrectHBytesLength &&
      isTransactionHash(
        transactionHash(hbytesToHBits(hbytes)),
        minWeightMagnitude
      )
    );
  }

  return hasCorrectHBytesLength;
};

/**
 * Checks if input is valid attached transaction hbytes.
 * For attached transactions last 64 hbytes are non-zero. // 241
 *
 * @method isAttachedHBytes
 *
 * @param {string} hbytes
 *
 * @return {boolean}
 */
export const isAttachedHBytes = (hbytes: any): hbytes is HBytes =>
  isHBytesOfExactLength(hbytes, TRANSACTION_HBYTE_SIZE) &&
  !/^[0]+$/.test(hbytes.slice(TRANSACTION_HBYTE_SIZE - 2 * HASH_HBYTE_SIZE));

export const isAttachedHBytesArray = isArray(isAttachedHBytes);
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

export const transactionHBytesValidator: Validator<HBytes> = (hbytes: any) => [
  hbytes,
  isTransactionHBytes,
  errors.INVALID_TRANSACTION_HBYTES
];

export const attachedHBytesValidator: Validator<HBytes> = (hbytes: any) => [
  hbytes,
  isAttachedHBytes,
  errors.INVALID_ATTACHED_HBYTES
];

export const validateTransaction = (transaction: any) =>
  validate(transactionValidator(transaction));
export const validateTailTransaction = (transaction: any) =>
  validate(tailTransactionValidator(transaction));
export const validateTransactionHash = (hash: any, msg?: string) =>
  validate(transactionHashValidator(hash, msg));
export const validateTransactionHBytes = (hbytes: any) =>
  validate(transactionHBytesValidator(hbytes));
export const validateAttachedHBytes = (hbytes: any) =>
  validate(attachedHBytesValidator(hbytes));
