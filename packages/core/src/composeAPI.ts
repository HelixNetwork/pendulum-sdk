import {
  createHttpClient,
  HttpClientSettings
} from "@helixnetwork/http-client";
import * as Bluebird from "bluebird";
import {
  AttachToTangle,
  BaseCommand,
  Inputs,
  Neighbor,
  Provider,
  Transaction,
  Transfer
} from "../../types";
import {
  AccountData,
  Balances,
  CheckConsistencyOptions,
  createAddNeighbors,
  createAttachToTangle,
  createBroadcastBundle,
  createBroadcastTransactions,
  createCheckConsistency,
  createFindTransactionObjects,
  createFindTransactions,
  createGetAccountData,
  createGetBalances,
  createGetBundle,
  createGetInclusionStates,
  createGetInputs,
  createGetLatestInclusion,
  createGetNeighbors,
  createGetNewAddress,
  createGetNodeInfo,
  createGetTips,
  createGetTransactionObjects,
  createGetTransactionsToApprove,
  createGetTransactionStrings,
  createInterruptAttachingToTangle,
  createIsPromotable,
  createIsReattachable,
  createPrepareTransfers,
  createPromoteTransaction,
  createRemoveNeighbors,
  createReplayBundle,
  // createSendTransfer,
  createSendTransactionStrings,
  createStoreAndBroadcast,
  createStoreTransactions,
  // Types
  createTraverseBundle,
  createWereAddressesSpentFrom,
  FindTransactionsQuery,
  GetAccountDataOptions,
  GetInputsOptions,
  GetNewAddressOptions,
  GetNodeInfoResponse,
  PrepareTransfersOptions,
  PromoteTransactionOptions,
  TransactionsToApprove
} from "./";
import { createGetBundlesFromAddresses } from "./createGetBundlesFromAddresses";
import { createGetTransfers, GetTransfersOptions } from "./createGetTransfers";
// import { createWereAddressesSpentFrom } from "./createWereAddressesSpentFrom";

export interface Settings extends HttpClientSettings {
  readonly network?: Provider;
  readonly attachToTangle?: AttachToTangle;
}

export type Func<T> = (...args: any[]) => T;

export function returnType<T>(func: Func<T>) {
  return {} as T; // tslint:disable-line no-object-literal-type-assertion
}

/**
 * Composes API object from it's components
 *
 * @method composeApi
 *
 * @memberof module:core
 *
 * @param {object} [settings={}] - Connection settings
 * @param {Provider} [settings.network] - Network provider, defaults to `http-client`.
 * @param {string} [settings.provider=http://localhost:14265] Uri of the node
 * @param {function} [settings.attachToTangle] - Function to override
 * [`attachToTangle`]{@link #module_core.attachToTangle} with
 * @param {string | number} [settings.apiVersion=1] - helix.api version to be sent as `X-HELIX-API-Version` header.
 * @param {number} [settings.requestBatchSize=1000] - Number of search values per request.
 *
 * @return {API}
 */
export const composeAPI = (settings: Partial<Settings> = {}) => {
  let provider: Provider = createHttpClient(settings);
  let attachToTangle: AttachToTangle =
    settings.attachToTangle || createAttachToTangle(provider);

  /**
   * Defines network provider configuration and [`attachToTangle`]{@link #module_core.attachToTangle} method.
   *
   * @method setSettings
   *
   * @memberof API
   *
   * @param {object} settings - Provider settings object
   * @param {string} [settings.provider] - Http `uri` of the node
   * @param {Provider} [settings.network] - Network provider to override with
   * @param {function} [settings.attachToTangle] - AttachToTangle function to override with
   * [`attachToTangle`]{@link #module_core.attachToTangle} with
   */
  function setSettings(newSettings: Partial<Settings> = {}) {
    if (newSettings.attachToTangle) {
      attachToTangle = newSettings.attachToTangle;
    }

    if (newSettings.network) {
      provider = newSettings.network;
    }

    provider.setSettings(newSettings);
  }

  function overrideNetwork(network: Provider) {
    provider = network;
  }

  /**
   * Overides default [`attachToTangle`]{@link #module_core.attachToTangle} with a local equivalent or
   * [`PoW-Integrator`]()
   *
   * @method overrideAttachToTangle
   *
   * @memberof API
   *
   * @param {function} attachToTangle - Function to override
   * [`attachToTangle`]{@link #module_core.attachToTangle} with
   */
  function overrideAttachToTangle(attachFn: AttachToTangle) {
    attachToTangle = attachFn;
  }

  /** @namespace API */
  return {
    // helix commands
    addNeighbors: createAddNeighbors(provider),
    attachToTangle,
    broadcastTransactions: createBroadcastTransactions(provider),
    checkConsistency: createCheckConsistency(provider),
    findTransactions: createFindTransactions(provider),
    getBalances: createGetBalances(provider),
    getInclusionStates: createGetInclusionStates(provider),
    getNeighbors: createGetNeighbors(provider),
    getNodeInfo: createGetNodeInfo(provider),
    getTips: createGetTips(provider),
    getTransactionsToApprove: createGetTransactionsToApprove(provider),
    getTransactionStrings: createGetTransactionStrings(provider),
    interruptAttachingToTangle: createInterruptAttachingToTangle(provider),
    removeNeighbors: createRemoveNeighbors(provider),
    storeTransactions: createStoreTransactions(provider),
    wereAddressesSpentFrom: createWereAddressesSpentFrom(provider),
    sendCommand: provider.send,

    // Wrapper methods
    broadcastBundle: createBroadcastBundle(provider),
    getAccountData: createGetAccountData(provider),
    getBundle: createGetBundle(provider),
    getBundlesFromAddresses: createGetBundlesFromAddresses(provider),
    getLatestInclusion: createGetLatestInclusion(provider),
    getNewAddress: createGetNewAddress(provider),
    getTransactionObjects: createGetTransactionObjects(provider),
    findTransactionObjects: createFindTransactionObjects(provider),
    getInputs: createGetInputs(provider),
    getTransfers: createGetTransfers(provider), // Deprecated
    isPromotable: createIsPromotable(provider),
    isReattachable: createIsReattachable(provider), // Deprecated
    prepareTransfers: createPrepareTransfers(provider),
    promoteTransaction: createPromoteTransaction(provider, attachToTangle),
    replayBundle: createReplayBundle(provider, attachToTangle),
    // sendTransfer: createSendTransfer(provider, attachToTangle),
    sendTransactionStrings: createSendTransactionStrings(
      provider,
      attachToTangle
    ),
    storeAndBroadcast: createStoreAndBroadcast(provider),
    traverseBundle: createTraverseBundle(provider),
    setSettings,
    overrideAttachToTangle,
    overrideNetwork
  };
};

export const apiType = returnType(composeAPI);

export type API = typeof apiType;
