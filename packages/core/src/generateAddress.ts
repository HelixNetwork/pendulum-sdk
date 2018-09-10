import { addChecksum } from '@helix/checksum'
import { trits, trytes } from '@helix/converter'
import { address, digests, key, subseed } from '@helix/signing'
import { Hash } from '../../types'

/**
 * Generates an address deterministically, according to the given seed, index and security level.
 *
 * @method generateAddress
 *
 * @memberof module:core
 *
 * @param {string} seed
 * @param {number} index - Private key index
 * @param {number} [security=2] - Security level of the private key
 * @param {boolean} [checksum=false] - Flag to add 9trytes checksum
 *
 * @returns {Hash} Address trytes
 */
export const generateAddress = (seed: string, index: number, security: number = 2, checksum: boolean = false): Hash => {
    while (seed.length % 81 !== 0) {
        seed += 9
    }

    const keyTrits = key(subseed(trits(seed), index), security)
    const digestsTrits = digests(keyTrits)
    const addressTrytes = trytes(address(digestsTrits))

    return checksum ? addChecksum(addressTrytes) : addressTrytes
}
