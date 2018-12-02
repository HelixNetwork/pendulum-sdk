import * as Promise from "bluebird";
import { transactionHashValidator } from "@helixnetworknetwork/transaction";
import { arrayValidator, validate } from "../../guards";
import {
  Callback,
  GetHBytesCommand,
  GetHBytesResponse,
  Hash,
  ProtocolCommand,
  Provider,
  HBytes
} from "../../types";

/**
 * @method createGetHBytes
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {function} {@link #module_core.getHBytes `getHBytes`}
 */
export const createGetHBytes = ({ send }: Provider) =>
  /**
   * Fetches the transaction hbytes given a list of transaction hashes, by calling
   * [`getHBytes`](https://docs.iota.works/iri/api#endpoints/getHBytes) command.
   *
   * @example
   * ```js
   * getHBytes(hashes)
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
   * @method getHBytes
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
  function getHBytes(
    hashes: ReadonlyArray<Hash>,
    callback?: Callback<ReadonlyArray<HBytes>>
  ): Promise<ReadonlyArray<HBytes>> {
    return Promise.resolve(
      validate(arrayValidator(transactionHashValidator)(hashes))
    )
      .then(() =>
        send<GetHBytesCommand, GetHBytesResponse>({
          command: ProtocolCommand.GET_HBYTES,
          hashes
        })
      )
      .then(({ hbytes }) => hbytes)
      .asCallback(callback);
  };
