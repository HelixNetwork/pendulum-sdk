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

export const command_1: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  addresses: ["a".repeat(2 * 32), "a".repeat(2 * 32)]
};
export const command_2: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  addresses: ["c".repeat(2 * 32)]
};

export const command_3: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  tags: ["a".repeat(2 * 8), "a".repeat(2 * 8)]
};

export const command_4: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  tags: ["c".repeat(2 * 8)]
};

export const command_5: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  approvees: ["d".repeat(2 * 32)]
};

export const response_1: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "c".repeat(2 * 32)]
};
export const response_2: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "d".repeat(2 * 32)]
};
export const response_3: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "d".repeat(2 * 32), "e".repeat(2 * 32)]
};
export const response_4: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "a".repeat(2 * 32)]
};
export const response_5: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "c".repeat(2 * 32)]
};

export const response: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32)]
};

export const batchedSendNock_1 = nock(
  "http://localhost:24265",
  headers(API_VERSION)
)
  .persist()
  .post("/", command_1)
  .reply(200, response_1);

export const batchedSendNock_2 = nock(
  "http://localhost:24265",
  headers(API_VERSION)
)
  .persist()
  .post("/", command_2)
  .reply(200, response_2);

export const batchedSendNock_3 = nock(
  "http://localhost:24265",
  headers(API_VERSION)
)
  .persist()
  .post("/", command_3)
  .reply(200, response_3);

export const batchedSendNock_4 = nock(
  "http://localhost:24265",
  headers(API_VERSION)
)
  .persist()
  .post("/", command_4)
  .reply(200, response_4);

export const batchedSendNock_5 = nock(
  "http://localhost:24265",
  headers(API_VERSION)
)
  .persist()
  .post("/", command_5)
  .reply(200, response_5);

test("batchedSend() returns correct response", async t => {
  t.deepEqual(await send(command), response);
});
