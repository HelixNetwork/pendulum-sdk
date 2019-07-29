// by: Frauke Sophie Abben <fsa@hlx.ai> (https://hlx.ai)
import { hex, toTxBytes } from "@helixnetwork/converter";
import { padByteArray } from "@helixnetwork/pad";
import Sha3 from "@helixnetwork/sha3";
import { HASH_BITS_SIZE, SECURITY_LEVELS } from "../../constants";
import { TxBytes, TxHex } from "../../types";
import * as errors from "./errors";

// tslint:disable-next-line:no-var-requires
const BN = require("bcrypto/lib/bn.js");

// Winternitz signature parameters:
// Number of message bits signed with one key - compression rate
const w = 4;
// Number of security levels
const NUMBER_OF_SECURITY_LEVELS = SECURITY_LEVELS;
// Number of hash in bits
const HASH_LENGTH_BITS = HASH_BITS_SIZE; // 256
const HASH_LENGTH_BYTES = HASH_LENGTH_BITS / 8;
// Number of message in bits
const m = HASH_BITS_SIZE;
// Number of rounds to hash
const NUMBER_OF_ROUNDS = Math.pow(2, w) - 1;
// Number of signature fragment bits
const NUMBER_OF_FRAGMENTS_CHUNKS =
  HASH_LENGTH_BITS / (NUMBER_OF_SECURITY_LEVELS * w); // 16
// Specific security level sl can be between 1 and NUMBER_OF_SECURITY_LEVELS
// Signature key length = HASH_LENGTH_BITS * NUMBER_OF_FRAGMENTS_CHUNKS *sl
// Signature length security level 1
const FRAGMENT_LENGTH_BYTES = NUMBER_OF_FRAGMENTS_CHUNKS * HASH_LENGTH_BYTES;
const NORMALIZED_FRAGMENT_LENGTH = NUMBER_OF_FRAGMENTS_CHUNKS;
export const MIN_VALUE = -1 * Math.pow(2, w - 1);
export const MAX_VALUE = Math.pow(2, w - 1) - 1;

export function add(seed: TxBytes, index: number): TxBytes {
  const subseedBN: any = new BN(seed);
  const indexBN: any = new BN(index);
  return Uint8Array.from(subseedBN.add(indexBN).toArrayLike(Buffer, "be"));
}

/**
 * @method subseed
 *
 * @param {Uint8Array} seed - Seed toTxBytes
 * @param {number} index - Private key index
 *
 * @return {Uint8Array} subseed
 */

export function subseed(seed: TxBytes, index: number): TxBytes {
  if (index < 0) {
    throw new Error(errors.ILLEGAL_KEY_INDEX);
  }
  let result: Uint8Array = add(seed, index);
  while (result.length % HASH_LENGTH_BYTES !== 0) {
    result = padByteArray(HASH_LENGTH_BYTES)(result);
  }
  const sha3 = new Sha3();
  sha3.absorb(result, 0, result.length);
  sha3.squeeze(result, 0, result.length);

  // console.log('NORMALIZED_FRAGMENT_LENGTH ' + NORMALIZED_FRAGMENT_LENGTH);
  // console.log('HASH_LENGTH_BYTES ' + HASH_LENGTH_BYTES);
  // console.log('NUMBER_OF_SECURITY_LEVELS ' + NUMBER_OF_SECURITY_LEVELS);
  // console.log('NUMBER_OF_FRAGMENTS_CHUNKS ' + NUMBER_OF_FRAGMENTS_CHUNKS);
  // console.log('FRAGMENT_LENGTH_BYTES ' + FRAGMENT_LENGTH_BYTES);
  // console.log('HASH_LENGTH_BITS ' + HASH_LENGTH_BITS);
  // console.log('MIN_VALUE ' + MIN_VALUE);
  // console.log('MAX_VALUE ' + MAX_VALUE);
  // console.log('NUMBER_OF_ROUNDS ' + NUMBER_OF_ROUNDS);
  // console.log('w ' + w);
  //
  // console.log('subseed - SEED: ' + hex(seed));
  // console.log('subseed - SUBSEED: ' + hex(result));
  //
  // console.log('---------------------------------');

  return result;
}

