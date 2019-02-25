import { bundleValidator } from "@helixnetwork/bundle-validator";
import { transactionHashValidator } from "@helixnetwork/transaction";
import * as Promise from "bluebird";
import { validate } from "../../guards";
import { Bundle, Callback, Hash, Provider, Transaction } from "../../types";
import { createTraverseBundle } from "./";

export const validateBundle = (bundle: Bundle) =>
  validate(bundleValidator(bundle));

/**
 * @method createGetBundle
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider for accessing a helix node.
 *
 * @return {function} {@link #module_core.getBundle `getBundle`}
 */
export const createGetBundle = (provider: Provider) => {
  const traverseBundle = createTraverseBundle(provider);

  /**
   * Fetches and validates the bundle given a _tail_ transaction hash, by calling
   * [`traverseBundle`]{@link #module_core.traverseBundle} and traversing through `trunkTransaction`.
   *
   * @example
   *
   * ```js
   * getBundle(tail)
   *    .then(bundle => {
   *        // ...
   *    })
   *    .catch(err => {
   *        // handle errors
   *    })
   * ```
   *
   * @method getBundle
   *
   * @memberof module:core
   *
   * @param {Hash} tailTransactionHash - Tail transaction hash
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
  return function getBundle(
    tailTransactionHash: Hash,
    callback?: Callback<Bundle>
  ): Promise<Bundle> {
    return Promise.resolve(
      validate(transactionHashValidator(tailTransactionHash))
    )
      .then(() => traverseBundle(tailTransactionHash))
      .tap(validateBundle)
      .asCallback(callback);
  };
};
