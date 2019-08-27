import * as Promise from "bluebird";
import { Callback, Provider, TxHex } from "../../types";
import { createBroadcastTransactions, createStoreTransactions } from "./";

/**
 * @method createStoreAndBroadcast
 *
 * @memberof module:core
 *
 * @param {Provider} provider
 *
 * @return {function} {@link #module_core.storeAndBroadcast `storeAndBroadcast`}
 */
export const createStoreAndBroadcast = (provider: Provider) => {
  const storeTransactions = createStoreTransactions(provider);
  const broadcastTransactions = createBroadcastTransactions(provider);

  /**
   * Stores and broadcasts a list of _attached_ transaction txs by calling
   * [`storeTransactions`]{@link #module_core.storeTransactions} and
   * [`broadcastTransactions`]{@link #module_core.broadcastTransactions}.
   *
   * Note: Persist the transaction txs in local storage **before** calling this command, to ensure
   * that reattachment is possible, until your bundle has been included.
   *
   * Any transactions stored with this command will eventaully be erased, as a result of a snapshot.
   *
   * @method storeAndBroadcast
   *
   * @memberof module:core
   *
   * @param {Array<TxHex>} txs - Attached transaction txs
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise<TxHex[]>}
   * @fulfil {TxHex[]} Attached transaction txs
   * @reject {Error}
   * - `INVALID_ATTACHED_TX_HEX`: Invalid attached txs
   * - Fetch error
   */
  return (
    txs: ReadonlyArray<TxHex>,
    callback?: Callback<ReadonlyArray<TxHex>>
  ): Promise<ReadonlyArray<TxHex>> =>
    storeTransactions(txs)
      .then(broadcastTransactions)
      .asCallback(callback);
};
