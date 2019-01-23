import { composeAPI } from "@helix/core";
import * as config from "./config";

/**
 * API to invoke attachToTangle using composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * Performs the Proof-of-Work required to attach a transaction to the Tangle
 *
 * @param {Provider} provider - Network provider
 *
 * @example sample output
 *
 *
 */

const helix: any = composeAPI({
  provider: config.provider
});

/**
 *
 *
 * @method attachToTangle
 *
 * @param {Hash} trunkTransaction - Trunk transaction as returned by
 *
 * @param {Hash} branchTransaction - Branch transaction as returned by
 *
 * @param {number} minWeightMagnitude - Number of minimun trailing zeros in tail t-ransaction hash
 * @param {TransactionTrytes[]} trytes - List of transaction trytes
 *
 * @return {Promise}
 * @fulfil {TransactionTrytes[]} Array of transaction trytes with nonce and attachment timestamps
 * @reject {Error}
 * - `INVALID_TRUNK_TRANSACTION`: Invalid `trunkTransaction`
 * - `INVALID_BRANCH_TRANSACTION`: Invalid `branchTransaction`
 * - `INVALID_MIN_WEIGHT_MAGNITUDE`: Invalid `minWeightMagnitude` argument
 * - `INVALID_TRANSACTION_TRYTES`: Invalid transaction trytes
 * - `INVALID_TRANSACTIONS_TO_APPROVE`: Invalid transactions to approve
 * - Fetch error
 */

export const attachToTangle = (
  trunkTransaction: string,
  branchTransaction: string,
  trytes: string
): Promise<any> => {
  return helix.attachToTangle(
    trunkTransaction,
    branchTransaction,
    config.minWeightMagnitude,
    trytes
  );
};
