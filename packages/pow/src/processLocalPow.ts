import { hex, toTxBytes, txBits, txBitsToTxHex } from "@helixnetwork/converter";
import {
  transactionHash,
  transactionHashValidator,
  transactionTxHexValidator
} from "@helixnetwork/transaction";
import * as bPromise from "bluebird";
import {
  START_BRANCH_TRANS_BYTE,
  START_INDEX_ATTACHED_TIMESTAMP_BYTE,
  START_INDEX_CURRENT_INDEX_HEX,
  START_INDEX_LAST_INDEX_HEX,
  START_INDEX_TIMESTAMP_LOW_BYTE,
  START_INDEX_TIMESTAMP_UP_BYTE,
  START_TRUNK_TRANS_BYTE,
  TRANSACTION_CURRENT_INDEX_HEX_SIZE,
  TRANSACTION_LAST_INDEX_HEX_SIZE
} from "../../constants";
import {
  INVALID_BRANCH_TRANSACTION,
  INVALID_BUNDLE_INDEX,
  INVALID_PARAM,
  INVALID_TRUNK_TRANSACTION
} from "../../errors";
import { arrayValidator, integerValidator, validate } from "../../guards";
import { Callback, Hash, TransactionTxHex } from "../../types";
import { powTx } from "./proofOfWork";

/**
 * @method processLocalPow
 *
 * @memberof module:pow
 *
 * Performs the local proof of work based on the passed mwm on
 * the given txs and returns the new list with updated trunkTransaction,
 * branchTransaction , attachment Timestaps and nonce field.
 * @param {Hash} trunkTransaction - Trunk transaction as returned by
 * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove}
 * @param {Hash} branchTransaction - Branch transaction as returned by
 * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove}
 * @param {number} minWeightMagnitude - Number of minimun trailing zeros in tail transaction hash
 * @param {TransactionTxHex[]} txs - List of transaction txs
 * @param {Promise.resolve} - Used to return the updated bundle upon success
 * @param {Promise.reject} - Used to return errors upon failure
 * @param {Callback} [callback] - Optional callback
 *
 * @return {Promise}
 * @fulfil {TransactionTxHex[]} Array of transaction txs with nonce and attachment timestamps
 * @reject {Error}
 * - `INVALID_BUNDLE_INDEX`: Invalid `bundle index`
 * - `INVALID_TRUNK_TRANSACTION`: Invalid `trunkTransaction`
 * - `INVALID_BRANCH_TRANSACTION`: Invalid `branchTransaction`
 * - `INVALID_MIN_WEIGHT_MAGNITUDE`: Invalid `minWeightMagnitude` argument
 * - `INVALID_TRANSACTION_TX_HEX`: Invalid transaction txs
 * - `INVALID_TRANSACTIONS_TO_APPROVE`: Invalid transactions to approve
 * - Fetch error
 */

export const processLocalPow = async (
  trunkTransaction: Hash,
  branchTransaction: Hash,
  minWeightMagnitude: number,
  txs: ReadonlyArray<TransactionTxHex>
) => {
  if (
    !validate(
      integerValidator(minWeightMagnitude),
      arrayValidator<TransactionTxHex>(transactionTxHexValidator)(txs),
      transactionHashValidator(trunkTransaction, INVALID_TRUNK_TRANSACTION),
      transactionHashValidator(branchTransaction, INVALID_BRANCH_TRANSACTION)
    )
  ) {
    return bPromise.reject(INVALID_PARAM);
  }

  let previousTransactionHash;

  const updateBundle: TransactionTxHex[] = new Array(txs.length);
  for (let index = 0; index < txs.length; index++) {
    const tx = txs[index];
    let txBytes = toTxBytes(tx);

    // Check if last transaction in the bundle
    if (
      !previousTransactionHash &&
      tx.substring(
        START_INDEX_CURRENT_INDEX_HEX,
        START_INDEX_CURRENT_INDEX_HEX + TRANSACTION_CURRENT_INDEX_HEX_SIZE
      ) !==
        tx.substring(
          START_INDEX_LAST_INDEX_HEX,
          START_INDEX_LAST_INDEX_HEX + TRANSACTION_LAST_INDEX_HEX_SIZE
        )
    ) {
      return bPromise.reject(new Error(INVALID_BUNDLE_INDEX));
    }

    txBytes.set(
      toTxBytes(
        !previousTransactionHash ? trunkTransaction : previousTransactionHash
      ),
      START_TRUNK_TRANS_BYTE
    );
    txBytes.set(
      toTxBytes(
        !previousTransactionHash ? branchTransaction : trunkTransaction
      ),
      START_BRANCH_TRANS_BYTE
    );

    txBytes.set(
      toTxBytes(txBitsToTxHex(txBits(Date.now()))),
      START_INDEX_ATTACHED_TIMESTAMP_BYTE
    );
    txBytes.set(
      toTxBytes(txBitsToTxHex(txBits(0))),
      START_INDEX_TIMESTAMP_LOW_BYTE
    );
    txBytes.set(
      toTxBytes(txBitsToTxHex(txBits((Math.pow(2, 8) - 1) / 2))),
      START_INDEX_TIMESTAMP_UP_BYTE
    );

    txBytes = toTxBytes(await powTx(txBytes, minWeightMagnitude));
    // txBytes.set(toTxBytes(nonce), START_INDEX_NONCE_HEX / 2);
    previousTransactionHash = transactionHash(txBytes);
    updateBundle[index] = hex(txBytes);
  }
  return bPromise.resolve(updateBundle);
};
