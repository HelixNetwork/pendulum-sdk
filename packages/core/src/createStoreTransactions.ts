import { attachedHBytesValidator } from "@helixnetworknetwork/transaction";
import * as Promise from "bluebird";
import { arrayValidator, validate } from "../../guards";
import {
  Callback,
  HBytes,
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
   * @description Persists a list of _attached_ transaction hbytes in the store of connected node by calling
   * [`storeTransactions`](https://docs.iota.org/iri/api#endpoints/storeTransactions) command.
   * Tip selection and Proof-of-Work must be done first, by calling
   * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove} and
   * [`attachToTangle`]{@link #module_core.attachToTangle} or an equivalent attach method or remote
   * [`PoWbox`](https://powbox.devnet.iota.org/).
   *
   * Persist the transaction hbytes in local storage **before** calling this command, to ensure
   * reattachment is possible, until your bundle has been included.
   *
   * Any transactions stored with this command will eventaully be erased, as a result of a snapshot.
   *
   * @method storeTransactions
   *
   * @memberof module:core
   *
   * @param {HBytes[]} hbytes - Attached transaction hbytes
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise}
   * @fullfil {HBytes[]} Attached transaction hbytes
   * @reject {Error}
   * - `INVALID_ATTACHED_HBYTES`: Invalid attached hbytes
   * - Fetch error
   */
  (
    hbytes: ReadonlyArray<HBytes>,
    callback?: Callback<ReadonlyArray<HBytes>>
  ): Promise<ReadonlyArray<HBytes>> =>
    Promise.resolve(validate(arrayValidator(attachedHBytesValidator)(hbytes)))
      .then(() =>
        send<StoreTransactionsCommand, StoreTransactionsResponse>({
          command: ProtocolCommand.STORE_TRANSACTIONS,
          hbytes
        })
      )
      .then(() => hbytes)
      .asCallback(callback);
