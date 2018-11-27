/** @module signing */

import {
  fromValue,
  hbits,
  hbytes,
  hbytesToHBits,
  hex,
  value,
  toHBytes
} from "@helix/converter";
import HHash from "@helix/hash-module";
import { padHBits } from "@helix/pad";
import add from "./add";
import * as errors from "./errors";
import { Hash } from "../../types";
import {
  //ADDRESS_SIZE_BITS,
  HASH_BITS_SIZE,
  HASH_BYTE_SIZE,
  SIGNATURE_FRAGMENT_NO,
  //SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE_BITS,
  SIGNATURE_R_BYTE_SIZE,
  SIGNATURE_PUBLIC_KEY_BYTE_SIZE,
  SIGNATURE_SECRETE_KEY_BYTE_SIZE,
  SIGNATURE_TOTAL_BYTE_SIZE
} from "../../constants";
import Schnorr from "./schnorr";
import HSign from "./hsign";
import { IncomingMessage } from "http";
import { arrayValidator } from "../../guards";
import { AssertionError } from "assert";

/**
 * @method subseed
 * Compute subseed based on the seed with an additional index
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

  if (seed.length % 4 !== 0) {
    throw new Error(errors.ILLEGAL_SEED_LENGTH);
  }

  const indexHBits = fromValue(index);
  let subseed: Int8Array = add(seed, indexHBits);

  const hHash = new HHash(HHash.HASH_ALGORITHM_1);

  while (subseed.length % hHash.getHashLength() !== 0) {
    subseed = padHBits(subseed.length + subseed.length % hHash.getHashLength())(
      subseed
    ); //don't really know if it's necessary
  }

  hHash.initialize();
  hHash.absorbBits(subseed, 0, subseed.length);
  hHash.squeeze(subseed, 0, subseed.length);

  return subseed;
}

/**
 * @method key
 * Split seed in fragments and hashed them then generate from each fragment a schnore private key;
 *
 * @param {Int8Array} subseed - Subseed hbits
 * @param {number} securityLevel - Private key length
 *
 * @return {Int8Array} Private key bytes
 */
