import { attachedTxHexValidator } from "@helixnetwork/transaction";
import * as Promise from "bluebird";
import { arrayValidator, validate } from "../../guards";
import {
  BroadcastTransactionsCommand,
  BroadcastTransactionsResponse,
  Callback,
  ProtocolCommand,
  Provider,
  TxHex
} from "../../types";

/**
 * @method createBroadcastTransactions
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {function} {@link #module_core.broadcastTransactions `broadcastTransactions`}
 */
export const createBroadcastTransactions = ({ send }: Provider) =>
  /**
   * Broadcasts an list of _attached_ transaction txs to the network by calling
   * [`boradcastTransactions`](https://docs.hlx.ai/hlx/api#endpoints/broadcastTransactions) command.
   * Tip selection and Proof-of-Work must be done first, by calling
   * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove} and
   * [`attachToTangle`]{@link #module_core.attachToTangle} or an equivalent attach method or remote
   * [`PoW-Integrator`](https://powbox.testnet.iota.org/), which is a development tool.
   *
   * You may use this method to increase odds of effective transaction propagation.
   *
   * Persist the transaction txs in local storage **before** calling this command for first time, to ensure
   * that reattachment is possible, until your bundle has been included.
   *
   * @example
   *
   * ```js
   * broadcastTransactions(txs)
   *   .then(txs => {
   *      // ...
   *   })
   *   .catch(err => {
   *     // ...
   *   })
   * ```
   *
   * @method broadcastTransactions
   *
   * @memberof module:core
   *
   * @param {TransactionTxHex[]} txs - Attached Transaction txs
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise}
   * @fulfil {TxHex[]} Attached transaction txs
   * @reject {Error}
   * - `INVALID_ATTACHED_TX_HEX`: Invalid array of attached txs
   * - Fetch error
   */
  (
    txs: ReadonlyArray<TxHex>,
    callback?: Callback<ReadonlyArray<TxHex>>
  ): Promise<ReadonlyArray<TxHex>> =>
    Promise.resolve(
      validate(arrayValidator<TxHex>(attachedTxHexValidator)(txs))
    )
      .then(() =>
        send<BroadcastTransactionsCommand, BroadcastTransactionsResponse>({
          command: ProtocolCommand.BROADCAST_TRANSACTIONS,
          txs
        })
      )
      .then(() => txs)
      .asCallback(callback);
