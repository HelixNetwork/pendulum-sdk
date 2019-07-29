import * as Bluebird from "bluebird";
import {
  NULL_ADDRESS_TX_HEX,
  NULL_SIGNATURE_MESSAGE_FRAGMENT_TX_HEX,
  NULL_TAG_TX_HEX
} from "../../constants";
import * as errors from "../../errors";
import {
  arrayValidator,
  hashValidator,
  transferValidator,
  validate
} from "../../guards";
import {
  AttachToTangle,
  Callback,
  Maybe,
  Provider,
  Transaction,
  Transfer
} from "../../types";
import { createCheckConsistency } from "./";
import { getPrepareTransfersOptions } from "./createPrepareTransfers";
import { createSendTransfer } from "./createSendTransfer";

export interface PromoteTransactionOptions {
  readonly delay: number;
  interrupt: boolean | (() => boolean);
}

const defaults: PromoteTransactionOptions = {
  delay: 0,
  interrupt: false
};

export const spam = {
  address: NULL_ADDRESS_TX_HEX,
  value: 0,
  tag: NULL_TAG_TX_HEX,
  message: NULL_SIGNATURE_MESSAGE_FRAGMENT_TX_HEX
};

export const generateSpam = (n: number = 1): ReadonlyArray<Transfer> =>
  new Array(n).fill(spam);

/**
 * @method createPromoteTransaction
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @param {Function} [attachFn] - Optional `AttachToTangle` function to override the
 * [default method]{@link #module_core.attachToTangle}.
 *
 * @return {Function} {@link #module_core.promoteTransaction `promoteTransaction`}
 */
export const createPromoteTransaction = (
  provider: Provider,
  attachFn?: AttachToTangle
) => {
  const checkConsistency = createCheckConsistency(provider);
  const sendTransfer = createSendTransfer(provider, attachFn);

  /**
   * Promotes a transaction by adding zero-value spam transactions on top of it.
   * Will promote `maximum` transfers on top of the current one with `delay` interval. Promotion
   * is interruptable through `interrupt` option.
   *
   * @method promoteTransaction
   *
   * @memberof module:core
   *
   * @param {string} tail
   * @param {int} depth
   * @param {int} minWeightMagnitude
   * @param {array} [spamTransfers] - Array of spam transfers to promote with.
   * By default it will issue an all-0s, zero-value transfer.
   * @param {object} [options]
   * @param {number} [options.delay] - Delay between spam transactions in `ms`
   * @param {boolean|function} [options.interrupt] - Interrupt signal, which can be a function that evaluates
   * to boolean
   * @param {function} [callback]
   *
   * @returns {Promise}
   * @fulfil {Transaction[]}
   * @reject {Error}
   * - `INCONSISTENT SUBTANGLE`: In this case promotion has no effect and reatchment is required.
   * - Fetch error
   */
  return function promoteTransaction(
    tailTransaction: string,
    depth: number,
    minWeightMagnitude: number,
    spamTransfers: ReadonlyArray<Transfer> = generateSpam(),
    options?: Partial<PromoteTransactionOptions>,
    callback?: Callback<ReadonlyArray<ReadonlyArray<Transaction>>>
  ): Bluebird<Maybe<ReadonlyArray<ReadonlyArray<Transaction>>>> {
    // Switch arguments
    if (!options) {
      options = { ...defaults };
    } else if (typeof options === "function") {
      callback = options;
      options = { ...defaults };
    }

    const spamTransactions: Array<ReadonlyArray<Transaction>> = [];
    const sendTransferOptions = {
      ...getPrepareTransfersOptions({}),
      reference: tailTransaction
    };

    const timeout = options.delay;
    const delay = () => new Promise(resolve => setTimeout(resolve, timeout));

    const promote = (): Promise<ReadonlyArray<ReadonlyArray<Transaction>>> =>
      delay()
        .then(() =>
          checkConsistency(tailTransaction, { rejectWithReason: true })
        )
        .then(consistent => {
          if (!consistent) {
            throw new Error(errors.INCONSISTENT_SUBTANGLE);
          }

          return sendTransfer(
            spamTransfers[0].address,
            depth,
            minWeightMagnitude,
            spamTransfers,
            sendTransferOptions
          );
        })
        .then(async transactions => {
          spamTransactions.push([...transactions]);

          if (options && timeout) {
            if (
              options.interrupt === true ||
              (typeof options.interrupt === "function" &&
                (await options.interrupt()))
            ) {
              return [...spamTransactions];
            }

            return promote();
          } else {
            return [...spamTransactions];
          }
        });

    return Bluebird.resolve(
      validate(
        hashValidator(tailTransaction),
        [
          delay,
          n => typeof n === "function" || (typeof n === "number" && n >= 0),
          errors.INVALID_DELAY
        ],
        !!spamTransfers && arrayValidator(transferValidator)(spamTransfers)
      )
    )
      .then(promote)
      .asCallback(callback);
  };
};
