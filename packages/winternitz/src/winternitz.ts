// by: Frauke Sophie Abben <fsa@hlx.ai> (https://hlx.ai)
import { hex, toHBytes } from "@helixnetwork/converter";
import { padByteArray } from "@helixnetwork/pad";
import Sha3 from "@helixnetwork/sha3";
import {
  HASH_BITS_SIZE,
  SECURITY_LEVELS,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE,
  SIGNATURE_TOTAL_BYTE_SIZE
} from "../../constants";
import * as errors from "./errors";

const BN = require("bcrypto/lib/bn.js");

// Winternitz signature parameters:

// Number of message bits signed with one key - compression rate
const w = 8;
// Number of security levels
const NUMBER_OF_SECURITY_LEVELS = SECURITY_LEVELS;
// Number of hash in bits
const HASH_LENGTH_BITS = HASH_BITS_SIZE; // 256
const HASH_LENGTH_BYTES = HASH_LENGTH_BITS / 8; // 32
// Number of message in bits
const m = HASH_BITS_SIZE; // 256
// Number of rounds to hash
const NUMBER_OF_ROUNDS = 2 ^ (w - 1); // 255
// Number of signature fragment bits
const NUMBER_OF_FRAGMENTS_CHUNKS = Math.floor(
  HASH_LENGTH_BYTES / NUMBER_OF_SECURITY_LEVELS
); // 16
// Specific security level sl can be between 1 and NUMBER_OF_SECURITY_LEVELS
// Signature key length = HASH_LENGTH_BITS * NUMBER_OF_FRAGMENTS_CHUNKS *sl
// Signature length security level 1
const FRAGMENT_LENGTH_BYTES = SIGNATURE_TOTAL_BYTE_SIZE; //must be equal with NUMBER_OF_FRAGMENTS_CHUNKS * HASH_LENGTH_BYTES; // 512
const MIDDLE_VALUE = 2 ^ (w - 1);

export function add(seed: Uint8Array, index: number): Uint8Array {
  const subseedBN: any = new BN(seed);
  const indexBN: any = new BN(index);
  return Uint8Array.from(subseedBN.add(indexBN).toArrayLike(Buffer, "be"));
}

/**
 * @method subseed
 *
 * @param {Uint8Array} seed - Seed toHBytes
 * @param {number} index - Private key index
 *
 * @return {Uint8Array} subseed
 */

export function subseed(seed: Uint8Array, index: number): Uint8Array {
  if (index < 0) {
    throw new Error(errors.ILLEGAL_KEY_INDEX);
  }
  if (seed.length % NUMBER_OF_SECURITY_LEVELS !== 0) {
    throw new Error(errors.ILLEGAL_SEED_LENGTH);
  }
  let result: Uint8Array = add(seed, index);
  while (result.length % HASH_LENGTH_BYTES !== 0) {
    result = padByteArray(HASH_LENGTH_BYTES)(result);
  }
  const sha3 = new Sha3();
  sha3.absorb(result, 0, result.length);
  sha3.squeeze(result, 0, result.length);

  return result;
}

/**
 * @method key
 *
 * @param {Uint8Array} subseed - Subseed
 * @param {number} securityLevel - security level (1 or 2)
 *
 * @return {Uint8Array} Private key
 */
export function key(subseed: Uint8Array, securityLevel: number): Uint8Array {
  if (subseed.length % FRAGMENT_LENGTH_BYTES !== 0) {
    throw new Error(errors.ILLEGAL_SUBSEED_LENGTH);
  }
  const sha3 = new Sha3();
  sha3.absorb(subseed, 0, subseed.length);

  if ([1, 2, 3, 4].indexOf(securityLevel) === -1) {
    throw new Error(errors.ILLEGAL_NUMBER_OF_FRAGMENTS);
  }

  const buffer = new Uint8Array(Sha3.HASH_LENGTH);
  const result = new Uint8Array(securityLevel * FRAGMENT_LENGTH_BYTES);
  let offset = 0;

  while (securityLevel-- > 0) {
    for (let i = 0; i < NUMBER_OF_FRAGMENTS_CHUNKS; i++) {
      sha3.squeeze(buffer, 0, Sha3.HASH_LENGTH);
      for (let j = 0; j < HASH_LENGTH_BYTES; j++) {
        result[offset++] = buffer[j];
      }
    }
  }
  return result;
}

