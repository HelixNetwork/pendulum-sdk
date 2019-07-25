import { transactionHashValidator } from "@helixnetwork/transaction";
import * as Promise from "bluebird";
import { arrayValidator, validate } from "../../guards";
import {
  Callback,
  GetTransactionStringsCommand,
  GetTransactionStringsResponse,
  Hash,
  HBytes,
  ProtocolCommand,
  Provider
} from "../../types";

/**
 * @method createGetTransactionStrings
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {function} {@link #module_core.getBytes `getBytes`}
 */
export const createGetTransactionStrings = ({ send }: Provider) =>
  /**
   * Fetches the transaction hbytes given a list of transaction hashes, by calling
   * [`getBytes`](https://docs.hlx.ai/hlx/api#endpoints/getTransactionStrings) command.
   *
   * @example
   * ```js
   * getBytes(hashes)
   *   // Parsing as transaction objects
   *   .then(hbytes => asTransactionObjects(hashes)(hbytes))
   *   .then(transactions => {
   *     // ...
   *   })
   *   .catch(err => {
   *     // ...
   *   })
   * ```
   *
   * @method getBytes
   *
   * @memberof module:core
   *
   * @param {Array<Hash>} hashes - List of transaction hashes
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise}
   * @fulfil {HBytes[]} - Transaction hbytes
   * @reject Error{}
   * - `INVALID_TRANSACTION_HASH`: Invalid hash
   * - Fetch error
   */
  function getTransactionStrings(
    hashes: ReadonlyArray<Hash>,
    callback?: Callback<ReadonlyArray<HBytes>>
  ): Promise<ReadonlyArray<HBytes>> {
    return Promise.resolve(
      validate(arrayValidator(transactionHashValidator)(hashes))
    )
      .then(() =>
        send<GetTransactionStringsCommand, GetTransactionStringsResponse>({
          command: ProtocolCommand.GET_TRANSACTION_STRINGS,
          hashes
        })
      )
      .then(({ hbytes }) => hbytes)
      .asCallback(callback);
  };
