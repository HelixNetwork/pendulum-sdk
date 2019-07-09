// by: Frauke Sophie Abben <fsa@hlx.ai> (https://hlx.ai)
import { hex, toHBytes } from "@helixnetwork/converter";
import { padByteArray } from "@helixnetwork/pad";
import Sha3 from "@helixnetwork/sha3";
import { HASH_BITS_SIZE } from "../../constants";
import * as errors from "./errors";

const BN = require("bcrypto/lib/bn.js");

const SIGNATURE_FRAGMENT = 16;

// Winternitz signature parameters:

// Number of message bits signed with one key - compression rate
const w = 8;
// Number of security levels
const s = 2;
// Number of hash in bits
const n = HASH_BITS_SIZE; // 256
// Number of message in bits
const m = HASH_BITS_SIZE; // 256
// Number of message parts
const messagePartsNo = m / w; // 32
// Number of rounds to hash
const roundsNo = 2 ^ (w - 1); // 255
// Number of signature fragment bits
const f = Math.floor(messagePartsNo / s); // 16
// Specific security level sl can be between 1 and s
// Signature key length = n * f *sl
// Signature length security level 1
const sigLevelOneSizeBytes = f * n / 8; // 512
const middleValue = 2 ^ (w - 1);

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
  if (seed.length % s !== 0) {
    throw new Error(errors.ILLEGAL_SEED_LENGTH);
  }
  let result: Uint8Array = add(seed, index);
  while (result.length % messagePartsNo !== 0) {
    result = padByteArray(messagePartsNo)(result);
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
  if (subseed.length % messagePartsNo !== 0) {
    throw new Error(errors.ILLEGAL_SUBSEED_LENGTH);
  }
  const sha3 = new Sha3();
  sha3.absorb(subseed, 0, subseed.length);

  const buffer = new Uint8Array(Sha3.HASH_LENGTH);
  const result = new Uint8Array(securityLevel * f * messagePartsNo);
  let offset = 0;

  while (securityLevel-- > 0) {
    for (let i = 0; i < f; i++) {
      sha3.squeeze(buffer, 0, Sha3.HASH_LENGTH);
      for (let j = 0; j < messagePartsNo; j++) {
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
  const l = Math.floor(key.length / sigLevelOneSizeBytes); // security level (1 or 2)
  const result = new Uint8Array(l * messagePartsNo);
  let buffer = new Uint8Array(Sha3.HASH_LENGTH);

  for (let i = 0; i < l; i++) {
    const keyFragment = key.slice(
      i * sigLevelOneSizeBytes,
      (i + 1) * sigLevelOneSizeBytes
    );

    for (let j = 0; j < f; j++) {
      buffer = keyFragment.slice(j * messagePartsNo, (j + 1) * messagePartsNo);

      for (let k = 0; k < roundsNo; k++) {
        const keyFragmentSha3 = new Sha3();
        keyFragmentSha3.absorb(buffer, 0, buffer.length);
        keyFragmentSha3.squeeze(buffer, 0, Sha3.HASH_LENGTH);
        keyFragmentSha3.reset();
      }
      for (let k = 0; k < messagePartsNo; k++) {
        keyFragment[j * messagePartsNo + k] = buffer[k];
      }
    }
    const digestsSha3 = new Sha3();
    digestsSha3.absorb(keyFragment, 0, keyFragment.length);
    digestsSha3.squeeze(buffer, 0, Sha3.HASH_LENGTH);

    for (let j = 0; j < messagePartsNo; j++) {
      result[i * messagePartsNo + j] = buffer[j];
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

  for (let i = 0; i < f; i++) {
    buffer = signatureFragment.slice(
      i * messagePartsNo,
      (i + 1) * messagePartsNo
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

  for (let i = 0; i < f; i++) {
    const hash = sigFragment.slice(
      i * messagePartsNo,
      (i + 1) * messagePartsNo
    );

    for (let j = 0; j < roundsNo - normalizedBundleFragment[i]; j++) {
      sha3.absorb(hash, 0, Sha3.HASH_LENGTH);
      sha3.squeeze(hash, 0, Sha3.HASH_LENGTH);
      sha3.reset();
    }

    for (let j = 0; j < messagePartsNo; j++) {
      sigFragment[i * messagePartsNo + j] = hash[j];
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

  const normalizedBundleFragments = Array<Uint8Array>(s);
  const normalizedBundle = normalizedBundleHash(toHBytes(bundleHash));
  // Split hash into 2 fragments
  for (let i = 0; i < s; i++) {
    normalizedBundleFragments[i] = normalizedBundle.slice(i * f, (i + 1) * f);
  }
  // Get digests
  const digests = new Uint8Array(signatureFragments.length * messagePartsNo);

  for (let i = 0; i < signatureFragments.length; i++) {
    const digestBuffer = digest(
      normalizedBundleFragments[i],
      toHBytes(signatureFragments[i])
    );

    for (let j = 0; j < messagePartsNo; j++) {
      digests[i * messagePartsNo + j] = digestBuffer[j];
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

  for (let i = 0; i < s; i++) {
    let sum = 0;
    for (let j = 0; j < f; j++) {
      sum += normalizedBundle[i * f + j];
    }

    if (sum >= 0) {
      while (sum-- > 0) {
        for (let j = 0; j < f; j++) {
          if (normalizedBundle[i * f + j] > -middleValue) {
            normalizedBundle[i * f + j]--;
            break;
          }
        }
      }
    } else {
      while (sum++ < 0) {
        for (let j = 0; j < f; j++) {
          if (normalizedBundle[i * f + j] < middleValue - 1) {
            normalizedBundle[i * f + j]++;
            break;
          }
        }
      }
    }
  }
  return Uint8Array.from(normalizedBundle);
};

export * from "./winternitz";
