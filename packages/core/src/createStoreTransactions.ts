import { attachedTxHexValidator } from "@helixnetwork/transaction";
import * as Promise from "bluebird";
import { arrayValidator, validate } from "../../guards";
import {
  Callback,
  TxHex,
  ProtocolCommand,
  Provider,
  StoreTransactionsCommand,
  StoreTransactionsResponse
} from "../../types";

/**
 * @method createStoreTransactions
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {function} {@link #module_core.storeTransactions `storeTransactions`}
 */
export const createStoreTransactions = ({ send }: Provider) =>
  /**
   * @description Persists a list of _attached_ transaction txs in the store of connected node by calling
   * [`storeTransactions`](https://docs.hlx.ai/hlx/api#endpoints/storeTransactions) command.
   * Tip selection and Proof-of-Work must be done first, by calling
   * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove} and
   * [`attachToTangle`]{@link #module_core.attachToTangle} or an equivalent attach method or remote
   * [`PoW-Integrator`](https://powbox.devnet.iota.org/).
   *
   * Persist the transaction txs in local storage **before** calling this command, to ensure
   * reattachment is possible, until your bundle has been included.
   *
   * Any transactions stored with this command will eventaully be erased, as a result of a snapshot.
   *
   * @method storeTransactions
   *
   * @memberof module:core
   *
   * @param {TxHex[]} txs - Attached transaction txs
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise}
   * @fullfil {TxHex[]} Attached transaction txs
   * @reject {Error}
   * - `INVALID_ATTACHED_TX_HEX`: Invalid attached txs
   * - Fetch error
   */
  (
    txs: ReadonlyArray<TxHex>,
    callback?: Callback<ReadonlyArray<TxHex>>
  ): Promise<ReadonlyArray<TxHex>> =>
    Promise.resolve(validate(arrayValidator(attachedTxHexValidator)(txs)))
      .then(() =>
        send<StoreTransactionsCommand, StoreTransactionsResponse>({
          command: ProtocolCommand.STORE_TRANSACTIONS,
          txs
        })
      )
      .then(() => txs)
      .asCallback(callback);