/**
 * @method digests
 *
 * @param {Uint8Array} key - Private key
 *
 * @return {Uint8Array} Public key
 */
// tslint:disable-next-line no-shadowed-variable
export function digests(key: Uint8Array): Uint8Array {
  const l = Math.floor(key.length / FRAGMENT_LENGTH_BYTES); // security level (1 or 2)
  const result = new Uint8Array(l * FRAGMENT_LENGTH_BYTES);
  let buffer = new Uint8Array(Sha3.HASH_LENGTH);

  for (let i = 0; i < l; i++) {
    const keyFragment = key.slice(
      i * FRAGMENT_LENGTH_BYTES,
      (i + 1) * FRAGMENT_LENGTH_BYTES
    );

    for (let j = 0; j < NUMBER_OF_FRAGMENTS_CHUNKS; j++) {
      buffer = keyFragment.slice(
        j * HASH_LENGTH_BYTES,
        (j + 1) * HASH_LENGTH_BYTES
      );

      for (let k = 0; k < NUMBER_OF_ROUNDS; k++) {
        const keyFragmentSha3 = new Sha3();
        keyFragmentSha3.absorb(buffer, 0, buffer.length);
        keyFragmentSha3.squeeze(buffer, 0, Sha3.HASH_LENGTH);
        keyFragmentSha3.reset();
      }
      for (let k = 0; k < HASH_LENGTH_BYTES; k++) {
        keyFragment[j * HASH_LENGTH_BYTES + k] = buffer[k];
      }
    }
    const digestsSha3 = new Sha3();
    digestsSha3.absorb(keyFragment, 0, keyFragment.length);
    digestsSha3.squeeze(buffer, 0, Sha3.HASH_LENGTH);

    for (let j = 0; j < HASH_LENGTH_BYTES; j++) {
      result[i * HASH_LENGTH_BYTES + j] = buffer[j];
    }
  }
  return result;
}

/**
 * @method address
 *
 * @param {Uint8Array} digests - Public key
 *
 * @return {Uint8Array} Address
 */
// tslint:disable-next-line no-shadowed-variable
export function address(digests: Uint8Array): Uint8Array {
  const result = new Uint8Array(Sha3.HASH_LENGTH);

  const sha3 = new Sha3();
  sha3.absorb(digests.slice(), 0, digests.length);
  sha3.squeeze(result, 0, Sha3.HASH_LENGTH);

  return result;
}

/**
 * @method digest
 *
 * @param {array} normalizedBundleFragment - Normalized bundle fragment
 * @param {Uint8Array} signatureFragment - Signature fragment
 *
 * @return {Uint8Array} Public key fragment
 */
export function digest(
  normalizedBundleFragment: Uint8Array,
  signatureFragment: Uint8Array
): Uint8Array {
  const digestSha3 = new Sha3();

  let buffer = new Uint8Array(Sha3.HASH_LENGTH);

  for (let i = 0; i < NUMBER_OF_FRAGMENTS_CHUNKS; i++) {
    buffer = signatureFragment.slice(
      i * FRAGMENT_LENGTH_BYTES,
      (i + 1) * FRAGMENT_LENGTH_BYTES
    );

    for (let j = normalizedBundleFragment[i]; j-- > 0; ) {
      const signatureFragmentSha3 = new Sha3();
      signatureFragmentSha3.absorb(buffer, 0, Sha3.HASH_LENGTH);
      signatureFragmentSha3.squeeze(buffer, 0, Sha3.HASH_LENGTH);
      signatureFragmentSha3.reset();
    }
    digestSha3.absorb(buffer, 0, Sha3.HASH_LENGTH);
  }

  digestSha3.squeeze(buffer, 0, Sha3.HASH_LENGTH);
  return buffer;
}

/**
 * @method signatureFragment
 *
 * @param normalizedBundleFragment
 * @param {keyFragment} keyFragment - key fragment
 *
 * @return {Uint8Array} Signature Fragment
 */
