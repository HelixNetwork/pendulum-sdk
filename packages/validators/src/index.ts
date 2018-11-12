/**
 * @module validators
 */

import * as errors from "../../errors";
export { errors };

/* Address related guards & validators */
import { isValidChecksum } from "@helix/checksum";

/**
 * Checks integrity of given address by validating the checksum.
 *
 * @method isAddress
 *
 * @param {string} address - Address hbytes, with checksum
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
  isNinesHBytes,
  isEmpty,
  isSecurityLevel,
  isStartEndOptions,
  isTag,
  isTransfer,
  isHBytes,
  isHBytesOfExactLength,
  isHBytesOfMaxLength,
  isUri,
  minWeightMagnitudeValidator,
  securityLevelValidator,
  seedValidator,
  tagValidator,
  transferValidator,
  hbytesValidator,
  uriValidator,
  validate,
  Validatable,
  Validator
} from "../../guards";

import {
  isAttachedHBytes,
  isTailTransaction,
  isTransaction,
  isTransactionHash,
  isTransactionHBytes,
  tailTransactionValidator,
  transactionHashValidator,
  transactionHBytesValidator,
  transactionValidator,
  validateAttachedHBytes,
  validateTailTransaction,
  validateTransaction,
  validateTransactionHash,
  validateTransactionHBytes
} from "@helix/transaction";

import {
  arrayValidator,
  isArray,
  isHash,
  isInput,
  isTag,
  isTransfer,
  isHBytes,
  isUri
} from "../../guards";

export const isAddressArray = isArray(isAddress);
export const isHashArray = isArray(isHash);
export const isInputArray = isArray(isInput);
export const isTagArray = isArray(isTag);
export const isTransferArray = isArray(isTransfer);
export const isTransfersArray = isTransferArray;
export const isHBytesArray = isArray((x: any) => isHBytes(x));
export const isUriArray = isArray(isUri);

/* Transaction guards & validators */

export {
  isAttachedHBytes,
  isAttachedHBytesArray,
  isTailTransaction,
  isTransaction,
  isTransactionArray,
  isTransactionHBytes,
  isTransactionHash,
  isTransactionHashArray,
  transactionHashValidator,
  transactionValidator,
  tailTransactionValidator,
  transactionHBytesValidator,
  attachedHBytesValidator
} from "@helix/transaction";
