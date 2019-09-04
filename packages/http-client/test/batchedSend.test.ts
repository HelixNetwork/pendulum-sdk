import test from "ava";
import * as nock from "nock";
import {
  FindTransactionsCommand,
  FindTransactionsResponse,
  ProtocolCommand
} from "../../types";
import { createHttpClient } from "../src";
import { headers } from "./send.test";

const API_VERSION = 1;

const { send } = createHttpClient({
  provider: "http://localhost:24265",
  requestBatchSize: 2,
  apiVersion: API_VERSION
});

export const command: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  addresses: ["a".repeat(2 * 32), "a".repeat(2 * 32), "c".repeat(2 * 32)],
  tags: ["a".repeat(2 * 8), "a".repeat(2 * 8), "c".repeat(2 * 8)],
  approvees: ["d".repeat(2 * 32)]
};

export const command1: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  addresses: ["a".repeat(2 * 32), "a".repeat(2 * 32)]
};
export const command2: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  addresses: ["c".repeat(2 * 32)]
};

export const command3: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  tags: ["a".repeat(2 * 8), "a".repeat(2 * 8)]
};

export const command4: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  tags: ["c".repeat(2 * 8)]
};

export const command5: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  approvees: ["d".repeat(2 * 32)]
};

export const response1: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "c".repeat(2 * 32)]
};
export const response2: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "d".repeat(2 * 32)]
};
export const response3: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "d".repeat(2 * 32), "e".repeat(2 * 32)]
};
export const response4: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "a".repeat(2 * 32)]
};
export const response5: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "c".repeat(2 * 32)]
};

export const response: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32)]
};

export const batchedSendNock1 = nock(
  "http://localhost:24265",
  headers(API_VERSION)
)
  .persist()
  .post("/", command1)
  .reply(200, response1);

export const batchedSendNock2 = nock(
  "http://localhost:24265",
  headers(API_VERSION)
)
  .persist()
  .post("/", command2)
  .reply(200, response2);

export const batchedSendNock3 = nock(
  "http://localhost:24265",
  headers(API_VERSION)
)
  .persist()
  .post("/", command3)
  .reply(200, response3);

export const batchedSendNock4 = nock(
  "http://localhost:24265",
  headers(API_VERSION)
)
  .persist()
  .post("/", command4)
  .reply(200, response4);

export const batchedSendNock5 = nock(
  "http://localhost:24265",
  headers(API_VERSION)
)
  .persist()
  .post("/", command5)
  .reply(200, response5);

test("batchedSend() returns correct response", async t => {
  t.deepEqual(await send(command), response);
});
