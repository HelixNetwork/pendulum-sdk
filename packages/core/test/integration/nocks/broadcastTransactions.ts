import { bundleTxHex } from "@helixnetwork/samples";
import * as nock from "nock";
import {
  BroadcastTransactionsCommand,
  ProtocolCommand
} from "../../../../types";
import headers from "./headers";

export const broadcastTransactionsCommand: BroadcastTransactionsCommand = {
  command: ProtocolCommand.BROADCAST_TRANSACTIONS,
  txs: bundleTxHex
};

export const broadcastTransactionsNock = nock("http://localhost:14265", headers)
  .persist()
  .post("/", broadcastTransactionsCommand)
  .reply(200, {});
