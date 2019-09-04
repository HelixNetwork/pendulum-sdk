/**
 * @module validators
 */

import * as errors from "../../errors";
export { errors };

/* Address related guards & validators */
import { isValidChecksum } from "@helixnetwork/checksum";

/**
 * Checks integrity of given address by validating the checksum.
 *
 * @method isAddress
 *
 * @param {string} address - Address txs, with checksum
 *
 * @return {boolean}
 */
export const isAddress = (address: any) => {
  let isValid = false;

  try {
    isValid = isValidChecksum(address);
  } catch (err) {
    return false;
  }
  return isValid;
};

export const addressValidator = (address: any) => [address, isAddress];

/* Misc */
export {
  arrayValidator,
  depthValidator,
  hashValidator,
  inputValidator,
  isHash,
  isInput,
  isNinesTxHex,
  isEmpty,
  isSecurityLevel,
  isStartEndOptions,
  isTag,
  isTransfer,
  isTxHex,
  isTxHexOfExactLength,
  isTxHexOfMaxLength,
  isUri,
  minWeightMagnitudeValidator,
  securityLevelValidator,
  seedValidator,
  tagValidator,
  transferValidator,
  txHexValidator,
  uriValidator,
  validate,
  Validatable,
  Validator
} from "../../guards";

import {
  isAttachedTxHex,
  isTailTransaction,
  isTransaction,
  isTransactionHash,
  isTransactionTxHex,
  tailTransactionValidator,
  transactionHashValidator,
  transactionTxHexValidator,
  transactionValidator,
  validateAttachedTxHex,
  validateTailTransaction,
  validateTransaction,
  validateTransactionHash,
  validateTransactionTxHex
} from "@helixnetwork/transaction";

import {
  arrayValidator,
  isArray,
  isHash,
  isInput,
  isTag,
  isTransfer,
  isTxHex,
  isUri
} from "../../guards";

export const isAddressArray = isArray(isAddress);
export const isHashArray = isArray(isHash);
export const isInputArray = isArray(isInput);
export const isTagArray = isArray(isTag);
export const isTransferArray = isArray(isTransfer);
export const isTransfersArray = isTransferArray;
export const isTxHexArray = isArray((x: any) => isTxHex(x));
export const isUriArray = isArray(isUri);

/* Transaction guards & validators */

export {
  isAttachedTxHex,
  isAttachedTxHexArray,
  isTailTransaction,
  isTransaction,
  isTransactionArray,
  isTransactionTxHex,
  isTransactionHash,
  isTransactionHashArray,
  transactionHashValidator,
  transactionValidator,
  tailTransactionValidator,
  transactionTxHexValidator,
  attachedTxHexValidator
} from "@helixnetwork/transaction";
