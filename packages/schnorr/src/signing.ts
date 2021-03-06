/** @module schnorr */

import { hex, toTxBytes, txBits, value } from "@helixnetwork/converter";
import HHash from "@helixnetwork/hash-module";
import {
  HASH_BITS_SIZE,
  HASH_BYTE_SIZE,
  SIGNATURE_FRAGMENT_NO,
  SIGNATURE_SECRETE_KEY_BYTE_SIZE,
  SIGNATURE_TOTAL_BYTE_SIZE
} from "../../constants";
import { Hash } from "../../types";
import * as errors from "./errors";
import HSign from "./hsign";
import Schnorr from "./schnorr";

const BN = require("bcrypto/lib/bn.js");
/**
 * @method subseed
 * Compute subseed based on the seed with an additional index
 *
 * @param {Int8Array} seed - Seed txBits
 * @param {number} index - Private key index
 *
 * @return {Int8Array} subseed txBits
 */
export function subseed(seed: Uint8Array, index: number): Uint8Array {
  if (index < 0) {
    throw new Error(errors.ILLEGAL_KEY_INDEX);
  }
  if (seed.length % 2 !== 0) {
    throw new Error(errors.ILLEGAL_SEED_LENGTH + seed.length);
  }

  const indexBN = new BN(index.toString(2), 2);
  const seedBN = new BN(seed, 16);
  const subSeed: Uint8Array = new Uint8Array(seedBN.add(indexBN).toBuffer());

  const hHash = new HHash(HHash.HASH_ALGORITHM_1);

  hHash.initialize();
  hHash.absorb(subSeed, 0, subSeed.length);
  hHash.squeeze(subSeed, 0, subSeed.length);

  return subSeed;
}

/**
 * @method key
 * Split seed in fragments and hashed them then generate from each fragment a schnore private key;
 *
 * @param {Int8Array} subSeed - Subseed txBits
 * @param {number} securityLevel - Private key length
 *
 * @return {Int8Array} Private key bytes
 */
export function key(subSeed: Uint8Array, securityLevel: number): Uint8Array {
  if (subSeed.length % 2 !== 0) {
    throw new Error(errors.ILLEGAL_SUBSEED_LENGTH);
  }

  const hHash = new HHash(HHash.HASH_ALGORITHM_1);
  hHash.initialize();
  hHash.absorb(subSeed, 0, subSeed.length);

  const buffer = new Uint8Array(hHash.getHashLength());
  const result = new Uint8Array(
    securityLevel * SIGNATURE_FRAGMENT_NO * SIGNATURE_SECRETE_KEY_BYTE_SIZE
  );
  let offset = 0;

  while (securityLevel-- > 0) {
    for (let i = 0; i < SIGNATURE_FRAGMENT_NO; i++) {
      hHash.squeeze(buffer, 0, subSeed.length);
      const secreteKeySchnorr: Uint8Array = Schnorr.computeSecreteKey(buffer);
      for (let j = 0; j < secreteKeySchnorr.length; j++) {
        result[offset++] = secreteKeySchnorr[j];
      }
    }
  }

  // returns security * 32 * 64 bytes => 2048 bytes private key - private key for schnorr, as a byte array
  return result;
}

/**
 * @method digests
 *
 * @param {Uint8Array} key - Private key txBits
 *
 * @return {Uint8Array}
 *
 */
