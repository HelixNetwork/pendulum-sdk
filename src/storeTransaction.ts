import { composeAPI } from "@helixnetwork/core";
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
 * @param {bytes[]} bytes - Attached transaction bytes
 *
 *  @return {Promise}
 * @fullfil {bytes[]} Attached transaction bytes
 * @reject {Error}
 * - `INVALID_ATTACHED_BYTES`: Invalid attached bytes
 * - Fetch error
 */

export const storeTransactions = (bytes: string[]): Promise<any> => {
  return helix.storeTransactions(bytes);
};
