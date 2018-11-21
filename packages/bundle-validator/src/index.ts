/** @module bundle-validator */

import { hbits, hbytes, hex } from "@helix/converter";
import HHash from "@helix/hash-module";
import { validateSignatures } from "@helix/signing";
import { isTransaction } from "@helix/transaction";
import { asTransactionHBytes } from "@helix/transaction-converter";
import * as errors from "../../errors";
import { isArray, Validator } from "../../guards";
import { Bundle, Hash, Transaction, HBytes } from "../../types";
import {
  ADDRESS_BYTE_SIZE,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE,
  TRANSACTION_VALUE_BYTE_SIZE
} from "../../constants";

interface SignatureFragments {
  readonly [key: string]: ReadonlyArray<HBytes>;
}

const BYTE_SIZE_USED_FOR_VALIDATION =
  ADDRESS_BYTE_SIZE + TRANSACTION_VALUE_BYTE_SIZE; // previous 162
/**
 * Validates all signatures of a bundle.
 *
 * @method validateSignatures
 *
 * @param {Transaction[]} bundle
 *
 * @return {boolean}
 */
export const validateBundleSignatures = (bundle: Bundle): boolean => {
  const signatures: SignatureFragments = [...bundle]
    .sort((a, b) => a.currentIndex - b.currentIndex)
    .reduce(
      (
        acc: SignatureFragments,
        { address, signatureMessageFragment, value },
        i
      ) =>
        value < 0
          ? {
              ...acc,
              [address]: [signatureMessageFragment]
            }
          : value === 0 &&
            acc.hasOwnProperty(address) &&
            address === bundle[i - 1].address
            ? {
                ...acc,
                [address]: acc[address].concat(signatureMessageFragment)
              }
            : acc,
      {}
    );
  return Object.keys(signatures).every(address => {
    return validateSignatures(address, signatures[address], bundle[0].bundle);
  });
};

/**
 * Checks if a bundle is _syntactically_ valid.
 * Validates signatures and overall structure.
 *
 * @method isBundle
 *
 * @param {Transaction[]} bundle
 *
 * @returns {boolean}
 */
export default function isBundle(bundle: Bundle) {
  if (!isArray(isTransaction)(bundle)) {
    return false;
  }

  let totalSum = 0;
  const bundleHash = bundle[0].bundle;
  const hhash = new HHash(HHash.HASH_ALGORITHM_1);
  hhash.initialize();

  // Prepare for signature validation
  const signaturesToValidate: Array<{
    address: Hash;
    signatureFragments: HBytes[];
  }> = [];
  bundle.forEach((bundleTx, index) => {
    totalSum += bundleTx.value;

    // currentIndex has to be equal to the index in the array
    if (bundleTx.currentIndex !== index) {
      return false;
    }

    // Get the transaction hbytes
    const thisTxHBytes = asTransactionHBytes(bundleTx);
    const thisTxHBits = hbits(
      thisTxHBytes.slice(
        SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE,
        SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE + BYTE_SIZE_USED_FOR_VALIDATION
      )
    );
    hhash.absorb(thisTxHBits, 0, thisTxHBits.length);

    // Check if input transaction
    if (bundleTx.value < 0) {
      const thisAddress = bundleTx.address;

      const newSignatureToValidate = {
        address: thisAddress,
        signatureFragments: Array(bundleTx.signatureMessageFragment)
      };

      // Find the subsequent txs with the remaining signature fragment
      for (let i = index; i < bundle.length - 1; i++) {
        const newBundleTx = bundle[i + 1];

        // Check if new tx is part of the signature fragment
        if (newBundleTx.address === thisAddress && newBundleTx.value === 0) {
          newSignatureToValidate.signatureFragments.push(
            newBundleTx.signatureMessageFragment
          );
        }
      }

      signaturesToValidate.push(newSignatureToValidate);
    }
  });

  // Check for total sum, if not equal 0 return error
  if (totalSum !== 0) {
    return false;
  }

  // Prepare to absorb txs and get bundleHash
  const bundleFromTxs: Int8Array = new Int8Array(hhash.getHashLength());

  // get the bundle hash from the bundle transactions
  hhash.squeeze(bundleFromTxs, 0, hhash.getHashLength());

  const bundleHashFromTxs = hex(bundleFromTxs);

  // Check if bundle hash is the same as returned by tx object
  if (bundleHashFromTxs !== bundleHash) {
    console.log(
      "bundleHashFromTxs return false should be: " +
        bundleHashFromTxs +
        " - not: " +
        bundleHash
    );
    return false;
  }

  // Last tx in the bundle should have currentIndex === lastIndex
  if (
    bundle[bundle.length - 1].currentIndex !==
    bundle[bundle.length - 1].lastIndex
  ) {
    return false;
  }
  return validateBundleSignatures(bundle);
}

export const bundleValidator: Validator<Bundle> = (bundle: Bundle) => [
  bundle,
  isBundle,
  errors.INVALID_BUNDLE
];
