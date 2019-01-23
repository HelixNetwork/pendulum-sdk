import { composeAPI } from "@helix/core";
import * as config from "./config";
/**
 * API  to return the raw transaction data (trytes) of a specific transaction using composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * @param {Provider} provider - Network provider
 *
 *
 */
const helix: any = composeAPI({
  provider: config.provider
});

/**
 *
 * @method getBytes
 *
 * @param {Array<String>} transaction -list of transactions
 *
 * @return {Promise}
 * @fulfil {Trytes[]} - Transaction trytes
 * @reject Error{}
 * - `INVALID_TRANSACTION_HASH`: Invalid hash
 * - Fetch error
 */
export const getBytes = (transaction: string[]): Promise<any> => {
  return helix.getBytes(transaction);
};
