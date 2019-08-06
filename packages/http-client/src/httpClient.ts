/** @module http-client */

import * as Promise from "bluebird";
import {
  BaseCommand,
  FindTransactionsCommand,
  GetBalancesCommand,
  GetTransactionStringsCommand,
  GetInclusionStatesCommand,
  ProtocolCommand,
  Provider
} from "../../types";
import { batchedSend, send } from "./request";
import { getSettingsWithDefaults, Settings } from "./settings";

const BATCH_SIZE = 1000;

export interface MapsToArrays {
  [key: string]: any[];
}

/* Known batchable commands */
export type BatchableCommand<C> = C &
  MapsToArrays &
  (
    | FindTransactionsCommand
    | GetBalancesCommand
    | GetInclusionStatesCommand
    | GetTransactionStringsCommand);

export interface BatchableKeys {
  readonly [key: string]: string[];
}

export type BatchableKey =
  | "addresses"
  | "approvees"
  | "bundles"
  | "tags"
  | "tips"
  | "transactions"
  | "hashes";

/* Batchable keys for each command */
export const batchableKeys: BatchableKeys = {
  [ProtocolCommand.FIND_TRANSACTIONS]: [
    "addresses",
    "approvees",
    "bundles",
    "tags"
  ],
  [ProtocolCommand.GET_BALANCES]: ["addresses"],
  [ProtocolCommand.GET_INCLUSION_STATES]: ["tips", "transactions"],
  [ProtocolCommand.GET_TRANSACTION_STRINGS]: ["hashes"]
};

export const isBatchableCommand = <C>(
  command: BaseCommand
): command is BatchableCommand<C> =>
  command.command === ProtocolCommand.FIND_TRANSACTIONS ||
  command.command === ProtocolCommand.GET_BALANCES ||
  command.command === ProtocolCommand.GET_INCLUSION_STATES ||
  command.command === ProtocolCommand.GET_TRANSACTION_STRINGS;

export const getKeysToBatch = <C>(
  command: BatchableCommand<C>,
  batchSize: number = BATCH_SIZE
): ReadonlyArray<string> =>
  Object.keys(command).filter(
    key =>
      batchableKeys[command.command].indexOf(key) > -1 &&
      Array.isArray(command[key]) &&
      command[key].length > batchSize
  );

/**
 * Create an http client to access helix http API.
 *
 * @method createHttpClient
 *
 * @param {object} [settings={}]
 * @param {string} [settings.provider=http://localhost:14265] Uri of helix node
 * @param {string | number} [settings.apiVersion=1] - Helix Api version to be sent as `X-HELIX-API-Version` header.
 * @param {number} [settings.requestBatchSize=1000] - Number of search values per request.
 * @return Object
 */
export const createHttpClient = (settings?: Partial<Settings>): Provider => {
  let _settings = getSettingsWithDefaults({ ...settings });
  return {
    /**
     * @member send
     *
     * @param {object} command
     *
     * @return {object} response
     */
    send: <C extends BaseCommand, R>(
      command: Readonly<C>
    ): Promise<Readonly<R>> =>
      Promise.try(() => {
        const { provider, requestBatchSize, apiVersion, timeout } = _settings;

        if (isBatchableCommand(command)) {
          const keysToBatch = getKeysToBatch(command, requestBatchSize);

          if (keysToBatch.length) {
            return batchedSend<C, R>(
              command,
              keysToBatch,
              requestBatchSize,
              provider,
              apiVersion
            );
          }
        }

        return send<C, R>(command, provider, apiVersion, timeout);
      }),

    /**
     * @member setSettings
     *
     * @param {object} [settings={}]
     * @param {string} [settings.provider=http://localhost:14265] Uri of helix node
     * @param {string | number} [settings.apiVersion=1] - Helix Api version to be sent as `X-HELIX-API-Version` header.
     * @param {number} [settings.requestBatchSize=1000] - Number of search values per request.
     * @param {timeout} [settings.timeout] - Timeout.
     */
    setSettings: (newSettings?: Partial<Settings>): void => {
      _settings = getSettingsWithDefaults({ ..._settings, ...newSettings });
    }
  };
};
