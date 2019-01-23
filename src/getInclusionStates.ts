import { composeAPI } from "@helix/core";
import * as config from "./config";

/**
 * API to invoke getInclusionStates using composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 *  Fetches inclusion states of given list of transactions
 *
 * @param {Provider} provider - Network provider
 *
 * @example sample output
 * {
 * "states": [true],
 * "duration": 91
 * }
 *
 *
 */

const helix: any = composeAPI({
  provider: config.provider
});

/**
 *
 * @method getIn-clusionStates
 *
 * @param {Hash[]} transactions - List of transaction hashes
 * @param {Hash[]} tips - List of tips to check if transactions are referenced by
 *
 * @return {Promise}
 * @fulfil {boolean[]} Array of inclusion state
 * @reject {Error}
 * - `INVALID_TRANSACTION_HASH`: Invalid `hashes` or `tips`
 * - Fetch error
 */

export const getInclusionStates = function(
  transaction: Array<String>,
  tips: Array<String>
): Promise<any> {
  return helix.getInclusionStates(transaction, tips);
};
