import { composeAPI } from "@helix/core";
import * as config from "./config";

/**
 * API to invoke storeTransactions using composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * Persists a list of _attached_ transaction trytes in the store of connected node-
 *
 * @param {Provider} provider - Network provider
 *
 */

const helix: any = composeAPI({
  provider: config.provider
});

/**
 *
 *
 * @method storeTransactions
 *
 *
 * @param {Trytes[]} trytes - Attached transaction trytes
 *
 *  @return {Promise}
 * @fullfil {Trytes[]} Attached transaction trytes
 * @reject {Error}
 * - `INVALID_ATTACHED_TRYTES`: Invalid attached trytes
 * - Fetch error
 */

export const storeTransactions = (trytes: string[]): Promise<any> => {
  return helix.storeTransactions(trytes);
};