export function key(subseed: Int8Array, securityLevel: number): Uint8Array {
  if (subseed.length % 4 !== 0) {
    throw new Error(errors.ILLEGAL_SUBSEED_LENGTH);
  }

  const hHash = new HHash(HHash.HASH_ALGORITHM_1);
  hHash.initialize();
  hHash.absorbBits(subseed, 0, subseed.length);

  const buffer = new Int8Array(hHash.getHashLength());
  const result = new Uint8Array(
    securityLevel * SIGNATURE_FRAGMENT_NO * SIGNATURE_SECRETE_KEY_BYTE_SIZE
  );
  let offset = 0;

  while (securityLevel-- > 0) {
    for (let i = 0; i < SIGNATURE_FRAGMENT_NO; i++) {
      hHash.squeeze(buffer, 0, subseed.length);
      let secreteKeySchnorr: Uint8Array = Schnorr.computeSecreteKey(buffer);
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
 * @param {Uint8Array} key - Private key hbits
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
      //  console.log('secreteKey' + secreteKey);
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
): Array<Uint8Array> {
  const securityLevel = Math.floor(
    keysBytes.length / (SIGNATURE_SECRETE_KEY_BYTE_SIZE * SIGNATURE_FRAGMENT_NO)
  );
  const publicNonces: Array<Uint8Array> = new Array<Uint8Array>(
    SIGNATURE_FRAGMENT_NO * securityLevel
  );
  const nonces = Array<Uint8Array>(SIGNATURE_FRAGMENT_NO - 1);
  for (let k = 0, i = 0; i < securityLevel; i++) {
    for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
      const secreteKey = keysBytes.slice(
        (i * SIGNATURE_FRAGMENT_NO + j) * SIGNATURE_SECRETE_KEY_BYTE_SIZE,
        (i * SIGNATURE_FRAGMENT_NO + j + 1) * SIGNATURE_SECRETE_KEY_BYTE_SIZE
      );
      let noncePair = Schnorr.generateNoncePair(
        normalizedBundle,
        secreteKey,
        hex(secreteKey.slice(0, 16))
      );
      publicNonces[i * SIGNATURE_FRAGMENT_NO + j] = noncePair.buff;
      nonces[k++] = noncePair.buff;
    }
  }
  console.log(
    "*****************aggregated nonces:" +
      hex(Schnorr.aggregatePubicNonces(nonces))
  );

  return publicNonces;
}

/**
 * @method address
 *
 * @param {Int8Array} digests - Digests hbits
 *
 * @return {Int8Array} Address hbits
 */
// tslint:disable-next-line no-shadowed-variable
function address(digests: Uint8Array): Uint8Array {
  // is this usefull? schnorr aggregation?
  // TODO: do we really need a list of bits here?

  return digests;
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
function digest(
  normalizedBundleFragment: Int8Array,
  signatureFragment: Uint8Array
): Int8Array {
  const digestHash = new HHash(HHash.HASH_ALGORITHM_1);
  digestHash.initialize();
  digestHash.absorb(
    normalizedBundleFragment,
    0,
    normalizedBundleFragment.length
  );
  const result: Int8Array = new Int8Array(digestHash.getHashLength());
  digestHash.squeeze(result, 0, digestHash.getHashLength());

  return result;
}

/**
 * @method signatureFragment
 *
 * @param {array} normalizeBundleFragment - normalized bundle fragment
 * @param {keyFragment} keyFragment - key fragment hbits
 *
 * @return {Uint8Array} Signature Fragment hbits
 */
export function signatureFragment(
  normalizedBundleFragment: Int8Array | Uint8Array,
  keyFragment: Uint8Array,
  publicNonces: Array<Uint8Array>
): Uint8Array {
  const sigFragment = keyFragment.slice();

  const hHash = new HHash(HHash.HASH_ALGORITHM_1);

  const signatures: Array<HSign> = new Array<HSign>(SIGNATURE_FRAGMENT_NO);
  const privateNonces: Array<Uint8Array> = new Array<Uint8Array>(
    SIGNATURE_FRAGMENT_NO
  );

  const securityLevel = Math.floor(
    keyFragment.length /
      (SIGNATURE_SECRETE_KEY_BYTE_SIZE * SIGNATURE_FRAGMENT_NO)
  );

  // calculate partial signature for each fragment
  for (let secLev = 0; secLev < securityLevel; secLev++) {
    for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
      const secreteKey = keyFragment.slice(
        (secLev * SIGNATURE_FRAGMENT_NO + j) * SIGNATURE_SECRETE_KEY_BYTE_SIZE,
        (secLev * SIGNATURE_FRAGMENT_NO + j + 1) *
          SIGNATURE_SECRETE_KEY_BYTE_SIZE
      );
      const nonces = Array<Uint8Array>(SIGNATURE_FRAGMENT_NO - 1);
      // compute nonces for the other fragments
      for (let i = 0, k = 0; i < SIGNATURE_FRAGMENT_NO * securityLevel; i++) {
        if (secLev * SIGNATURE_FRAGMENT_NO + j == i) {
          continue; // it mean that is exactly the same signature fragment so we don't need it's nonce;
        }
        nonces[k++] = publicNonces[i];
      }
      let noncePair = Schnorr.generateNoncePair(
        hex(normalizedBundleFragment),
        secreteKey,
        hex(secreteKey.slice(0, 16))
      );

      signatures[j] = Schnorr.partialSign(
        hex(normalizedBundleFragment),
        secreteKey,
        noncePair.k,
        Schnorr.aggregatePublicKey(nonces)
      );
    }
  }

  const aggregatedSignature: HSign = Schnorr.aggregateSignature(signatures);
  //console.log('aggregatedSignature.getSignatureArray(): ' + hex(aggregatedSignature.getSignatureArray()));
  const digestKey = digests(keyFragment);
  const pubKey: Uint8Array = new Uint8Array(35).map(
    (val, i, arr) => (arr[i] = digestKey[i])
  );
  // console.log('publicKey: ');
  // console.log(hex(pubKey));

  return aggregatedSignature.getSignatureArray();
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
  const normalizedBundle = toHBytes(bundleHash); //normalizedBundleHash(bundleHash);

  const publicKey = toHBytes(expectedAddress);

  // validate schnorr signature:
  let isValid: boolean = true;
  signatureFragments.forEach(value => {
    console.log("signatureFragments: " + value);
    const signature: HSign = HSign.generateSignatureFromArray(
      toHBytes(value.slice(0, SIGNATURE_TOTAL_BYTE_SIZE * 2))
    );
    isValid =
      isValid && Schnorr.verify(hex(normalizedBundle), signature, publicKey);
  });

  return isValid; //expectedAddress === hbytes(address(digests));
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

  for (let i = 0; i < 4; i++) {
    let sum = 0;
    for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
      sum += normalizedBundle[i * SIGNATURE_FRAGMENT_NO + j] = value(
        hbits(bundleHash.charAt(i * SIGNATURE_FRAGMENT_NO + j))
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
