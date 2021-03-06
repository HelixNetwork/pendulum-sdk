import {
  transactionHashValidator,
  transactionTxHexValidator
} from "@helixnetwork/transaction";
import * as Promise from "bluebird";
import {
  INVALID_BRANCH_TRANSACTION,
  INVALID_TRUNK_TRANSACTION
} from "../../errors";
import { arrayValidator, integerValidator, validate } from "../../guards";
import {
  AttachToTangle,
  AttachToTangleCommand,
  AttachToTangleResponse,
  Callback,
  Hash,
  ProtocolCommand,
  Provider,
  TransactionTxHex
} from "../../types";

/**
 * @method createAttachToTangle
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {Function} {@link #module_core.attachToTangle `attachToTangle`}
 */
export const createAttachToTangle = ({ send }: Provider): AttachToTangle => {
  /**
   * Performs the Proof-of-Work required to attach a transaction to the Tangle by
   * calling [`attachToTangle`](https://docs.helix.works/hlx/api#endpoints/attachToTangle) command.
   * Returns list of transaction txs and overwrites the following fields:
   *  - `hash`
   *  - `nonce`
   *  - `attachmentTimestamp`
   *  - `attachmentTimsetampLowerBound`
   *  - `attachmentTimestampUpperBound`
   *
   * This method can be replaced with a local equivelant such as
   * < in development >
   * or remote [`PoW-Integrator`]().
   *
   * `trunkTransaction` and `branchTransaction` hashes are given by
   * {@link #module_core.getTransactionsToApprove `getTransactionToApprove`}.
   *
   * @example
   *
   * ```js
   * getTransactionsToApprove(depth)
   *   .then(({ trunkTransaction, branchTransaction }) =>
   *     attachToTangle(trunkTransaction, branchTransaction, minWightMagnitude, txs)
   *   )
   *   .then(attachedTxHex => {
   *     // ...
   *   })
   *   .catch(err => {
   *     // ...
   *   })
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
   * - `INVALID_TRUNK_TRANSACTION`: Invalid `trunkTransaction`
   * - `INVALID_BRANCH_TRANSACTION`: Invalid `branchTransaction`
   * - `INVALID_MIN_WEIGHT_MAGNITUDE`: Invalid `minWeightMagnitude` argument
   * - `INVALID_TRANSACTION_TX_HEX`: Invalid transaction txs
   * - `INVALID_TRANSACTIONS_TO_APPROVE`: Invalid transactions to approve
   * - Fetch error
   */
  return function attachToTangle(
    trunkTransaction: Hash,
    branchTransaction: Hash,
    minWeightMagnitude: number,
    txs: ReadonlyArray<TransactionTxHex>,
    callback?: Callback<ReadonlyArray<TransactionTxHex>>
  ): Promise<ReadonlyArray<TransactionTxHex>> {
    return Promise.resolve(
      validate(
        integerValidator(minWeightMagnitude),
        arrayValidator<TransactionTxHex>(transactionTxHexValidator)(txs),
        transactionHashValidator(trunkTransaction, INVALID_TRUNK_TRANSACTION),
        transactionHashValidator(branchTransaction, INVALID_BRANCH_TRANSACTION)
      )
    )
      .then(() =>
        send<AttachToTangleCommand, AttachToTangleResponse>({
          command: ProtocolCommand.ATTACH_TO_TANGLE,
          trunkTransaction,
          branchTransaction,
          minWeightMagnitude,
          txs
        })
      )
      .then(({ txs }) => txs)
      .asCallback(typeof arguments[2] === "function" ? arguments[2] : callback);
  };
};
