import { composeAPI } from "@helix/core";
import * as config from "./config";

/**
 * API to invoke broadcastTransaction using composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * Re-broadcasts all transactions in a bundle given the tail transaction hash.
 *
 * @param {Provider} provider - Network provider
 *
 */

const helix: any = composeAPI({
  provider: config.provider
});

/**
 *
 * @method broadcastBundle
 *
 *
 *
 * @param {Hash} tailTransactionHash - Tail transaction hash
 *
 * @return {Promise}
 * @fulfil {Transaction[]} List of transaction objects
 * @reject {Error}
 * - `INVALID_HASH`: Invalid tail transaction hash
 * - `INVALID_BUNDLE`: Invalid bundle
 * - Fetch error
 */

export const branchTransaction = function(tailHash: any): Promise<any> {
  return helix.broadcastTransactions(tailHash);
};
