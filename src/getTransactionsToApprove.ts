import { composeAPI } from "@helix/core";
import * as config from "./config";

/**
 * API for getting transactions to approve
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * @param {Provider} provider - Network provider
 *
 * @example output
 *    {"trunkTransaction":"FNRA9PFFNYZKKLQWZDCCVLXFYXWA9NFOLU9KDUYASMZSUTSVOKEDIHNQKHZUOGQRG9KBHCORRBIQZ9999",
 *    "branchTransaction":"FNRA9PFFNYZKKLQWZDCCVLXFYXWA9NFOLU9KDUYASMZSUTSVOKEDIHNQKHZUOGQRG9KBHCORRBIQZ9999"}
 *
 */

const helix: any = composeAPI({
  provider: config.provider
});

/**
 * @method getTransactionsToApprove
 *
 * @memberof module:core
 *
 * @param {number} depth - The depth at which Random Walk starts. A value of `3` is typically used by wallets,
 * meaning that RW starts 3 milestones back.
 * @param {Hash} [reference] - Optional reference transaction hash
 *
 * @return {Promise}
 * @fulfil {trunkTransaction, branchTransaction} A pair of approved transactions
 * @reject {Error}
 * - `INVALID_DEPTH`
 * - `INVALID_REFERENCE_HASH`: Invalid reference hash
 * - Fetch error
 */

export const getTransactionsToApprove = helix.getTransactionsToApprove(
  config.depth
);
