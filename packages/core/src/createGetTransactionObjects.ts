import { transactionHashValidator } from "@helixnetwork/transaction";
import { asTransactionObjects } from "@helixnetwork/transaction-converter";
import * as Promise from "bluebird";
import { arrayValidator, validate } from "../../guards";
import { Callback, Hash, TxHex, Provider, Transaction } from "../../types";
import { createGetTransactionStrings } from "./";

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
  const getTransactionStrings = createGetTransactionStrings(provider);

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
    return Promise.resolve(
      validate(arrayValidator(transactionHashValidator)(hashes))
    )
      .then(() => getTransactionStrings(hashes))
      .then(asTransactionObjects(hashes))
      .asCallback(callback);
  };
};
