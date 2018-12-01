import { transactionHBytesValidator } from "@helix/transaction";
import { asTransactionObject } from "@helix/transaction-converter";
import * as Promise from "bluebird";
import {
  arrayValidator,
  depthValidator,
  minWeightMagnitudeValidator,
  validate
} from "../../guards";
import {
  AttachToTangle,
  Bundle,
  Callback,
  Hash,
  Provider,
  Transaction,
  HBytes
} from "../../types";
import {
  createAttachToTangle,
  createGetTransactionsToApprove,
  createStoreAndBroadcast
} from "./";

/**
 * @method createSendHBytes
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {Function} {@link #module_core.sendHBytes `sendHBytes`}
 */
export const createSendHBytes = (
  provider: Provider,
  attachFn?: AttachToTangle
) => {
  const getTransactionsToApprove = createGetTransactionsToApprove(provider);
  const storeAndBroadcast = createStoreAndBroadcast(provider);
  const attachToTangle = attachFn || createAttachToTangle(provider);

  /**
   * [Attaches to tanlge]{@link #module_core.attachToTangle}, [stores]{@link #module_core.storeTransactions}
   * and [broadcasts]{@link #module_core.broadcastTransactions} a list of transaction hbytes.
   *
   * @example
   * ```js
   * prepareTransfers(seed, transfers)
   *   .then(hbytes => sendHBytes(hbytes, depth, minWeightMagnitude))
   *   .then(transactions => {
   *     // ...
   *   })
   *   .catch(err => {
   *     // ...
   *   })
   * ```
   *
   * @method sendHBytes
   *
   * @memberof module:core
   *
   * @param {HBytes[]} hbytes - List of hbytes to attach, store & broadcast
   * @param {number} depth - Depth
   * @param {number} minWeightMagnitude - Min weight magnitude
   * @param {string} [reference] - Optional reference hash
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise}
   * @fulfil {Transaction[]}  Returns list of attached transactions
   * @reject {Error}
   * - `INVALID_TRANSACTION_HBYTES`
   * - `INVALID_DEPTH`
   * - `INVALID_MIN_WEIGHT_MAGNITUDE`
   * - Fetch error, if connected to network
   */
  return function sendHBytes(
    hbytes: ReadonlyArray<HBytes>,
    depth: number,
    minWeightMagnitude: number,
    reference?: Hash,
    callback?: Callback<Bundle>
  ): Promise<Bundle> {
    if (reference && typeof reference === "function") {
      callback = reference;
      reference = undefined;
    }

    return Promise.resolve(
      validate(
        arrayValidator(transactionHBytesValidator)(hbytes),
        depthValidator(depth),
        minWeightMagnitudeValidator(minWeightMagnitude)
      )
    )
      .then(() => getTransactionsToApprove(depth, reference))
      .then(({ trunkTransaction, branchTransaction }) =>
        attachToTangle(
          trunkTransaction,
          branchTransaction,
          minWeightMagnitude,
          hbytes
        )
      )
      .tap(attachedHBytes => storeAndBroadcast(attachedHBytes))
      .then(attachedHBytes => attachedHBytes.map(t => asTransactionObject(t)))
      .asCallback(typeof arguments[3] === "function" ? arguments[3] : callback);
  };
};
