import test from "ava";
import { FindTransactionsCommand, ProtocolCommand } from "../../types";
import { BatchableCommand, getKeysToBatch } from "../src/httpClient";

const BATCH_SIZE = 2;

const tags: string[] = [
  "a" + "0".repeat(15),
  "a" + "0".repeat(15),
  "c" + "0".repeat(15)
];

const approvees: string[] = [
  "a".repeat(2 * 32),
  "a".repeat(2 * 32),
  "c".repeat(2 * 32)
];

const command: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  addresses: ["0".repeat(2 * 32)],
  tags,
  approvees
};

const commandWithoutBatchableKeys: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  addresses: ["a".repeat(2 * 32), "a".repeat(2 * 32)]
};

test("getKeysToBatch() should return correct keys.", t => {
  t.deepEqual(
    getKeysToBatch(
      command as BatchableCommand<FindTransactionsCommand>,
      BATCH_SIZE
    ),
    ["tags", "approvees"]
  );
});

test("getKeysToBatch() should return no empty array for non-batchable keys.", t => {
  t.deepEqual(
    getKeysToBatch(
      commandWithoutBatchableKeys as BatchableCommand<FindTransactionsCommand>,
      BATCH_SIZE
    ),
    []
  );
});
