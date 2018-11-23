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
  ADDRESS_SIZE_BITS,
  HASH_BITS_SIZE,
  HASH_BYTE_SIZE,
  SIGNATURE_FRAGMENT_NO,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE_BITS,
  SIGNATURE_R_BYTE_SIZE,
  SIGNATURE_PUBLIC_KEY_BYTE_SIZE,
  SIGNATURE_SECRETE_KEY_BYTE_SIZE,
  SIGNATURE_TOTAL_BYTE_SIZE
} from "../../constants";
import Schnorr from "./schnorr";
import HSign from "./hsign";
import { IncomingMessage } from "http";

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
    // sets of signatures per security level
    const keyFragment = key.slice(
      i * SIGNATURE_TOTAL_BYTE_SIZE,
      (i + 1) * SIGNATURE_TOTAL_BYTE_SIZE
    );

    for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
      secreteKey = keyFragment.slice(
        (i * SIGNATURE_FRAGMENT_NO + j) * SIGNATURE_SECRETE_KEY_BYTE_SIZE,
        (i * SIGNATURE_FRAGMENT_NO + j + 1) * SIGNATURE_SECRETE_KEY_BYTE_SIZE
      );

      publicKeys[i * SIGNATURE_FRAGMENT_NO + j] = Schnorr.computePublicKey(
        secreteKey
      );

      // for (let k = 0; k < SIGNATURE_FRAGMENT_NO - 1; k++) {
      //   const keyFragmentHash = new HHash(HHash.HASH_ALGORITHM_1);

      //   keyFragmentHash.initialize();
      //   keyFragmentHash.absorbBits(secreteKey, 0, secreteKey.length);
      //   keyFragmentHash.squeezeBits(
      //     secreteKey,
      //     0,
      //     keyFragmentHash.getHashLength() * 8
      //   );
      // }

      // for (let k = 0; k < HASH_BITS_SIZE; k++) {
      //   keyFragment[j * HASH_BITS_SIZE + k] = secreteKey[k];
      // }
    }
    // const aggregatedPublicKey = Schnorr.aggregatePublicKey(publicKeys);
    // const digestsHash = new HHash(HHash.HASH_ALGORITHM_1);
    // digestsHash.initialize();
    // digestsHash.absorbBits(keyFragment, 0, keyFragment.length);
    // digestsHash.squeezeBits(secreteKey, 0, HASH_BITS_SIZE);
    // for (let j = 0; j < HASH_BITS_SIZE; j++) {
    //   result[i * HASH_BITS_SIZE + j] = secreteKey[j];
    // }
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

  for (let i = 0; i < securityLevel; i++) {
    for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
      const secreteKey = keysBytes.slice(
        j * SIGNATURE_SECRETE_KEY_BYTE_SIZE,
        (j + 1) * SIGNATURE_SECRETE_KEY_BYTE_SIZE
      );
      let noncePair = Schnorr.generateNoncePair(
        normalizedBundle,
        secreteKey,
        hex(secreteKey.slice(0, 16))
      );
      publicNonces[i * SIGNATURE_FRAGMENT_NO + j] = noncePair.buff;
    }
  }
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

  // const addressHBits = new Int8Array(ADDRESS_SIZE_BITS);
  // const hHash = new HHash(HHash.HASH_ALGORITHM_1);

  // hHash.initialize();
  // hHash.absorbBits(digests.slice(), 0, digests.length);
  // hHash.squeezeBits(addressHBits, 0, hHash.getHashLength() * 8);
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

  // let buffer = new Int8Array(HASH_BITS_SIZE);

  // for (let i = 0; i < SIGNATURE_FRAGMENT_NO; i++) {
  //   buffer = signatureFragment.slice(
  //     i * HASH_BITS_SIZE,
  //     (i + 1) * HASH_BITS_SIZE
  //   );

  //   for (let j = normalizedBundleFragment[i]; j-- > 0;) {
  //     const signatureFragmentHash = new HHash(HHash.HASH_ALGORITHM_1);
  //     signatureFragmentHash.initialize();
  //     signatureFragmentHash.absorbBits(
  //       buffer,
  //       0,
  //       signatureFragmentHash.getHashLength() * 8
  //     );
  //     signatureFragmentHash.squeezeBits(
  //       buffer,
  //       0,
  //       signatureFragmentHash.getHashLength() * 8
  //     );
  //   }

  //   digestHash.absorbBits(buffer, 0, digestHash.getHashLength() * 8);
  // }

  // digestHash.squeezeBits(buffer, 0, digestHash.getHashLength() * 8);
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

  //const sigsenatures : Array<Uint8Array> = new Array<Uint8Array>(SIGNATURE_FRAGMENT_NO);
  // calculate nonce for each signature fragments:

  // for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
  //   const secreteKey = keyFragment.slice(j * SIGNATURE_SECRETE_KEY_BYTE_SIZE, (j + 1) * SIGNATURE_SECRETE_KEY_BYTE_SIZE);
  //   let noncePair = Schnorr.generateNoncePair(normalizedBundleFragment, secreteKey, '');
  //   privateNonces[j] = noncePair.k;
  //   publicNonces[j] = noncePair.buff;

  // }

  // calculate partial signature for each fragment
  for (let j = 0; j < SIGNATURE_FRAGMENT_NO; j++) {
    const secreteKey = keyFragment.slice(
      j * SIGNATURE_SECRETE_KEY_BYTE_SIZE,
      (j + 1) * SIGNATURE_SECRETE_KEY_BYTE_SIZE
    );
    const nonces = Array<Uint8Array>(SIGNATURE_FRAGMENT_NO - 1);
    // compute nonces for the other fragments
    for (let i = 0, k = 0; i < SIGNATURE_FRAGMENT_NO; i++) {
      if (i == j) {
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

  const aggregatedSignature: HSign = Schnorr.aggregateSignature(signatures);

  // const hash = sigFragment.slice(
  //   i * hHash.getHashLength(),
  //   (i + 1) * hHash.getHashLength()
  // );

  // for (let j = 0; j < 8 - normalizedBundleFragment[i]; j++) {
  //   hHash.initialize();
  //   hHash.reset();
  //   hHash.absorbBits(hash, 0, hHash.getHashLength());
  //   hHash.squeezeBits(hash, 0, hHash.getHashLength() * 8);
  // }

  // for (let j = 0; j < hHash.getHashLength(); j++) {
  //   sigFragment[i * hHash.getHashLength() + j] = hash[j];
  // }

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

  //const normalizedBundleFragments = [];
  //normalization is not needed anymore
  const normalizedBundle = toHBytes(bundleHash); //normalizedBundleHash(bundleHash);
  // Split hash into 3 fragments
  // for (let i = 0; i < 3; i++) {
  //   normalizedBundleFragments[i] = normalizedBundle.slice(
  //     i * SIGNATURE_FRAGMENT_NO,
  //     (i + 1) * SIGNATURE_FRAGMENT_NO
  //   );
  // }
  // Get digests
  // tslint:disable-next-line no-shadowed-variable

  const publicKey = toHBytes(expectedAddress);

  // validate schnorr signature:
  let isValid: boolean = true;
  signatureFragments.forEach(value => {
    console.log("signatureFragments: " + value);
    const signature: HSign = HSign.generateSignatureFromArray(
      toHBytes(value.slice(0, SIGNATURE_TOTAL_BYTE_SIZE * 2))
    );
    isValid = isValid && Schnorr.verify(normalizedBundle, signature, publicKey);
  });

  // const digests = new Int8Array(
  //   signatureFragments.length * 32 * HASH_BITS_SIZE
  // );
  // for (let i = 0; i < signatureFragments.length; i++) {
  //   const digestBuffer = digest(
  //     normalizedBundleFragments[i % 3],
  //     hbits(signatureFragments[i])
  //   );
  //   for (let j = 0; j < HASH_BITS_SIZE; j++) {
  //     digests[i * HASH_BITS_SIZE + j] = digestBuffer[j];
  //   }
  // }
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
