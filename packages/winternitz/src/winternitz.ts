/** @module winternitz */
// by: Frauke Sophie Abben <fsa@hlx.ai> (https://hlx.ai)

import Sha3 from '@helixnetwork/sha3'
import {hex , bytes} from '@helixnetwork/converter'
import * as errors from './errors'
import * as BN from 'bn.js'


/**
 * @method subseed
 *
 * @param {Uint8Array} seed - Seed trits
 * @param {number} index - Private key index
 *
 * @return {Uint8Array} subseed trits
 */

export function subseed(seed: Uint8Array, index: number): Uint8Array {
    if (index < 0) {
        throw new Error(errors.ILLEGAL_KEY_INDEX)
    }
    if (seed.length % 32 !== 0) {
        throw new Error(errors.ILLEGAL_SEED_LENGTH)
    }

    const indexBN: BN = new BN(index.toString(2), 2)
    let seedBN: BN = new BN(seed, 16)
    let subseed: Uint8Array = new Uint8Array(seedBN.add(indexBN).toBuffer())
    /*
    while (subseed.length % 32 !== 0) {
        subseed = padTrits(subseed.length + 3)(subseed)
    }*/

    const sha3 = new Sha3()
    sha3.absorb(subseed, 0, subseed.length)
    sha3.squeeze(subseed, 0, subseed.length)

    return subseed
}

/**
 * @method key
 *
 * @param {Uint8Array} subseed - Subseed trits
 * @param {number} length - Private key length/ security level (1,2 or 3)
 *
 * @return {Uint8Array} Private key trits
 */
export function key(subseed: Uint8Array, length: number): Uint8Array {
    if (subseed.length % 32 !== 0) {
        throw new Error(errors.ILLEGAL_SUBSEED_LENGTH)
    }

    const sha3 = new Sha3()
    sha3.absorb(subseed, 0, subseed.length)

    const buffer = new Uint8Array(Sha3.HASH_LENGTH)
    const result = new Uint8Array(length * 32 * 32)
    let offset = 0

    while (length-- > 0) {
        for (let i = 0; i < 32; i++) {
            sha3.squeeze(buffer, 0, subseed.length) // why subseed length, not sha3.hash_length?
            for (let j = 0; j < 32; j++) {
                result[offset++] = buffer[j]
            }
        }
    }
    return result
}

/**
 * @method digests
 *
 * @param {Uint8Array} key - Private key trits
 *
 * @return {Uint8Array}
 */
// tslint:disable-next-line no-shadowed-variable
export function digests(key: Uint8Array): Uint8Array {
    const l = Math.floor(key.length / 1024) // security level (1,2 or 3)
    const result = new Uint8Array(l * 32)
    let buffer = new Uint8Array(Sha3.HASH_LENGTH)

    for (let i = 0; i < l; i++) {
        const keyFragment = key.slice(i * 1024, (i + 1) * 1024)

        for (let j = 0; j < 32; j++) {
            buffer = keyFragment.slice(j * 32, (j + 1) * 32)

            for (let k = 0; k < 255; k++) {
                const keyFragmentSha3 = new Sha3()
                keyFragmentSha3.absorb(buffer, 0, buffer.length)
                keyFragmentSha3.squeeze(buffer, 0, Sha3.HASH_LENGTH)
                keyFragmentSha3.reset()
            }

            for (let k = 0; k < 32; k++) {
                keyFragment[j * 32 + k] = buffer[k]
            }
        }

        const digestsSha3 = new Sha3()
        digestsSha3.absorb(keyFragment, 0, keyFragment.length)
        digestsSha3.squeeze(buffer, 0, Sha3.HASH_LENGTH)

        for (let j = 0; j < 32; j++) {
            result[i * 32 + j] = buffer[j]
        }
    }
    return result
}

/**
 * @method address
 *
 * @param {Uint8Array} digests - Digests trits
 *
 * @return {Uint8Array} Address trits
 */
