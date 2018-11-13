import { composeAPI } from "@helix/core";
import * as config from "./config";

/**
 * API to invoke transactions using composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * @param {Provider} provider - Network provider
 *
 */

const helix: any = composeAPI({
  provider: config.provider
});

// must be truly random & 81-trytes long
const seed = config.seed;

// Depth or how far to go for tip selection entry point
const depth = config.depth;

// Difficulty of Proof-of-Work required to attach transaction to tangle.
const mwm = config.minWeightMagnitude;

/**
 *
 * @method createTransaction
 *
 * @param {String} seed -Your seed value
 * @param {number} value
 * @param {message} message- optional message
 * @param {String} tag - optional tag
 *
 * @returns {Promise}
 *
 * @fulfill {Object} transaction details
 * @reject {Error}  Details about the error which is thrown
 *
 */

export const createTransaction = (
  address: string,
  value: number,
  message: string,
  tag: string
): Promise<any> => {
  const transfer = [
    {
      address,
      value: 0,
      message,
      tag
    }
  ];

  return helix
    .prepareTransfers(seed, transfer)
    .then((trytes: any) => helix.sendTrytes(trytes, depth, mwm));
};