/**
 * @method key
 *
 * @param {Uint8Array} subseed - Subseed
 * @param {number} securityLevel - security level (1 - 4)
 *
 * @return {Uint8Array} Private key
 */
export function key(subseed: TxBytes, securityLevel: number): TxBytes {
  if (subseed.length % HASH_LENGTH_BYTES !== 0) {
    throw new Error(errors.ILLEGAL_SUBSEED_LENGTH);
  }
  const sha3 = new Sha3();
  sha3.absorb(subseed, 0, subseed.length);

  if ([1, 2, 3, 4].indexOf(securityLevel) === -1) {
    throw new Error(errors.ILLEGAL_NUMBER_OF_FRAGMENTS);
  }

  const buffer = new Uint8Array(Sha3.HASH_LENGTH);
  const result = new Uint8Array(
    securityLevel * NUMBER_OF_FRAGMENTS_CHUNKS * HASH_LENGTH_BYTES
  );
  let offset = 0;

  while (securityLevel-- > 0) {
    for (let i = 0; i < NUMBER_OF_FRAGMENTS_CHUNKS; i++) {
      sha3.squeeze(buffer, 0, Sha3.HASH_LENGTH);
      for (let j = 0; j < HASH_LENGTH_BYTES; j++) {
        result[offset++] = buffer[j];
      }
    }
  }
  // console.log('key - PRIVATE KEY ' + hex(result) + ' size = ' + HASH_LENGTH_BYTES * NUMBER_OF_FRAGMENTS_CHUNKS);
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
export function digests(key: TxBytes): TxBytes {
  const l = Math.floor(key.length / FRAGMENT_LENGTH_BYTES); // security level (1 or 2)
  const result = new Uint8Array(l * HASH_LENGTH_BYTES);
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
export function address(digests: TxBytes): TxBytes {
  const result = new Uint8Array(Sha3.HASH_LENGTH);

  const sha3 = new Sha3();
  sha3.absorb(digests.slice(), 0, digests.length);
  sha3.squeeze(result, 0, Sha3.HASH_LENGTH);
  // console.log('winternitz = address ' + hex(result));
  return result;
}

/**
 * @method digest
 *
 * @param {array} normalizedBundleFragment - Normalized bundle fragment
 * @param {Uint8Array} signFragments - Signature fragment
 *
 * @return {Uint8Array} Public key fragment
 */
export function digest(
  normalizedBundleFragment: TxBytes,
  signFragments: TxBytes
): TxBytes {
  const digestSha3 = new Sha3();
  let buffer = new Uint8Array(Sha3.HASH_LENGTH);

  for (let i = 0; i < NUMBER_OF_FRAGMENTS_CHUNKS; i++) {
    buffer = signFragments.slice(
      i * HASH_LENGTH_BYTES,
      (i + 1) * HASH_LENGTH_BYTES
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
 * @return {TxBytes} Signature Fragment
 */
export function signatureFragment(
  normalizedBundleFragment: TxBytes,
  keyFragment: TxBytes,
  normalizedBundleFragmentOffset = 0,
  keyFragmentOffset = 0
): TxBytes {
  if (
    normalizedBundleFragment.length - normalizedBundleFragmentOffset <
    NORMALIZED_FRAGMENT_LENGTH
  ) {
    throw new Error(errors.ILLEGAL_NORMALIZED_FRAGMENT_LENGTH);
  }

  if (keyFragment.length - keyFragmentOffset < FRAGMENT_LENGTH_BYTES) {
    throw new Error(errors.ILLEGAL_KEY_FRAGMENT_LENGTH);
  }

  const sigFragment = keyFragment.slice(
    keyFragmentOffset,
    keyFragmentOffset + FRAGMENT_LENGTH_BYTES
  );

  const sha3 = new Sha3();

  for (let i = 0; i < NUMBER_OF_FRAGMENTS_CHUNKS; i++) {
    const hash = sigFragment.slice(
      i * HASH_LENGTH_BYTES,
      (i + 1) * HASH_LENGTH_BYTES
    );
    for (
      let j = 0;
      j <
      NUMBER_OF_ROUNDS -
        normalizedBundleFragment[normalizedBundleFragmentOffset + i];
      j++
    ) {
      sha3.absorb(hash, 0, Sha3.HASH_LENGTH);
      sha3.squeeze(hash, 0, Sha3.HASH_LENGTH);
      sha3.reset();
    }
    // console.log("signatureFragment - hash[i]: " + " " + i + " " + hex(hash));
    for (let j = 0; j < HASH_LENGTH_BYTES; j++) {
      sigFragment[i * HASH_LENGTH_BYTES + j] = hash[j];
    }
  }
  // console.log("signatureFragment - normalizedBundleFragment: " + hex(normalizedBundleFragment));
  // console.log("signatureFragment - keyFragment: " + hex(keyFragment));
  // console.log("signatureFragment - sigFragment " + hex(sigFragment));
  return sigFragment;
}

export function signatureFragments(
  seed: TxBytes,
  index: number,
  numberOfFragments: number, // equals to level numbers
  bundle: TxBytes
): TxBytes {
  const normalizedBundle = normalizedBundleHash(bundle);
  const keyFragments = key(subseed(seed, index), numberOfFragments);
  const signature = new Uint8Array(numberOfFragments * FRAGMENT_LENGTH_BYTES);

  const digestsTxHex = digests(keyFragments);
  const addressTxHex = hex(address(digestsTxHex));
  // console.log('signatureFragment addressTxHex' + addressTxHex);
  // console.log('signatureFragments  index ' + index);
  // console.log('signatureFragments  seed ' + hex(seed));
  // console.log('signatureFragments  bundle ' + hex(bundle));
  // console.log('signatureFragments  numberOfFragments ' + numberOfFragments);
  // console.log('signatureFragments  normalizedBundle' + hex(normalizedBundle));
  // console.log('signatureFragments  FRAGMENT_LENGTH_BYTES' + FRAGMENT_LENGTH_BYTES);
  // console.log('signatureFragments  NORMALIZED_FRAGMENT_LENGTH' + NORMALIZED_FRAGMENT_LENGTH);
  // console.log('signatureFragments  numberOfFragments' + numberOfFragments);

  for (let i = 0; i < numberOfFragments; i++) {
    signature.set(
      signatureFragment(
        normalizedBundle.slice(
          i * NORMALIZED_FRAGMENT_LENGTH,
          (i + 1) * NORMALIZED_FRAGMENT_LENGTH
        ),
        keyFragments.slice(
          i * FRAGMENT_LENGTH_BYTES,
          (i + 1) * FRAGMENT_LENGTH_BYTES
        )
      ),
      i * FRAGMENT_LENGTH_BYTES
    );
  }

  // console.log('signatureFragment - singature list ')
  // console.log(hex(signature));
  return signature;
}

/**
 * @method validateSignatures
 *
 * @param {string} expectedAddress - Expected address in hexadecimal encoding
 * @param {array} signFragments - Array of signatureFragments in hexadecimal encoding
 * @param {string} bundleHash - Bundle hash in hexadecimal encoding
 *
 * @return {boolean}
 */
export function validateSignatures(
  expectedAddress: TxHex,
  signFragments: ReadonlyArray<TxHex>,
  bundleHash: TxHex
): boolean {
  if (!bundleHash) {
    throw new Error(errors.INVALID_BUNDLE_HASH);
  }

  const normalizedBundleFragments = Array<Uint8Array>(
    NUMBER_OF_SECURITY_LEVELS
  );
  const normalizedBundle = normalizedBundleHash(toTxBytes(bundleHash));
  // Split hash into fragments for each security level
  for (let i = 0; i < NUMBER_OF_SECURITY_LEVELS; i++) {
    normalizedBundleFragments[i] = normalizedBundle.slice(
      i * NORMALIZED_FRAGMENT_LENGTH,
      (i + 1) * NORMALIZED_FRAGMENT_LENGTH
    );
  }
  const digestsResults = new Uint8Array(
    signFragments.length * HASH_LENGTH_BYTES
  );

  for (let i = 0; i < signFragments.length; i++) {
    const digestBuffer = digest(
      normalizedBundleFragments[i],
      toTxBytes(signFragments[i])
    );

    for (let j = 0; j < HASH_LENGTH_BYTES; j++) {
      digestsResults[i * HASH_LENGTH_BYTES + j] = digestBuffer[j];
    }
  }
  // console.log("validateSignatures - digests: " + hex(digestsResults));
  //  console.log("validateSignatures - expectedAddress: " + expectedAddress);
  //  console.log("validateSignatures - actualAddress: " + hex(address(digestsResults)));
  //  console.log("validateSignatures - signatureFragments: " + signFragments);
  //  console.log("validateSignatures " + bundleHash);
  return expectedAddress === hex(address(digestsResults));
}

/**
 * Normalizes the bundle hash, with resulting digits summing to zero.
 *
 * @method normalizedBundleHash
 *
 * @return {Uint8Array} Normalized bundle hash
 * @param bundleHash
 */
export const normalizedBundleHash = (bundleHash: TxBytes): TxBytes => {
  const int8Bundle = Int8Array.from(bundleHash);
  let normalizedBundle = int8Bundle;
  const bitsInByte = 8;
  if (w < bitsInByte) {
    const splitFactor = 8 / w;
    normalizedBundle = new Int8Array(splitFactor * HASH_LENGTH_BYTES);
    let k = 0;
    int8Bundle.forEach((value, index) => {
      const highByte4 = (value >> w) & 0x0f;
      const lowByte4 = value & 0x0f;
      normalizedBundle[k++] = highByte4 & 0x08 ? highByte4 | 0xf0 : highByte4;
      normalizedBundle[k++] = lowByte4 & 0x08 ? lowByte4 | 0xf0 : lowByte4;
    });
    k = 0;
  }

  for (let i = 0; i < NUMBER_OF_SECURITY_LEVELS; i++) {
    let sum = 0;
    for (let j = 0; j < NORMALIZED_FRAGMENT_LENGTH; j++) {
      sum += normalizedBundle[i * NORMALIZED_FRAGMENT_LENGTH + j];
    }

    if (sum >= 0) {
      while (sum-- > 0) {
        for (let j = 0; j < NORMALIZED_FRAGMENT_LENGTH; j++) {
          if (
            normalizedBundle[i * NORMALIZED_FRAGMENT_LENGTH + j] > MIN_VALUE
          ) {
            normalizedBundle[i * NORMALIZED_FRAGMENT_LENGTH + j]--;
            break;
          }
        }
      }
    } else {
      while (sum++ < 0) {
        for (let j = 0; j < NORMALIZED_FRAGMENT_LENGTH; j++) {
          if (
            normalizedBundle[i * NORMALIZED_FRAGMENT_LENGTH + j] < MAX_VALUE
          ) {
            normalizedBundle[i * NORMALIZED_FRAGMENT_LENGTH + j]++;
            break;
          }
        }
      }
    }
  }
  // if w is less then one byte
  if (w < bitsInByte) {
    normalizedBundle.forEach((v, index) => {
      if (v < MIN_VALUE || v > MAX_VALUE) {
        throw Error("Bundle normalization error " + v);
      }
      normalizedBundle[index] = normalizedBundle[index] & 0x0f;
    });
  }
  return Uint8Array.from(normalizedBundle);
};

export * from "./winternitz";
