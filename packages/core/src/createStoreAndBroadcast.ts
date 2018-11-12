import * as Promise from "bluebird";
import { createBroadcastTransactions, createStoreTransactions } from "./";
import { Callback, Provider, HBytes } from "../../types";

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
   * Stores and broadcasts a list of _attached_ transaction hbytes by calling
   * [`storeTransactions`]{@link #module_core.storeTransactions} and
   * [`broadcastTransactions`]{@link #module_core.broadcastTransactions}.
   *
   * Note: Persist the transaction hbytes in local storage **before** calling this command, to ensure
   * that reattachment is possible, until your bundle has been included.
   *
   * Any transactions stored with this command will eventaully be erased, as a result of a snapshot.
   *
   * @method storeAndBroadcast
   *
   * @memberof module:core
   *
   * @param {Array<HBytes>} hbytes - Attached transaction hbytes
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise<HBytes[]>}
   * @fulfil {HBytes[]} Attached transaction hbytes
   * @reject {Error}
   * - `INVALID_ATTACHED_HBYTES`: Invalid attached hbytes
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
