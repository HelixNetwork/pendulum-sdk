import { transactionHashValidator } from "@helixnetwork/transaction";
import { asFinalTransactionStrings } from "@helixnetwork/transaction-converter";
import * as Promise from "bluebird";
import { validate } from "../../guards";
import { Callback, Hash, Provider, TxHex } from "../../types";
import { createBroadcastTransactions, createGetBundle } from "./";

/**
 * @method createBroadcastBundle
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {function} {@link #module_core.broadcastBundle `broadcastBundle`}
 */
export const createBroadcastBundle = (provider: Provider) => {
  const broadcastTransactions = createBroadcastTransactions(provider);
  const getBundle = createGetBundle(provider);

  /**
   * Re-broadcasts all transactions in a bundle given the tail transaction hash.
   * It might be useful when transactions did not properly propagate,
   * particularly in the case of large bundles.
   *
   * @example
   *
   * ```js
   * broadcastTransactions(tailHash)
   *   .then(transactions => {
   *      // ...
   *   })
   *   .catch(err => {
   *     // ...
   *   })
   * ```
   *
   * @method broadcastBundle
   *
   * @memberof module:core
   *
   * @param {Hash} tailTransactionHash - Tail transaction hash
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise}
   * @fulfil {Transaction[]} List of transaction objects
   * @reject {Error}
   * - `INVALID_HASH`: Invalid tail transaction hash
   * - `INVALID_BUNDLE`: Invalid bundle
   * - Fetch error
   */
  return function broadcastBundle(
    tailTransactionHash: Hash,
    callback?: Callback<ReadonlyArray<TxHex>>
  ): Promise<ReadonlyArray<TxHex>> {
    return Promise.resolve(
      validate(transactionHashValidator(tailTransactionHash))
    )
      .then(() => getBundle(tailTransactionHash))
      .then(asFinalTransactionStrings)
      .then(broadcastTransactions)
      .asCallback(callback);
  };
};
