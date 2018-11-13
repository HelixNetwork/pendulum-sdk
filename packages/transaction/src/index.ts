/**
 * @module transaction
 */

import { hBitsToHBytes, hbytesToHBits } from "@helix/converter";
import Curl from "@helix/curl";
import * as errors from "../../errors";
import {
  isArray,
  isHash,
  isHBytesOfExactLength,
  validate,
  Validator
} from "../../guards";
import { Hash, Transaction, HBytes } from "../../types";
import {
  HASH_SIZE,
  NONCE_HBYTES_SIZE,
  OBSOLETE_TAG_HBYTES_SIZE,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTES_SIZE,
  TAG_HBYTES_SIZE,
  TRANSACTION_HBYTES_SIZE
} from "./constants";

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
  const hash: Int8Array = new Int8Array(Curl.HASH_LENGTH);
  const curl = new Curl();

  // generate the transaction hash
  curl.initialize();
  curl.absorb(hBits, 0, hBits.length);
  curl.squeeze(hash, 0, Curl.HASH_LENGTH);

  return hBitsToHBytes(hash);
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
export const isTransaction = (tx: any): tx is Transaction =>
  isHash(tx.hash) &&
  isHBytesOfExactLength(
    tx.signatureMessageFragment,
    SIGNATURE_MESSAGE_FRAGMENT_HBYTES_SIZE
  ) &&
  isHash(tx.address) &&
  Number.isInteger(tx.value) &&
  isHBytesOfExactLength(tx.obsoleteTag, OBSOLETE_TAG_HBYTES_SIZE) &&
  Number.isInteger(tx.timestamp) &&
  (Number.isInteger(tx.currentIndex) &&
    tx.currentIndex >= 0 &&
    tx.currentIndex <= tx.lastIndex) &&
  Number.isInteger(tx.lastIndex) &&
  isHash(tx.bundle) &&
  isHash(tx.trunkTransaction) &&
  isHash(tx.branchTransaction) &&
  isHBytesOfExactLength(tx.tag, TAG_HBYTES_SIZE) &&
  Number.isInteger(tx.attachmentTimestamp) &&
  Number.isInteger(tx.attachmentTimestampLowerBound) &&
  Number.isInteger(tx.attachmentTimestampUpperBound) &&
  isHBytesOfExactLength(tx.nonce, NONCE_HBYTES_SIZE);

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
 * Checks if input is correct transaction hash (81 hbytes)
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
  const hasCorrectHashLength = isHBytesOfExactLength(hash, HASH_SIZE);

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
    TRANSACTION_HBYTES_SIZE
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
 * For attached transactions last 241 hbytes are non-zero.
 *
 * @method isAttachedHBytes
 *
 * @param {string} hbytes
 *
 * @return {boolean}
 */
export const isAttachedHBytes = (hbytes: any): hbytes is HBytes =>
  isHBytesOfExactLength(hbytes, TRANSACTION_HBYTES_SIZE) &&
  !/^[9]+$/.test(hbytes.slice(TRANSACTION_HBYTES_SIZE - 3 * HASH_SIZE));

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
