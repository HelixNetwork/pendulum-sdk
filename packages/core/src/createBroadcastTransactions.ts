import { attachedHBytesValidator } from "@helixnetwork/transaction";
import * as Promise from "bluebird";
import { arrayValidator, validate } from "../../guards";
import {
  BroadcastTransactionsCommand,
  BroadcastTransactionsResponse,
  Callback,
  HBytes,
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
   * Broadcasts an list of _attached_ transaction hbytes to the network by calling
   * [`boradcastTransactions`](https://docs.hlx.ai/hlx/api#endpoints/broadcastTransactions) command.
   * Tip selection and Proof-of-Work must be done first, by calling
   * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove} and
   * [`attachToTangle`]{@link #module_core.attachToTangle} or an equivalent attach method or remote
   * [`PoW-Integrator`](https://powbox.testnet.iota.org/), which is a development tool.
   *
   * You may use this method to increase odds of effective transaction propagation.
   *
   * Persist the transaction hbytes in local storage **before** calling this command for first time, to ensure
   * that reattachment is possible, until your bundle has been included.
   *
   * @example
   *
   * ```js
   * broadcastTransactions(hbytes)
   *   .then(hbytes => {
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
   * @param {TransactionHBytes[]} hbytes - Attached Transaction hbytes
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise}
   * @fulfil {HBytes[]} Attached transaction hbytes
   * @reject {Error}
   * - `INVALID_ATTACHED_HBYTES`: Invalid array of attached hbytes
   * - Fetch error
   */
  (
    hbytes: ReadonlyArray<HBytes>,
    callback?: Callback<ReadonlyArray<HBytes>>
  ): Promise<ReadonlyArray<HBytes>> =>
    Promise.resolve(
      validate(arrayValidator<HBytes>(attachedHBytesValidator)(hbytes))
    )
      .then(() =>
        send<BroadcastTransactionsCommand, BroadcastTransactionsResponse>({
          command: ProtocolCommand.BROADCAST_TRANSACTIONS,
          hbytes
        })
      )
      .then(() => hbytes)
      .asCallback(callback);
