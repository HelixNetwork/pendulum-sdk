import { hex, toTxBytes, txBits, txHex } from "@helixnetwork/converter";
import { powTx } from "@helixnetwork/pow";
import {
  transactionHash,
  transactionHashValidator,
  transactionTxHexValidator
} from "@helixnetwork/transaction";
import * as bPromise from "bluebird";
import {
  START_BRANCH_TRANS_BYTE,
  START_INDEX_ATTACHED_TIMESTAMP_BYTE,
  START_INDEX_CURRENT_INDEX_BYTE,
  START_INDEX_CURRENT_INDEX_HEX,
  START_INDEX_LAST_INDEX_BYTE,
  START_INDEX_LAST_INDEX_HEX,
  START_INDEX_TIMESTAMP_LOW_BYTE,
  START_INDEX_TIMESTAMP_UP_BYTE,
  START_TRUNK_TRANS_BYTE,
  TRANSACTION_CURRENT_INDEX_BYTE_SIZE,
  TRANSACTION_CURRENT_INDEX_HEX_SIZE,
  TRANSACTION_LAST_INDEX_BYTE_SIZE,
  TRANSACTION_LAST_INDEX_HEX_SIZE
} from "../../constants";
import {
  INVALID_BRANCH_TRANSACTION,
  INVALID_BUNDLE_INDEX,
  INVALID_TRUNK_TRANSACTION
} from "../../errors";
import { arrayValidator, integerValidator, validate } from "../../guards";
import {
  AttachToTangle,
  Callback,
  Hash,
  Provider,
  TransactionTxHex
} from "../../types";

/**
 * @method createLocalAttachToTangle
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {Function} {@link #module_core.localAttachToTangle `localAttachToTangle`}
 */

export const createLocalAttachToTangle = ({
  send
}: Provider): AttachToTangle => {
  return function attachToTangle(
    trunkTransaction: Hash,
    branchTransaction: Hash,
    minWeightMagnitude: number,
    txs: ReadonlyArray<TransactionTxHex>,
    callback?: Callback<ReadonlyArray<TransactionTxHex>>
  ): bPromise<ReadonlyArray<TransactionTxHex>> {
    /**
     * Performs locally the Proof-of-Work required to attach a transaction to the Tangle by
     * calling [`attachToTangle`](https://docs.helix.works/hlx/api#endpoints/attachToTangle) command.
     * Returns list of transaction txs and overwrites the following fields:
     *  - `hash`
     *  - `nonce`
     *  - `attachmentTimestamp`
     *  - `attachmentTimsetampLowerBound`
     *  - `attachmentTimestampUpperBound`
     *
     * This method perform a local pow, should be used as explained bellow
     *
     * `trunkTransaction` and `branchTransaction` hashes are given by
     * {@link #module_core.getTransactionsToApprove `getTransactionToApprove`}.
     *
     * @example
     *
     * ```js
     *
     * const helix = composeAPI({
     *   provider: "https://test.net:8087",
     *   attachToTangle: createLocalAttachToTangle(client)
     * });
     * ```
     *
     * @method attachToTangle
     *
     * @memberof module:core
     *
     * @param {Hash} trunkTransaction - Trunk transaction as returned by
     * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove}
     * @param {Hash} branchTransaction - Branch transaction as returned by
     * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove}
     * @param {number} minWeightMagnitude - Number of minimun trailing zeros in tail transaction hash
     * @param {TransactionTxHex[]} txs - List of transaction txs
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

    return new bPromise<ReadonlyArray<TransactionTxHex>>((resolve, reject) => {
      if (
        !validate(
          integerValidator(minWeightMagnitude),
          arrayValidator<TransactionTxHex>(transactionTxHexValidator)(txs),
          transactionHashValidator(trunkTransaction, INVALID_TRUNK_TRANSACTION),
          transactionHashValidator(
            branchTransaction,
            INVALID_BRANCH_TRANSACTION
          )
        )
      ) {
        reject();
        return;
      }

      processLocalPow(
        trunkTransaction,
        branchTransaction,
        minWeightMagnitude,
        txs,
        resolve,
        reject,
        callback
      );
    });
  };
};

async function processLocalPow(
  trunkTransaction: Hash,
  branchTransaction: Hash,
  minWeightMagnitude: number,
  txs: ReadonlyArray<TransactionTxHex>,
  result: any,
  reject: any,
  callback?: Callback<ReadonlyArray<TransactionTxHex>>
) {
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
      reject(new Error(INVALID_BUNDLE_INDEX));
      return;
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
      toTxBytes(txHex(txBits(Date.now()))),
      START_INDEX_ATTACHED_TIMESTAMP_BYTE
    );
    txBytes.set(toTxBytes(txHex(txBits(0))), START_INDEX_TIMESTAMP_LOW_BYTE);
    txBytes.set(
      toTxBytes(txHex(txBits((Math.pow(2, 8) - 1) / 2))),
      START_INDEX_TIMESTAMP_UP_BYTE
    );

    txBytes = toTxBytes(await powTx(txBytes, minWeightMagnitude));
    // txBytes.set(toTxBytes(nonce), START_INDEX_NONCE_HEX / 2);
    previousTransactionHash = transactionHash(txBytes);
    updateBundle[index] = hex(txBytes);
  }
  result(updateBundle);
}
