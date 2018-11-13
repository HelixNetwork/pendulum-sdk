/** @module signing */

import { fromValue, hbits, hbytes, value } from "@helix/converter";
import Kerl from "@helix/kerl";
import { padHBits } from "@helix/pad";
import add from "./add";
import * as errors from "./errors";
import { Hash } from "../../types";
import {
  HASH_BYTE_SIZE,
  SIGNATURE_FRAGMENT_NO,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE_BITS
} from "../../constants";

/**
 * @method subseed
 *
 * @param {Int8Array} seed - Seed hbits
 * @param {number} index - Private key index
 *
 * @return {Int8Array} subseed hbits
 */
export function subseed(seed: Int8Array, index: number): Int8Array {
  if (index < 0) {
    throw new Error(errors.ILLEGAL_KEY_INDEX);
  }

  if (seed.length % 3 !== 0) {
    throw new Error(errors.ILLEGAL_SEED_LENGTH);
  }

  const indexHBits = fromValue(index);
  let subseed: Int8Array = add(seed, indexHBits);

  while (subseed.length % Kerl.HASH_LENGTH !== 0) {
    subseed = padHBits(subseed.length + 3)(subseed);
  }

  const kerl = new Kerl();

  kerl.initialize();
  kerl.absorb(subseed, 0, subseed.length);
  kerl.squeeze(subseed, 0, subseed.length);

  return subseed;
}

/**
 * @method key
 *
 * @param {Int8Array} subseed - Subseed hbits
 * @param {number} length - Private key length
 *
 * @return {Int8Array} Private key hbits
 */
export function key(subseed: Int8Array, length: number): Int8Array {
  if (subseed.length % 3 !== 0) {
    throw new Error(errors.ILLEGAL_SUBSEED_LENGTH);
  }

  const kerl = new Kerl();

  kerl.initialize();
  kerl.absorb(subseed, 0, subseed.length);

  const buffer = new Int8Array(Kerl.HASH_LENGTH);
  const result = new Int8Array(
    length * SIGNATURE_FRAGMENT_NO * Kerl.HASH_LENGTH
  );
  let offset = 0;

  while (length-- > 0) {
    for (let i = 0; i < SIGNATURE_FRAGMENT_NO; i++) {
      kerl.squeeze(buffer, 0, subseed.length);
      for (let j = 0; j < Kerl.HASH_LENGTH; j++) {
        result[offset++] = buffer[j];
      }
    }
  }
  return result;
}

/**
 * @method digests
 *
 * @param {Int8Array} key - Private key hbits
 *
 * @return {Int8Array}
 */
// tslint:disable-next-line no-shadowed-variable
export function digests(key: Int8Array): Int8Array {
  const l = Math.floor(key.length / SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE_BITS);
  const result = new Int8Array(l * Kerl.HASH_LENGTH);
  let buffer = new Int8Array(Kerl.HASH_LENGTH);

  for (let i = 0; i < l; i++) {
    const keyFragment = key.slice(
      i * SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE_BITS,
      (i + 1) * SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE_BITS
    );

    for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
      buffer = keyFragment.slice(
        j * Kerl.HASH_LENGTH,
        (j + 1) * Kerl.HASH_LENGTH
      );

      for (let k = 0; k < SIGNATURE_FRAGMENT_NO - 1; k++) {
        const keyFragmentKerl = new Kerl();

        keyFragmentKerl.initialize();
        keyFragmentKerl.absorb(buffer, 0, buffer.length);
        keyFragmentKerl.squeeze(buffer, 0, Kerl.HASH_LENGTH);
      }

      for (let k = 0; k < Kerl.HASH_LENGTH; k++) {
        keyFragment[j * Kerl.HASH_LENGTH + k] = buffer[k];
      }
    }

    const digestsKerl = new Kerl();

    digestsKerl.initialize();
    digestsKerl.absorb(keyFragment, 0, keyFragment.length);
    digestsKerl.squeeze(buffer, 0, Kerl.HASH_LENGTH);

    for (let j = 0; j < Kerl.HASH_LENGTH; j++) {
      result[i * Kerl.HASH_LENGTH + j] = buffer[j];
    }
  }
  return result;
}

/**
 * @method address
 *
 * @param {Int8Array} digests - Digests hbits
 *
 * @return {Int8Array} Address hbits
 */
// tslint:disable-next-line no-shadowed-variable
export function address(digests: Int8Array): Int8Array {
  const addressHBits = new Int8Array(Kerl.HASH_LENGTH);
  const kerl = new Kerl();

  kerl.initialize();
  kerl.absorb(digests.slice(), 0, digests.length);
  kerl.squeeze(addressHBits, 0, Kerl.HASH_LENGTH);

  return addressHBits;
}

/**
 * @method digest
 *
 * @param {array} normalizedBundleFragment - Normalized bundle fragment
 * @param {Int8Array} signatureFragment - Signature fragment hbits
 *
 * @return {Int8Array} Digest hbits
 */
