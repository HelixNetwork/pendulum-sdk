import * as Promise from "bluebird";
import {
  arrayValidator,
  depthValidator,
  minWeightMagnitudeValidator,
  seedValidator,
  transferValidator,
  validate
} from "../../guards";
import {
  AttachToTangle,
  Bundle,
  Callback,
  Hash,
  Provider,
  Transaction,
  Transfer
} from "../../types";
import { createPrepareTransfers, createSendTransactionStrings } from "./";
import {
  getPrepareTransfersOptions,
  PrepareTransfersOptions
} from "./createPrepareTransfers";

export interface SendTransferOptions extends PrepareTransfersOptions {
  readonly reference?: Hash;
}

export const createSendTransfer = (
  provider: Provider,
  attachFn?: AttachToTangle
) => {
  const prepareTransfers = createPrepareTransfers(provider);
  const sendTxHex = createSendTransactionStrings(provider, attachFn);

  return function sendTransfer(
    seed: string,
    depth: number,
    minWeightMagnitude: number,
    transfers: ReadonlyArray<Transfer>,
    options?: SendTransferOptions,
    callback?: Callback<Bundle>
  ): Promise<Bundle> {
    // If no options provided, switch arguments
    if (options && typeof options === "function") {
      callback = options;
      options = getPrepareTransfersOptions({});
    }

    return Promise.resolve(
      validate(
        depthValidator(depth),
        seedValidator(seed),
        minWeightMagnitudeValidator(minWeightMagnitude),
        arrayValidator(transferValidator)(transfers)
      )
    )
      .then(() => prepareTransfers(seed, transfers, options))
      .then(txs =>
        sendTxHex(
          txs,
          depth,
          minWeightMagnitude,
          options ? options.reference : undefined
        )
      )
      .asCallback(callback);
  };
};