// tslint:disable-next-line no-shadowed-variable
export function digests(key: Uint8Array): Uint8Array {
  const securityLevel = Math.floor(
    key.length / (SIGNATURE_SECRETE_KEY_BYTE_SIZE * SIGNATURE_FRAGMENT_NO)
  );

  const result = new Uint8Array(securityLevel * HASH_BITS_SIZE);
  let secreteKey = new Uint8Array(HASH_BITS_SIZE);

  const publicKeys = new Array<Uint8Array>(
    securityLevel * SIGNATURE_FRAGMENT_NO
  );

  for (let i = 0; i < securityLevel; i++) {
    const keyFragment = key.slice(
      i * SIGNATURE_SECRETE_KEY_BYTE_SIZE * SIGNATURE_FRAGMENT_NO,
      (i + 1) * SIGNATURE_SECRETE_KEY_BYTE_SIZE * SIGNATURE_FRAGMENT_NO
    );

    for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
      secreteKey = keyFragment.slice(
        j * SIGNATURE_SECRETE_KEY_BYTE_SIZE,
        (j + 1) * SIGNATURE_SECRETE_KEY_BYTE_SIZE
      );
      publicKeys[i * SIGNATURE_FRAGMENT_NO + j] = Schnorr.computePublicKey(
        secreteKey
      );
    }
  }

  const aggregatedPublicKey = Schnorr.aggregatePublicKey(publicKeys);
  return aggregatedPublicKey;
}

export function computePublicNonces(
  keysBytes: Uint8Array,
  normalizedBundle: Int8Array | Uint8Array
): Uint8Array[] {
  const securityLevel = Math.floor(
    keysBytes.length / (SIGNATURE_SECRETE_KEY_BYTE_SIZE * SIGNATURE_FRAGMENT_NO)
  );
  const publicNonces: Uint8Array[] = new Array<Uint8Array>(
    SIGNATURE_FRAGMENT_NO * securityLevel
  );
  const msg = hex(normalizedBundle);

  const nonces = Array<Uint8Array>(SIGNATURE_FRAGMENT_NO - 1);
  for (let k = 0, i = 0; i < securityLevel; i++) {
    for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
      const secreteKey = keysBytes.slice(
        (i * SIGNATURE_FRAGMENT_NO + j) * SIGNATURE_SECRETE_KEY_BYTE_SIZE,
        (i * SIGNATURE_FRAGMENT_NO + j + 1) * SIGNATURE_SECRETE_KEY_BYTE_SIZE
      );
      const noncePair = Schnorr.generateNoncePair(
        msg,
        secreteKey,
        hex(secreteKey.slice(0, 16))
      );
      publicNonces[i * SIGNATURE_FRAGMENT_NO + j] = noncePair.buff;
      nonces[k++] = noncePair.buff;
    }
  }
  return publicNonces;
}

/**
 * @method address
 *
 * @param {Int8Array} digests - Digests txBits
 *
 * @return {Int8Array} Address txBits
 */
// tslint:disable-next-line no-shadowed-variable
export function address(digests: Uint8Array): Uint8Array {
  // is this usefull? schnorr aggregation?

  return digests;
}

/**
 * @method digest
 *
 * @param {array} normalizedBundleFragment - Normalized bundle fragment
 * @param {Int8Array} signatureFragment - Signature fragment txBits
 *
 * @return {Int8Array} Digest txBits
 */
function digest(
  normalizedBundleFragment: Int8Array,
  // tslint:disable-next-line no-shadowed-variable
  signatureFragment: Uint8Array
): Uint8Array {
  const digestHash = new HHash(HHash.HASH_ALGORITHM_1);
  digestHash.initialize();
  digestHash.absorb(
    normalizedBundleFragment,
    0,
    normalizedBundleFragment.length
  );
  const result: Uint8Array = new Uint8Array(digestHash.getHashLength());
  digestHash.squeeze(result, 0, digestHash.getHashLength());

  return result;
}

/**
 * @method signatureFragment
 *
 * @param {array} normalizeBundleFragment - normalized bundle fragment
 * @param {keyFragment} keyFragment - key fragment txBits
 *
 * @return {Uint8Array} Signature Fragment txBits
 */
