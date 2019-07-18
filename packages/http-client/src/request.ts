/* tslint:disable no-console */
import "isomorphic-fetch";

import * as errors from "../../errors";

import {
  BaseCommand,
  FindTransactionsResponse,
  ProtocolCommand
} from "../../types";
import { BatchableCommand } from "./httpClient";
import { API_VERSION, DEFAULT_URI, MAX_REQUEST_BATCH_SIZE } from "./settings";

const requestError = (statusText: string) => `Request error: ${statusText}`;

/**
 * Sends an http request to a specified host.
 *
 * @method send
 *
 * @memberof module:http-client
 *
 * @param {Command} command
 *
 * @param {String} [uri=http://localhost:14265]
 *
 * @param {String|Number} [apiVersion=1]
 *
 * @return Promise
 * @fulil {Object} - Response
 * @reject {Error} - Request error
 */
export const send = <C extends BaseCommand, R = any>(
  command: C,
  url: string = DEFAULT_URI,
  apiVersion: string | number = API_VERSION,
  timeout?: number
): Promise<R> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-HELIX-API-Version": apiVersion.toString()
  };

  // set timeout if provided
  let abortSignal;
  let abortTimout: NodeJS.Timer;
  if (timeout) {
    const controller = new AbortController();
    abortSignal = controller.signal;

    abortTimout = setTimeout(() => {
      controller.abort();
    }, timeout);
  }

  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(command),
    signal: abortSignal
  }).then(res =>
    res
      .json()
      .then(json => {
        if (abortTimout) {
          clearTimeout(abortTimout);
        }
        return res.ok
          ? json
          : Promise.reject(
              requestError(
                json.error || json.exception
                  ? json.error || json.exception
                  : res.statusText
              )
            );
      })
      .catch(error => {
        if (!res.ok && error.type === "invalid-json") {
          throw requestError(res.statusText);
        } else {
          throw error;
        }
      })
  );
};
/**
 * Sends a batched http request to a specified host
 * supports findTransactions, getBalances & getHBytes commands
 *
 * @method batchedSend
 *
 * @param {Command} command
 *
 * @param {String[]} keysToBatch
 *
 * @param {Number} [requestBatchSize=1000]
 *
 * @param {String} [uri='http://localhost:14265']
 *
 * @param {String|Number} [apiVersion=1]
 *
 * @ignore
 *
 * @return Promise
 * @fulil {Object} - Response
 * @reject {Error} - Request error
 */
export const batchedSend = <C extends BaseCommand, R = any>(
  command: BatchableCommand<C>,
  keysToBatch: ReadonlyArray<string>,
  requestBatchSize = MAX_REQUEST_BATCH_SIZE,
  uri: string = DEFAULT_URI,
  apiVersion: string | number = API_VERSION
): Promise<any> =>
  Promise.all(
    keysToBatch.map(key => {
      return Promise.all(
        command[key]
          .reduce(
            (acc, _, i) =>
              i < Math.ceil(command[key].length / requestBatchSize)
                ? acc.concat({
                    command: command.command,
                    [key]: command[key].slice(
                      i * requestBatchSize,
                      (1 + i) * requestBatchSize
                    )
                  })
                : acc,
            []
          )
          .map((batchedCommand: BatchableCommand<C>) =>
            send(batchedCommand, uri, apiVersion)
          )
      ).then(res =>
        res.reduce(
          (acc: ReadonlyArray<R>, batch: any) => acc.concat(batch as R),
          []
        )
      );
    })
  ).then((responses: ReadonlyArray<ReadonlyArray<R>>) => {
    switch (command.command) {
      case ProtocolCommand.FIND_TRANSACTIONS:
        return {
          hashes: (responses[0][0] as any).hashes.filter((hash: string) =>
            responses.every(
              response =>
                response.findIndex(
                  (res: any) =>
                    (res as FindTransactionsResponse).hashes.indexOf(hash) > -1
                ) > -1
            )
          )
        };
      case ProtocolCommand.GET_BALANCES:
        return {
          ...responses[0]
            .slice()
            .sort((a: any, b: any) => a.milestoneIndex - b.milestoneIndex)
            .slice(-1),
          balances: responses[0].reduce(
            (acc, response: any) => acc.concat(response.balances),
            []
          )
        };
      case ProtocolCommand.GET_INCLUSION_STATES:
        return {
          ...(responses[0][0] as any),
          states: responses[0].reduce((acc: any, response: any) =>
            acc.conact(response.states)
          )
        };
      default:
        throw requestError("Invalid batched request.");
    }
  });
