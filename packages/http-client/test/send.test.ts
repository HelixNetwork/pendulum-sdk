import * as nock from "nock";
import { createHttpClient } from "../src";
import {
  FindTransactionsCommand,
  ProtocolCommand,
  FindTransactionsResponse
} from "../../types";
import test from "ava";

const API_VERSION = 1;

const { send } = createHttpClient({
  provider: "http://localhost:24265",
  requestBatchSize: 3,
  apiVersion: API_VERSION
});

export const command: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  addresses: ["a".repeat(2 * 32), "b".repeat(2 * 32), "c".repeat(2 * 32)],
  tags: ["a".repeat(2 * 8), "b".repeat(2 * 8), "c".repeat(2 * 8)],
  approvees: ["d".repeat(2 * 32), "e".repeat(2 * 32), "f".repeat(2 * 32)]
};

export const headers = (version: string | number) => ({
  reqheaders: {
    "Content-Type": "application/json",
    "X-HELIX-API-Version": version.toString()
  }
});

export const response: FindTransactionsResponse = {
  hashes: ["H".repeat(2 * 32)]
};

export const validSendNock = nock(
  "http://localhost:24265",
  headers(API_VERSION)
)
  .persist()
  .post("/", command)
  .reply(200, response);

test("send() returns correct response.", async t => {
  t.deepEqual(await send(command), response);
});

export const invalidCommand: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  addresses: ["asdfsf"]
};

export const badSendNock = nock("http://localhost:24265", headers(API_VERSION))
  .persist()
  .post("/", invalidCommand)
  .reply(400);

test("send() returns correct error message for bad request.", t => {
  return send(invalidCommand).catch(error => {
    t.is(
      error,
      "Request error: Bad Request",
      "httpClient.send() should throw correct error for bad request."
    );
  });
});
