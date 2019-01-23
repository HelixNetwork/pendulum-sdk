import { composeAPI } from "@helix/core";
import * as config from "./config";

/**
 * API for getting the balance of an address using the composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * Fetches _confirmed_ balances of given addresses at the latest solid milestone.
 *
 * @param {Provider} provider - Network provider
 *
 * @example output
 *
 *  {
 *   "balances": [
 *      "114544444"
 *   ],
 *   "duration": 30,
 *   "references": ["INRTUYSZCWBHGFGGXXPWRWBZACYAFGVRRP9VYEQJOHYD9URMELKWAFYFMNTSP9MCHLXRGAFMBOZPZ9999"],
 *   "milestoneIndex": 128
 *  }
 *
 */

const helix: any = composeAPI({
  provider: config.provider
});

/**
 * @method getBalance
 *
 * @param {Array<String>} address -list of addresses
 *
 * @returns {Promise}
 *
 * @fulfil {Balances} Object with list of `balances` and corresponding `milestone`
 * @reject {Error}
 * - `INVALID_HASH`: Invalid address
 * - `INVALID_THRESHOLD`: Invalid `threshold`
 * - Fetch error
 */

export const getBalance = function(address: Array<String>): Promise<any> {
  return helix.getBalances(address, 100);
};
