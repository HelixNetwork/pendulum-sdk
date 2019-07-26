import { transactionHashValidator } from "@helixnetwork/transaction";
import * as Promise from "bluebird";
import { arrayValidator, validate } from "../../guards";
import {
  Callback,
  GetTransactionStringsCommand,
  GetTransactionStringsResponse,
  Hash,
  TxHex,
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
 * @return {function} {@link #module_core.getTransactionStrings `getTransactionStrings`}
 */
export const createGetTransactionStrings = ({ send }: Provider) =>
  /**
   * Fetches the transaction transactionStrings given a list of transaction hashes, by calling
   * [`getTransactionStrings`](https://docs.hlx.ai/hlx/api#endpoints/getTransactionStrings) command.
   *
   * @example
   * ```js
   * getTransactionStrings(hashes)
   *   // Parsing as transaction objects
   *   .then(transactionStrings => asTransactionObjects(hashes)(transactionStrings))
   *   .then(transactions => {
   *     // ...
   *   })
   *   .catch(err => {
   *     // ...
   *   })
   * ```
   *
   * @method getTransactionStrings
   *
   * @memberof module:core
   *
   * @param {Array<Hash>} hashes - List of transaction hashes
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise}
   * @fulfil {TxHex[]} - Transaction transactionStrings
   * @reject Error{}
   * - `INVALID_TRANSACTION_HASH`: Invalid hash
   * - Fetch error
   */
  function getTransactionStrings(
    hashes: ReadonlyArray<Hash>,
    callback?: Callback<ReadonlyArray<TxHex>>
  ): Promise<ReadonlyArray<TxHex>> {
    return Promise.resolve(
      validate(arrayValidator(transactionHashValidator)(hashes))
    )
      .then(() =>
        send<GetTransactionStringsCommand, GetTransactionStringsResponse>({
          command: ProtocolCommand.GET_TRANSACTION_STRINGS,
          hashes
        })
      )
      .then(({ txs }) => txs)
      .asCallback(callback);
  };
