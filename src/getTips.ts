import { composeAPI } from "@helix/core";
import * as config from "./config";
/**
 * API to get the list of tips using composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * @param {Provider} provider - Network provider
 *
 * @example sample output
 *
 * ["YVXJOEOP9JEPRQUVBPJMB9MGIB9OMTIJJLIUYPM9YBIWXPZ9PQCCGXYSLKQWKHBRVA9AKKKXXMXF99999"]
 *
 */

const helix: any = composeAPI({
  provider: config.provider
});
/** @method getTips
 *
 * @return {Promise}
 * @fulfil {Hash[]} List of tip hashes
 * @reject {Error}
 * - Fetch error
 */
export const getTips = helix.getTips();