export function signatureFragment(
  normalizedBundleFragment: Int8Array | Uint8Array,
  keyFragment: Uint8Array,
  publicNonces: Uint8Array[]
): Uint8Array {
  const sigFragment = keyFragment.slice();

  const hHash = new HHash(HHash.HASH_ALGORITHM_1);

  const securityLevel = Math.floor(
    keyFragment.length /
      (SIGNATURE_SECRETE_KEY_BYTE_SIZE * SIGNATURE_FRAGMENT_NO)
  );
  const signatures: HSign[] = new Array<HSign>(
    securityLevel * SIGNATURE_FRAGMENT_NO
  );

  // calculate partial signature for each fragment
  for (let secLev = 0; secLev < securityLevel; secLev++) {
    for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
      const secreteKey = keyFragment.slice(
        (secLev * SIGNATURE_FRAGMENT_NO + j) * SIGNATURE_SECRETE_KEY_BYTE_SIZE,
        (secLev * SIGNATURE_FRAGMENT_NO + j + 1) *
          SIGNATURE_SECRETE_KEY_BYTE_SIZE
      );
      const nonces = Array<Uint8Array>(
        SIGNATURE_FRAGMENT_NO * securityLevel - 1
      );
      // compute nonces for the other fragments
      for (let i = 0, k = 0; i < SIGNATURE_FRAGMENT_NO * securityLevel; i++) {
        if (secLev * SIGNATURE_FRAGMENT_NO + j === i) {
          continue; // it mean that is exactly the same signature fragment so we don't need it's nonce;
        }
        nonces[k++] = publicNonces[i];
      }
      const noncePair = Schnorr.generateNoncePair(
        hex(normalizedBundleFragment),
        secreteKey,
        hex(secreteKey.slice(0, 16))
      );

      signatures[secLev * SIGNATURE_FRAGMENT_NO + j] = Schnorr.partialSign(
        hex(normalizedBundleFragment),
        secreteKey,
        noncePair.k,
        Schnorr.aggregatePublicNonces(nonces)
      );
    }
  }

  const aggregatedSignature: HSign = Schnorr.aggregateSignature(signatures);
  return aggregatedSignature.getSignatureArray();
}

/**
 * @method validateSignatures
 *
 * @param {string} expectedAddress - Expected address txs
 * @param {array} signatureFragments - Array of signatureFragments txs
 * @param {string} bundleHash - Bundle hash txs
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
  const normalizedBundle: string = hex(normalizedBundleHash(bundleHash));

  const publicKey = toTxBytes(expectedAddress);

  // validate schnorr signature:
  if (signatureFragments.length === 0) {
    return false;
  }

  let isValid: boolean = true;
  signatureFragments.forEach(fragment => {
    const signature: HSign = HSign.generateSignatureFromArray(
      toTxBytes(fragment.slice(0, SIGNATURE_TOTAL_BYTE_SIZE * 2))
    );
    isValid = isValid && Schnorr.verify(normalizedBundle, signature, publicKey);
  });
  return isValid; // expectedAddress === txs(address(digests));
}

/**
 * Normalizes the bundle hash, with resulting digits summing to zero.
 *
 * @method normalizedBundleHash
 *
 * @param {Hash} bundlehash - Bundle hash txs
 *
 * @return {Int8Array} Normalized bundle hash
 */
export const normalizedBundleHash = (bundleHash: Hash): Int8Array => {
  const normalizedBundle = new Int8Array(HASH_BYTE_SIZE);

  for (let i = 0; i < 4; i++) {
    let sum = 0;
    for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
      sum += normalizedBundle[i * SIGNATURE_FRAGMENT_NO + j] = value(
        txBits(bundleHash.charAt(i * SIGNATURE_FRAGMENT_NO + j))
      );
    }

    if (sum >= 0) {
      while (sum-- > 0) {
        for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
          if (normalizedBundle[i * SIGNATURE_FRAGMENT_NO + j] > -8) {
            normalizedBundle[i * SIGNATURE_FRAGMENT_NO + j]--;
            break;
          }
        }
      }
    } else {
      while (sum++ < 0) {
        for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
          if (normalizedBundle[i * SIGNATURE_FRAGMENT_NO + j] < 8) {
            normalizedBundle[i * SIGNATURE_FRAGMENT_NO + j]++;
            break;
          }
        }
      }
    }
  }
  return normalizedBundle;
};
