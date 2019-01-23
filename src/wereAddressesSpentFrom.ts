import { composeAPI } from "@helix/core";
import * as config from "./config";

/**
 * API for wereAddressesSpentFrom using the composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * @param {Provider} provider - Network provider
 *
 * @example output
 *
 */

const helix: any = composeAPI({
  provider: config.provider
});

export const wereAddressesSpentFrom = function(
  address: Array<String>
): Promise<any> {
  return helix.wereAddressesSpentFrom(address);
};