// tslint:disable-next-line no-shadowed-variable
export function address(digests: Uint8Array): Uint8Array {
    const address = new Uint8Array(Sha3.HASH_LENGTH)

    const sha3 = new Sha3()
    sha3.absorb(digests.slice(), 0, digests.length)
    sha3.squeeze(address, 0, Sha3.HASH_LENGTH)

    return address
}

/**
 * @method digest
 *
 * @param {array} normalizedBundleFragment - Normalized bundle fragment
 * @param {Uint8Array} signatureFragment - Signature fragment trits
 *
 * @return {Uint8Array} Digest trits
 */
// tslint:disable-next-line no-shadowed-variable
export function digest(normalizedBundleFragment: Uint8Array, signatureFragment: Uint8Array): Uint8Array {
    const digestSha3 = new Sha3()

    let buffer = new Uint8Array(Sha3.HASH_LENGTH)

    for (let i = 0; i < 32; i++) {
        buffer = signatureFragment.slice(i * 32, (i + 1) * 32)

        for (let j = normalizedBundleFragment[i]; j-- > 0; ) {

            const signatureFragmentSha3 = new Sha3()
            signatureFragmentSha3.absorb(buffer, 0, Sha3.HASH_LENGTH)
            signatureFragmentSha3.squeeze(buffer, 0, Sha3.HASH_LENGTH)
            signatureFragmentSha3.reset()
        }

        digestSha3.absorb(buffer, 0, Sha3.HASH_LENGTH)
    }

    digestSha3.squeeze(buffer, 0, Sha3.HASH_LENGTH)
    return buffer
}

/**
 * @method signatureFragment
 *
 * @param {array} normalizeBundleFragment - normalized bundle fragment
 * @param {keyFragment} keyFragment - key fragment trits
 *
 * @return {Uint8Array} Signature Fragment trits
 */
export function signatureFragment(normalizedBundleFragment: Uint8Array, keyFragment: Uint8Array): Uint8Array {
    const sigFragment = keyFragment.slice()

    const sha3 = new Sha3()

    for (let i = 0; i < 32; i++) {
        const hash = sigFragment.slice(i * 32, (i + 1) * 32)

        for (let j = 0; j < 255 - normalizedBundleFragment[i]; j++) {
            sha3.absorb(hash, 0, Sha3.HASH_LENGTH)
            sha3.squeeze(hash, 0, Sha3.HASH_LENGTH)
            sha3.reset()
        }

        for (let j = 0; j < 32; j++) {
            sigFragment[i * 32 + j] = hash[j]
        }
    }

    return sigFragment
}

/**
 * @method validateSignatures
 *
 * @param {string} expectedAddress - Expected address trytes
 * @param {array} signatureFragments - Array of signatureFragments trytes
 * @param {string} bundleHash - Bundle hash trytes
 *
 * @return {boolean}
 */
export function validateSignatures(
    expectedAddress: string,
    signatureFragments: ReadonlyArray<string>,
    bundleHash: string
): boolean {
    if (!bundleHash) {
        throw new Error(errors.INVALID_BUNDLE_HASH)
    }

    /*
    const normalizedBundleFragments = []
    const normalizedBundle = normalizedBundleHash(bundleHash)

    // Split hash into 3 fragments
    for (let i = 0; i < 3; i++) {
        normalizedBundleFragments[i] = normalizedBundle.slice(i * 27, (i + 1) * 27)
    }*/

    // Get digests
    // tslint:disable-next-line no-shadowed-variable
    const digests = new Uint8Array(signatureFragments.length * 32)

    for (let i = 0; i < signatureFragments.length; i++) {
        const digestBuffer = digest(bytes(bundleHash), bytes(signatureFragments[i]))

        for (let j = 0; j < 32; j++) {
            digests[i * 32 + j] = digestBuffer[j]
        }
    }

    return expectedAddress == hex(address(digests))
}
