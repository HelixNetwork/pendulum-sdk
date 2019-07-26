import { attachedTxHexValidator } from "@helixnetwork/transaction";
import * as Promise from "bluebird";
import { arrayValidator, validate } from "../../guards";
import {
  BroadcastTransactionsCommand,
  BroadcastTransactionsResponse,
  Callback,
  TxHex,
  ProtocolCommand,
  Provider
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
   * Broadcasts an list of _attached_ transaction txHex to the network by calling
   * [`boradcastTransactions`](https://docs.hlx.ai/hlx/api#endpoints/broadcastTransactions) command.
   * Tip selection and Proof-of-Work must be done first, by calling
   * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove} and
   * [`attachToTangle`]{@link #module_core.attachToTangle} or an equivalent attach method or remote
   * [`PoW-Integrator`](https://powbox.testnet.iota.org/), which is a development tool.
   *
   * You may use this method to increase odds of effective transaction propagation.
   *
   * Persist the transaction txHex in local storage **before** calling this command for first time, to ensure
   * that reattachment is possible, until your bundle has been included.
   *
   * @example
   *
   * ```js
   * broadcastTransactions(txHex)
   *   .then(txHex => {
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
   * @param {TransactionTxHex[]} txHex - Attached Transaction txHex
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise}
   * @fulfil {TxHex[]} Attached transaction txHex
   * @reject {Error}
   * - `INVALID_ATTACHED_HBYTES`: Invalid array of attached txHex
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
