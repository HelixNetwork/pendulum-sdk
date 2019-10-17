import { transactionHashValidator } from "@helixnetwork/transaction";
import * as Promise from "bluebird";
import { arrayValidator, validate } from "../../guards";
import {
  Callback,
  GetInclusionStatesCommand,
  GetInclusionStatesResponse,
  Hash,
  ProtocolCommand,
  Provider
} from "../../types";

/**
 * @method createGetInclusionStates
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider for accessing a helix node
 *
 * @return {function} {@link #module_core.getInclusionStates `getInclusionStates`}
 */
export const createGetInclusionStates = ({ send }: Provider) =>
  /**
   * Fetches inclusion states of given list of transactions, by calling
   * [`getInclusionStates`](https://docs.hlx.ai/hlx/api#endpoints/getInclusionsStates) command.
   *
   * @example
   * ```js
   * getInclusionStates(transactions)
   *   .then(states => {
   *     // ...
   *   })
   *   .catch(err => {
   *     // ...
   *   })
   * ```
   *
   * @method getInclusionStates
   *
   * @memberof module:core
   *
   * @param {Hash[]} transactions - List of transaction hashes
   * @param {Hash[]} tips - List of tips to check if transactions are referenced by
   * @param {Callback} [callback] - Optional callback
   *
   * @return {Promise}
   * @fulfil {boolean[]} Array of inclusion state
   * @reject {Error}
   * - `INVALID_TRANSACTION_HASH`: Invalid `hashes` or `tips`
   * - Fetch error
   */
  (
    transactions: ReadonlyArray<Hash>,
    tips: ReadonlyArray<Hash>,
    callback?: Callback<ReadonlyArray<boolean>>
  ): Promise<ReadonlyArray<boolean>> =>
    Promise.resolve(
      validate(arrayValidator(transactionHashValidator)(transactions))
    )
      .then(() =>
        send<GetInclusionStatesCommand, GetInclusionStatesResponse>({
          command: ProtocolCommand.GET_INCLUSION_STATES,
          transactions,
          tips: []
        })
      )
      .then(({ states }) => states)
      .asCallback(callback);
