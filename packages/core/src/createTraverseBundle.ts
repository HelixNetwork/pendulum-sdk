import {
  tailTransactionValidator,
  transactionHashValidator
} from "@helixnetwork/transaction";
import { asTransactionObject } from "@helixnetwork/transaction-converter";
import * as Promise from "bluebird";
import { validate } from "../../guards";
import { Callback, Hash, Provider, Transaction } from "../../types";
import { createGetHBytes } from "./";

/**
 * @method createTraverseBundle
 *
 * @memberof module:core
 *
 * @param {Provider} provider
 *
 * @return {function} {@link #module_core.traverseBundle `traverseBundle`}
 */
export const createTraverseBundle = (provider: Provider) => {
  const getHBytes = createGetHBytes(provider);

  /**
   * Fetches the bundle of a given the _tail_ transaction hash, by traversing through `trunkTransaction`.
   * It does not validate the bundle.
   *
   * @example
   *
   * ```js
   * traverseBundle(tail)
   *    .then(bundle => {
   *        // ...
   *    })
   *    .catch(err => {
   *        // handle errors
   *    })
   * ```
   *
   * @method traverseBundle
   *
   * @memberof module:core
   *
   * @param {Hash} trunkTransaction - Trunk transaction, should be tail (`currentIndex == 0`)
   * @param {Hash} [bundle=[]] - List of accumulated transactions
   * @param {Callback} [callback] - Optional callback
   *
   * @returns {Promise}
   * @fulfil {Transaction[]} Bundle as array of transaction objects
   * @reject {Error}
   * - `INVALID_TRANSACTION_HASH`
   * - `INVALID_TAIL_HASH`: Provided transaction is not tail (`currentIndex !== 0`)
   * - `INVALID_BUNDLE`: Bundle is syntactically invalid
   * - Fetch error
   */
  return function traverseBundle(
    trunkTransaction: Hash,
    bundle: ReadonlyArray<Transaction> = [],
    callback?: Callback<ReadonlyArray<Transaction>>
  ): Promise<ReadonlyArray<Transaction>> {
    console.log("treaversebundel trunk=" + trunkTransaction);
    return Promise.resolve(validate(transactionHashValidator(trunkTransaction)))
      .then(() => getHBytes([trunkTransaction]))
      .then(([hbytes]) => asTransactionObject(hbytes, trunkTransaction))
      .tap(transaction =>
        validate(bundle.length === 0 && tailTransactionValidator(transaction))
      )
      .then(
        transaction =>
          transaction.currentIndex === transaction.lastIndex
            ? bundle.concat(transaction)
            : traverseBundle(
                transaction.trunkTransaction,
                bundle.concat(transaction)
              )
      )
      .asCallback(arguments[1] === "function" ? arguments[1] : callback);
  };
};
