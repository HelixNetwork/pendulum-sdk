import * as bPromise from "bluebird";
import { Callback, Hash, TransactionTxHex } from "../../types";
import { processLocalPow } from "./processLocalPow";

/**
 * @method prepareForTangleWithLocalPow
 *
 * @memberof module:pow
 *
 * @return {Function} {@link #module_pow.attachLocalPow `attachLocalPow`}
 */

export const prepareForTangleWithLocalPow = function attachLocalPow(
  trunkTransaction: Hash,
  branchTransaction: Hash,
  minWeightMagnitude: number,
  txs: ReadonlyArray<TransactionTxHex>,
  callback?: Callback<ReadonlyArray<TransactionTxHex>>
): bPromise<ReadonlyArray<TransactionTxHex>> {
  /**
   * Performs local the Proof-of-Work required to attach a transaction to the Tangle
   * Returns list of transaction txs and overwrites the following fields:
   *  - `hash`
   *  - `nonce`
   *  - `attachmentTimestamp`
   *  - `attachmentTimsetampLowerBound`
   *  - `attachmentTimestampUpperBound`
   *
   * This method perform a local pow, should be used as explained bellow
   *
   * `trunkTransaction` and `branchTransaction` hashes are given by
   * {@link #module_core.getTransactionsToApprove `getTransactionToApprove`}.
   *
   * @example
   *
   * ```js
   *
   * const helix = composeAPI({
   *   provider: "https://test.net:8087",
   *   attachToTangle: localAttachToTangle
   * });
   * ```
   *
   * @method attachToTangle
   *
   * @memberof module:core
   *
   * @param {Hash} trunkTransaction - Trunk transaction as returned by
   * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove}
   * @param {Hash} branchTransaction - Branch transaction as returned by
   * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove}
   * @param {number} minWeightMagnitude - Number of minimun trailing zeros in tail transaction hash
   * @param {TransactionTxHex[]} txs - List of transaction txs
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise}
   * @fulfil {TransactionTxHex[]} Array of transaction txs with nonce and attachment timestamps
   * @reject {Error}
   * - `INVALID_BUNDLE_INDEX`: Invalid `bundle index`
   * - `INVALID_TRUNK_TRANSACTION`: Invalid `trunkTransaction`
   * - `INVALID_BRANCH_TRANSACTION`: Invalid `branchTransaction`
   * - `INVALID_MIN_WEIGHT_MAGNITUDE`: Invalid `minWeightMagnitude` argument
   * - `INVALID_TRANSACTION_TX_HEX`: Invalid transaction txs
   * - `INVALID_TRANSACTIONS_TO_APPROVE`: Invalid transactions to approve
   * - Fetch error
   */

  return new bPromise<ReadonlyArray<TransactionTxHex>>((resolve, reject) => {
    processLocalPow(
      trunkTransaction,
      branchTransaction,
      minWeightMagnitude,
      txs,
      resolve,
      reject,
      callback
    );
  });
};
