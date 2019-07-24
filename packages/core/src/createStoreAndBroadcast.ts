import * as Promise from "bluebird";
import { Callback, HBytes, Provider } from "../../types";
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
   * Stores and broadcasts a list of _attached_ transaction tx by calling
   * [`storeTransactions`]{@link #module_core.storeTransactions} and
   * [`broadcastTransactions`]{@link #module_core.broadcastTransactions}.
   *
   * Note: Persist the transaction tx in local storage **before** calling this command, to ensure
   * that reattachment is possible, until your bundle has been included.
   *
   * Any transactions stored with this command will eventaully be erased, as a result of a snapshot.
   *
   * @method storeAndBroadcast
   *
   * @memberof module:core
   *
   * @param {Array<HBytes>} tx - Attached transaction tx
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise<HBytes[]>}
   * @fulfil {HBytes[]} Attached transaction tx
   * @reject {Error}
   * - `INVALID_ATTACHED_HBYTES`: Invalid attached tx
   * - Fetch error
   */
  return (
    hbytes: ReadonlyArray<HBytes>,
    callback?: Callback<ReadonlyArray<HBytes>>
  ): Promise<ReadonlyArray<HBytes>> =>
    storeTransactions(hbytes)
      .then(broadcastTransactions)
      .asCallback(callback);
};
