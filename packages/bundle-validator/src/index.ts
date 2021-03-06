/** @module bundle-validator */

import { hex, toTxBytes } from "@helixnetwork/converter";
import HHash from "@helixnetwork/hash-module";
import { padTxHex } from "@helixnetwork/pad";
import { isTransaction } from "@helixnetwork/transaction";
import { asTransactionStrings } from "@helixnetwork/transaction-converter";
import { validateSignatures } from "@helixnetwork/winternitz";
import {
  HEX_SIZE_FOR_TXHEX_USED_FOR_VALIDATION,
  HEX_SIZE_FOR_TXHEX_USED_FOR_VALIDATION_WITH_PADDING,
  SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE
} from "../../constants";
import { INVALID_BUNDLE } from "../../errors";
import { isArray, Validator } from "../../guards";
import { Bundle, Hash, Transaction, TxHex } from "../../types";

interface SignatureFragments {
  readonly [key: string]: ReadonlyArray<TxHex>;
}

export { Transaction, Bundle, INVALID_BUNDLE };

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
    console.warn("bundle is no a transaction");
    return false;
  }

  let totalSum = 0;
  const bundleHash = bundle[0].bundle;
  const hhash = new HHash(HHash.HASH_ALGORITHM_1);
  hhash.initialize();

  // Prepare for signature validation
  const signaturesToValidate: Array<{
    address: Hash;
    signatureFragments: TxHex[];
  }> = [];
  bundle.forEach((bundleTx, index) => {
    totalSum += bundleTx.value;

    // currentIndex has to be equal to the index in the array
    if (bundleTx.currentIndex !== index) {
      console.warn("bundle is invalid because of wrong index");
      return false;
    }

    // Get the transaction transactionStrings
    const thisTxTxHex = asTransactionStrings(bundleTx);
    const thisTxBytes = toTxBytes(
      padTxHex(HEX_SIZE_FOR_TXHEX_USED_FOR_VALIDATION_WITH_PADDING)(
        thisTxTxHex.slice(
          SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE,
          SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE +
            HEX_SIZE_FOR_TXHEX_USED_FOR_VALIDATION
        )
      )
    );
    hhash.absorb(thisTxBytes, 0, thisTxBytes.length);

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
    console.warn("bundle is invalid because wrong sum");
    return false;
  }

  // Prepare to absorb txs and get bundleHash
  const bundleFromTxs: Uint8Array = new Uint8Array(hhash.getHashLength());

  // get the bundle hash from the bundle transactions
  hhash.squeeze(bundleFromTxs, 0, hhash.getHashLength());

  const bundleHashFromTxs = hex(bundleFromTxs);

  // Check if bundle hash is the same as returned by tx object
  if (bundleHashFromTxs !== bundleHash) {
    console.warn(
      "bundleHashFromTxs = " + bundleHashFromTxs + "  bundleHash =" + bundleHash
    );
    return false;
  }

  // Last tx in the bundle should have currentIndex === lastIndex
  if (
    bundle[bundle.length - 1].currentIndex !==
    bundle[bundle.length - 1].lastIndex
  ) {
    console.warn(
      "bundle is invalid last transaction does not have correct currentIndex " +
        bundle[bundle.length - 1].currentIndex
    );
    return false;
  }
  return validateBundleSignatures(bundle);
}

export const bundleValidator: Validator<Bundle> = (bundle: Bundle) => [
  bundle,
  isBundle,
  INVALID_BUNDLE
];
