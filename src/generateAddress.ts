import { composeAPI } from "@helix/core";

import * as config from "./config";
/**
 * API for generating new address using the composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * Generates and returns a new address by calling
 * until the first unused address is detected. This stops working after a snapshot.
 *
 * @param {Provider} provider - Network provider
 *
 */

const helix: any = composeAPI({
  provider: config.provider
});

/**
 *
 * @method generateAddress
 *
 * @param {String} seed
 * @fulfil {Hash|Hash[]} New (unused) address or list of addresses up to (and including) first unused address
 * @reject {Error}
 * - `INVALID_SEED`
 * - `INVALID_START_OPTION`
 * - `INVALID_SECURITY`
 * - Fetch error
 *
 */

export const generateAddress = function(seed: String): Promise<any> {
  return helix.getNewAddress(seed);
};
