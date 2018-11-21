import { test } from "ava";
import {
  BaseCommand,
  FindTransactionsCommand,
  ProtocolCommand
} from "../../types";
import { isBatchableCommand } from "../src/httpClient";

const batchableCommand: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  addresses: ["a".repeat(2 * 32), "a".repeat(2 * 32)]
};

interface CustomCommand extends BaseCommand {
  key: ReadonlyArray<string>;
}

const nonBatchableCommand: CustomCommand = {
  command: "command",
  key: ["key"]
};

test("isBatchableCommand() returns true for batchable commands.", t => {
  t.is(isBatchableCommand(batchableCommand), true);
});

test("isBatchableCommand() returns false for non-batchable commands.", t => {
  t.is(isBatchableCommand(nonBatchableCommand), false);
});
