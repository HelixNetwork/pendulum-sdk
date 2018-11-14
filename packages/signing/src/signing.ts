/** @module signing */

import { fromValue, hbits, hbytes, value } from "@helix/converter";
import HHash from "@helix/hash-module";
import { padHBits } from "@helix/pad";
import add from "./add";
import * as errors from "./errors";
import { Hash } from "../../types";
import {
  ADDRESS_SIZE_BITS,
  HASH_BITS_SIZE,
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

  const hHash = new HHash(HHash.HASH_ALGORITHM_1);

  while (subseed.length % hHash.getHashLength() !== 0) {
    subseed = padHBits(subseed.length + 3)(subseed);
  }

  hHash.initialize();
  hHash.absorb(subseed, 0, subseed.length);
  hHash.squeeze(subseed, 0, subseed.length);

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

  const hHash = new HHash(HHash.HASH_ALGORITHM_1);

  hHash.initialize();
  hHash.absorb(subseed, 0, subseed.length);

  const buffer = new Int8Array(hHash.getHashLength());
  const result = new Int8Array(
    length * SIGNATURE_FRAGMENT_NO * hHash.getHashLength()
  );
  let offset = 0;

  while (length-- > 0) {
    for (let i = 0; i < SIGNATURE_FRAGMENT_NO; i++) {
      hHash.squeeze(buffer, 0, subseed.length);
      for (let j = 0; j < hHash.getHashLength(); j++) {
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
  const result = new Int8Array(l * HASH_BITS_SIZE);
  let buffer = new Int8Array(HASH_BITS_SIZE);

  for (let i = 0; i < l; i++) {
    const keyFragment = key.slice(
      i * SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE_BITS,
      (i + 1) * SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE_BITS
    );

    for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
      buffer = keyFragment.slice(j * HASH_BITS_SIZE, (j + 1) * HASH_BITS_SIZE);

      for (let k = 0; k < SIGNATURE_FRAGMENT_NO - 1; k++) {
        const keyFragmentHash = new HHash(HHash.HASH_ALGORITHM_1);

        keyFragmentHash.initialize();
        keyFragmentHash.absorb(buffer, 0, buffer.length);
        keyFragmentHash.squeeze(buffer, 0, keyFragmentHash.getHashLength());
      }

      for (let k = 0; k < HASH_BITS_SIZE; k++) {
        keyFragment[j * HASH_BITS_SIZE + k] = buffer[k];
      }
    }

    const digestsKerl = new HHash(HHash.HASH_ALGORITHM_1);

    digestsKerl.initialize();
    digestsKerl.absorb(keyFragment, 0, keyFragment.length);
    digestsKerl.squeeze(buffer, 0, HASH_BITS_SIZE);

    for (let j = 0; j < HASH_BITS_SIZE; j++) {
      result[i * HASH_BITS_SIZE + j] = buffer[j];
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
  const addressHBits = new Int8Array(ADDRESS_SIZE_BITS);
  const hHash = new HHash(HHash.HASH_ALGORITHM_1);

  hHash.initialize();
  hHash.absorb(digests.slice(), 0, digests.length);
  hHash.squeeze(addressHBits, 0, hHash.getHashLength());

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
  const digestHash = new HHash(HHash.HASH_ALGORITHM_1);

  digestHash.initialize();

  let buffer = new Int8Array(HASH_BITS_SIZE);

  for (let i = 0; i < SIGNATURE_FRAGMENT_NO; i++) {
    buffer = signatureFragment.slice(
      i * digestHash.getHashLength(),
      (i + 1) * digestHash.getHashLength()
    );

    for (let j = normalizedBundleFragment[i] + 13; j-- > 0; ) {
      const signatureFragmentHash = new HHash(HHash.HASH_ALGORITHM_1);

      signatureFragmentHash.initialize();
      signatureFragmentHash.absorb(
        buffer,
        0,
        signatureFragmentHash.getHashLength()
      );
      signatureFragmentHash.squeeze(
        buffer,
        0,
        signatureFragmentHash.getHashLength()
      );
    }

    digestHash.absorb(buffer, 0, digestHash.getHashLength());
  }

  digestHash.squeeze(buffer, 0, digestHash.getHashLength());
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

  const hHash = new HHash(HHash.HASH_ALGORITHM_1);

  for (let i = 0; i < SIGNATURE_FRAGMENT_NO; i++) {
    const hash = sigFragment.slice(
      i * hHash.getHashLength(),
      (i + 1) * hHash.getHashLength()
    );

    for (let j = 0; j < 13 - normalizedBundleFragment[i]; j++) {
      hHash.initialize();
      hHash.reset();
      hHash.absorb(hash, 0, hHash.getHashLength());
      hHash.squeeze(hash, 0, hHash.getHashLength());
    }

    for (let j = 0; j < hHash.getHashLength(); j++) {
      sigFragment[i * hHash.getHashLength() + j] = hash[j];
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
  const digests = new Int8Array(signatureFragments.length * HASH_BITS_SIZE);

  for (let i = 0; i < signatureFragments.length; i++) {
    const digestBuffer = digest(
      normalizedBundleFragments[i % 3],
      hbits(signatureFragments[i])
    );

    for (let j = 0; j < HASH_BITS_SIZE; j++) {
      digests[i * HASH_BITS_SIZE + j] = digestBuffer[j];
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
