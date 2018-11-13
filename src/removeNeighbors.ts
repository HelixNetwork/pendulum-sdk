import { composeAPI } from "@helix/core";
import * as config from "./config";

/**
 * API Call for removing neighbors using the composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * It takes the uris of neighbors as argument and returns a promise
 * containing the no of neignbors successfully removed if it went well
 * or error message according to the error caused.
 *
 * @param {Provider} provider - Network provider
 */

const helix: any = composeAPI({
  provider: config.provider
});

/**
 *
 * @method removedNeighbors
 *
 * @param {Array<String>} uris - List of uris of neighbors to be removed
 *
 * @returns {Promice}
 *
 * @fulfil {number} Number of neighbors that were removed
 * @reject {Error}
 * - `INVALID_URI`: Invalid uri
 * - Fetch error
 */

export const removedNeighbors = (uris: string[]): Promise<any> => {
  return helix.removeNeighbors(uris);
};
