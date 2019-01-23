import { composeAPI } from "@helixnetwork/core";
import * as config from "./config";

/**
 * API for getting a list of connected neighbors using composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * @param {Provider} provider - Network provider
 *
 * @example output
 *
 * {
 *"duration": 37,
 *   "neighbors": [
 *       {
 *           "address": "/8.8.8.8:14265",
 *          "numberOfAllTransactions": 922,
 *           "numberOfInvalidTransactions": 0,
 *           "numberOfNewTransactions": 92
 *       },
 *       {
 *           "address": "/8.8.8.8:5000",
 *           "numberOfAllTransactions": 925,
 *           "numberOfInvalidTransactions": 0,
 *           "numberOfNewTransactions": 20
 *       }
 *   ]
 *}
 *
 */

const helix: any = composeAPI({
  provider: config.provider
});

/**
 *
 * Returns list of connected neighbors.
 *
 * @method getNeighbors
 *
 * @returns {Promise}
 *
 * @fulfil {Neighbors}
 * @reject {Error}
 * - Fetch error
 */

export const getNeighbors = helix.getNeighbors();
