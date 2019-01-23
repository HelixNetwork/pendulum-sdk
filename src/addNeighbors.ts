import { composeAPI } from "@helix/core";

import * as config from "./config";
/**
 * API for adding neighbors using the composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * It takes the uris of neighbors as argument and returns a promise
 * containing the no of neignbors successfully added if it went well
 * or error message according to the error caused.
 *
 * @param {Provider} provider - Network provider
 *
 * @example sample output
 *
 * {
 * "addedNeighbors": 0,
 * "duration": 2
 * }
 */

const helix: any = composeAPI({
  provider: config.provider
});

/**
 *
 * @method addNeighbors
 *
 * @param {Array<String>} uris - List of uris of neighbors to be added
 *
 * @returns {Promice}
 *
 * @fulfil {number} Number of neighbors that were added
 * @reject {Error}
 * - `INVALID_URI`: Invalid uri
 * - Fetch error
 */
export const addNeighbors = (uris: string[]): Promise<any> => {
  return helix.addNeighbors(uris);
};