// tslint:disable-next-line no-shadowed-variable
export function digest(
  normalizedBundleFragment: Int8Array,
  signatureFragment: Int8Array
): Int8Array {
  const digestKerl = new Kerl();

  digestKerl.initialize();

  let buffer = new Int8Array(Kerl.HASH_LENGTH);

  for (let i = 0; i < SIGNATURE_FRAGMENT_NO; i++) {
    buffer = signatureFragment.slice(
      i * Kerl.HASH_LENGTH,
      (i + 1) * Kerl.HASH_LENGTH
    );

    for (let j = normalizedBundleFragment[i] + 13; j-- > 0; ) {
      const signatureFragmentKerl = new Kerl();

      signatureFragmentKerl.initialize();
      signatureFragmentKerl.absorb(buffer, 0, Kerl.HASH_LENGTH);
      signatureFragmentKerl.squeeze(buffer, 0, Kerl.HASH_LENGTH);
    }

    digestKerl.absorb(buffer, 0, Kerl.HASH_LENGTH);
  }

  digestKerl.squeeze(buffer, 0, Kerl.HASH_LENGTH);
  return buffer;
}

/**
 * @method signatureFragment
 *
 * @param {array} normalizeBundleFragment - normalized bundle fragment
 * @param {keyFragment} keyFragment - key fragment hbits
 *
 * @return {Int8Array} Signature Fragment hbits
 */
export function signatureFragment(
  normalizedBundleFragment: Int8Array,
  keyFragment: Int8Array
): Int8Array {
  const sigFragment = keyFragment.slice();

  const kerl = new Kerl();

  for (let i = 0; i < SIGNATURE_FRAGMENT_NO; i++) {
    const hash = sigFragment.slice(
      i * Kerl.HASH_LENGTH,
      (i + 1) * Kerl.HASH_LENGTH
    );

    for (let j = 0; j < 13 - normalizedBundleFragment[i]; j++) {
      kerl.initialize();
      kerl.reset();
      kerl.absorb(hash, 0, Kerl.HASH_LENGTH);
      kerl.squeeze(hash, 0, Kerl.HASH_LENGTH);
    }

    for (let j = 0; j < Kerl.HASH_LENGTH; j++) {
      sigFragment[i * Kerl.HASH_LENGTH + j] = hash[j];
    }
  }

  return sigFragment;
}

/**
 * @method validateSignatures
 *
 * @param {string} expectedAddress - Expected address hbytes
 * @param {array} signatureFragments - Array of signatureFragments hbytes
 * @param {string} bundleHash - Bundle hash hbytes
 *
 * @return {boolean}
 */
export function validateSignatures(
  expectedAddress: string,
  signatureFragments: ReadonlyArray<string>,
  bundleHash: string
): boolean {
  if (!bundleHash) {
    throw new Error(errors.INVALID_BUNDLE_HASH);
  }

  const normalizedBundleFragments = [];
  const normalizedBundle = normalizedBundleHash(bundleHash);

  // Split hash into 3 fragments
  for (let i = 0; i < 3; i++) {
    normalizedBundleFragments[i] = normalizedBundle.slice(
      i * SIGNATURE_FRAGMENT_NO,
      (i + 1) * SIGNATURE_FRAGMENT_NO
    );
  }

  // Get digests
  // tslint:disable-next-line no-shadowed-variable
  const digests = new Int8Array(signatureFragments.length * Kerl.HASH_LENGTH);

  for (let i = 0; i < signatureFragments.length; i++) {
    const digestBuffer = digest(
      normalizedBundleFragments[i % 3],
      hbits(signatureFragments[i])
    );

    for (let j = 0; j < Kerl.HASH_LENGTH; j++) {
      digests[i * Kerl.HASH_LENGTH + j] = digestBuffer[j];
    }
  }

  return expectedAddress === hbytes(address(digests));
}

/**
 * Normalizes the bundle hash, with resulting digits summing to zero.
 *
 * @method normalizedBundleHash
 *
 * @param {Hash} bundlehash - Bundle hash hbytes
 *
 * @return {Int8Array} Normalized bundle hash
 */
export const normalizedBundleHash = (bundleHash: Hash): Int8Array => {
  const normalizedBundle = new Int8Array(HASH_BYTE_SIZE);

  for (let i = 0; i < 3; i++) {
    let sum = 0;
    for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
      sum += normalizedBundle[i * SIGNATURE_FRAGMENT_NO + j] = value(
        hbits(bundleHash.charAt(i * SIGNATURE_FRAGMENT_NO + j))
      );
    }

    if (sum >= 0) {
      while (sum-- > 0) {
        for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
          if (normalizedBundle[i * SIGNATURE_FRAGMENT_NO + j] > -13) {
            normalizedBundle[i * SIGNATURE_FRAGMENT_NO + j]--;
            break;
          }
        }
      }
    } else {
      while (sum++ < 0) {
        for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
          if (normalizedBundle[i * SIGNATURE_FRAGMENT_NO + j] < 13) {
            normalizedBundle[i * SIGNATURE_FRAGMENT_NO + j]++;
            break;
          }
        }
      }
    }
  }

  return normalizedBundle;
};
