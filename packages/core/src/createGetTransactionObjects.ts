import * as Promise from 'bluebird'
import { transactionHashValidator } from '@helix/transaction'
import { asTransactionObjects } from '@helix/transaction-converter'
import { arrayValidator, validate } from '../../guards'
import { Callback, Hash, Provider, Transaction, Trytes } from '../../types'
import { createGetTrytes } from './'

/**
 * @method createGetTransactionObjects
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {Function} {@link #module_core.getTransactionObjects `getTransactionObjects`}
 */
export const createGetTransactionObjects = (provider: Provider) => {
    const getTrytes = createGetTrytes(provider)

    /**
     * Fetches the transaction objects, given an array of transaction hashes.
     *
     * @example
     *
     * ```js
     * getTransactionObjects(hashes)
     *   .then(transactions => {
     *     // ...
     *   })
     *   .catch(err => {
     *     // handle errors
     *   })
     * ```
     *
     * @method getTransactionObjects
     *
     * @memberof module:core
     *
     * @param {Hash[]} hashes - Array of transaction hashes
     * @param {Function} [callback] - Optional callback
     *
     * @returns {Promise}
     * @fulfil {Transaction[]} - List of transaction objects
     * @reject {Error}
     * - `INVALID_TRANSACTION_HASH`
     * - Fetch error
     */
    return function getTransactionObjects(
        hashes: ReadonlyArray<Hash>,
        callback?: Callback<ReadonlyArray<Transaction>>
    ): Promise<ReadonlyArray<Transaction>> {
        return Promise.resolve(validate(arrayValidator(transactionHashValidator)(hashes)))
            .then(() => getTrytes(hashes))
            .then(asTransactionObjects(hashes))
            .asCallback(callback)
    }
}