export function signatureFragment(
  normalizedBundleFragment: Uint8Array,
  keyFragment: Uint8Array
): Uint8Array {
  const sigFragment = keyFragment.slice();

  const sha3 = new Sha3();

  for (let i = 0; i < NUMBER_OF_FRAGMENTS_CHUNKS; i++) {
    const hash = sigFragment.slice(
      i * HASH_LENGTH_BYTES,
      (i + 1) * HASH_LENGTH_BYTES
    );

    for (let j = 0; j < NUMBER_OF_ROUNDS - normalizedBundleFragment[i]; j++) {
      sha3.absorb(hash, 0, Sha3.HASH_LENGTH);
      sha3.squeeze(hash, 0, Sha3.HASH_LENGTH);
      sha3.reset();
    }

    for (let j = 0; j < HASH_LENGTH_BYTES; j++) {
      sigFragment[i * HASH_LENGTH_BYTES + j] = hash[j];
    }
  }
  //  console.log("signatureFragment: normalizedBundleFragment: " + hex(normalizedBundleFragment));
  //  console.log("keyFragment: " + hex(keyFragment));
  //  console.log("sigFragment " + hex(sigFragment));

  return sigFragment;
}

/**
 * @method validateSignatures
 *
 * @param {string} expectedAddress - Expected address in hexadecimal encoding
 * @param {array} signatureFragments - Array of signatureFragments in hexadecimal encoding
 * @param {string} bundleHash - Bundle hash in hexadecimal encoding
 *
 * @return {boolean}
 */
export function validateSignatures(
  expectedAddress: string,
  signatureFragments: ReadonlyArray<string>,
  bundleHash: string
): boolean {
  // console.log("signing.ts: expectedAddress: " + expectedAddress);
  // console.log("signatureFragments: " + signatureFragments);
  // console.log("hash " + bundleHash);

  if (!bundleHash) {
    throw new Error(errors.INVALID_BUNDLE_HASH);
  }

  const normalizedBundleFragments = Array<Uint8Array>(
    NUMBER_OF_SECURITY_LEVELS
  );
  const normalizedBundle = normalizedBundleHash(toHBytes(bundleHash));
  // Split hash into 2 fragments
  for (let i = 0; i < NUMBER_OF_SECURITY_LEVELS; i++) {
    normalizedBundleFragments[i] = normalizedBundle.slice(
      i * NUMBER_OF_FRAGMENTS_CHUNKS,
      (i + 1) * NUMBER_OF_FRAGMENTS_CHUNKS
    );
  }
  // Get digests
  const digests = new Uint8Array(signatureFragments.length * HASH_LENGTH_BYTES);

  for (let i = 0; i < signatureFragments.length; i++) {
    const digestBuffer = digest(
      normalizedBundleFragments[i],
      toHBytes(signatureFragments[i])
    );

    for (let j = 0; j < HASH_LENGTH_BYTES; j++) {
      digests[i * HASH_LENGTH_BYTES + j] = digestBuffer[j];
    }
  }
  return expectedAddress === hex(address(digests));
}

/**
 * Normalizes the bundle hash, with resulting digits summing to zero.
 *
 * @method normalizedBundleHash
 *
 * @return {Uint8Array} Normalized bundle hash
 * @param bundleHash
 */
export const normalizedBundleHash = (bundleHash: Uint8Array): Uint8Array => {
  const normalizedBundle = Int8Array.from(bundleHash); // toHBytes(bundleHash);

  for (let i = 0; i < NUMBER_OF_SECURITY_LEVELS; i++) {
    let sum = 0;
    for (let j = 0; j < NUMBER_OF_FRAGMENTS_CHUNKS; j++) {
      sum += normalizedBundle[i * NUMBER_OF_FRAGMENTS_CHUNKS + j];
    }

    if (sum >= 0) {
      while (sum-- > 0) {
        for (let j = 0; j < NUMBER_OF_FRAGMENTS_CHUNKS; j++) {
          if (
            normalizedBundle[i * NUMBER_OF_FRAGMENTS_CHUNKS + j] > -MIDDLE_VALUE
          ) {
            normalizedBundle[i * NUMBER_OF_FRAGMENTS_CHUNKS + j]--;
            break;
          }
        }
      }
    } else {
      while (sum++ < 0) {
        for (let j = 0; j < NUMBER_OF_FRAGMENTS_CHUNKS; j++) {
          if (
            normalizedBundle[i * NUMBER_OF_FRAGMENTS_CHUNKS + j] <
            MIDDLE_VALUE - 1
          ) {
            normalizedBundle[i * NUMBER_OF_FRAGMENTS_CHUNKS + j]++;
            break;
          }
        }
      }
    }
  }
  return Uint8Array.from(normalizedBundle);
};

export * from "./winternitz";
