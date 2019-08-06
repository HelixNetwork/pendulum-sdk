import { hex, toTxBytes, txBits, txHex } from "@helixnetwork/converter";
import { powTx } from "@helixnetwork/pow";
import {
  START_BRANCH_TRANS_HEX,
  START_INDEX_ATTACHED_TIMESTAMP_HEX,
  START_INDEX_CURRENT_INDEX_HEX,
  START_INDEX_LAST_INDEX_HEX,
  START_INDEX_NONCE_HEX,
  START_INDEX_TIMESTAMP_LOW_HEX,
  START_INDEX_TIMESTAMP_UP_HEX,
  START_TRUNK_TRANS_HEX,
  transactionHash
} from "@helixnetwork/transaction";
import { transactionObject } from "@helixnetwork/transaction-converter";
import * as bPromise from "bluebird";
import {
  TRANSACTION_CURRENT_INDEX_HEX_SIZE,
  TRANSACTION_LAST_INDEX_HEX_SIZE
} from "../../constants";
import {
  AttachToTangle,
  Callback,
  Hash,
  Provider,
  TransactionTxHex,
  TxBytes
} from "../../types";

/**
 * @method createAttachToTangle
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {Function} {@link #module_core.attachToTangle `attachToTangle`}
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
     * This method can be replaced with a local equivelant such as
     * < in development >
     * or remote [`PoW-Integrator`]().
     *
     * `trunkTransaction` and `branchTransaction` hashes are given by
     * {@link #module_core.getTransactionsToApprove `getTransactionToApprove`}.
     *
     * @example
     *
     * ```js
     * getTransactionsToApprove(depth)
     *   .then(({ trunkTransaction, branchTransaction }) =>
     *     attachToTangle(trunkTransaction, branchTransaction, minWightMagnitude, txs)
     *   )
     *   .then(attachedTxHex => {
     *     // ...
     *   })
     *   .catch(err => {
     *     // ...
     *   })
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
     * - `INVALID_TRUNK_TRANSACTION`: Invalid `trunkTransaction`
     * - `INVALID_BRANCH_TRANSACTION`: Invalid `branchTransaction`
     * - `INVALID_MIN_WEIGHT_MAGNITUDE`: Invalid `minWeightMagnitude` argument
     * - `INVALID_TRANSACTION_TX_HEX`: Invalid transaction txs
     * - `INVALID_TRANSACTIONS_TO_APPROVE`: Invalid transactions to approve
     * - Fetch error
     */

    return new bPromise<ReadonlyArray<TransactionTxHex>>((resolve, reject) => {
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

    // const txObject = transactionObject(tx);
    // // Check if last transaction in the bundle
    if (
      !previousTransactionHash &&
      tx.substring(
        START_INDEX_CURRENT_INDEX_HEX / 2,
        START_INDEX_CURRENT_INDEX_HEX / 2 +
          TRANSACTION_CURRENT_INDEX_HEX_SIZE / 2
      ) !==
        tx.substring(
          START_INDEX_LAST_INDEX_HEX / 2,
          START_INDEX_LAST_INDEX_HEX / 2 + TRANSACTION_LAST_INDEX_HEX_SIZE / 2
        )
    ) {
      reject(
        new Error(
          "Wrong bundle order. The bundle should be ordered in descending order from currentIndex"
        )
      );
      return;
    }

    txBytes.set(
      toTxBytes(
        !previousTransactionHash ? trunkTransaction : previousTransactionHash
      ),
      START_TRUNK_TRANS_HEX / 2
    );
    txBytes.set(
      toTxBytes(
        !previousTransactionHash ? branchTransaction : trunkTransaction
      ),
      START_BRANCH_TRANS_HEX / 2
    );

    txBytes.set(
      toTxBytes(txHex(txBits(Date.now()))),
      START_INDEX_ATTACHED_TIMESTAMP_HEX / 2
    );
    txBytes.set(toTxBytes(txHex(txBits(0))), START_INDEX_TIMESTAMP_LOW_HEX / 2);
    txBytes.set(
      toTxBytes(txHex(txBits((Math.pow(2, 8) - 1) / 2))),
      START_INDEX_TIMESTAMP_UP_HEX / 2
    );

    txBytes = toTxBytes(await powTx(txBytes, minWeightMagnitude));
    // txBytes.set(toTxBytes(nonce), START_INDEX_NONCE_HEX / 2);
    previousTransactionHash = transactionHash(txBytes);
    updateBundle[index] = hex(txBytes);
  }
  result(updateBundle);
}
