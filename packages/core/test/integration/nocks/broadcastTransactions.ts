import { bundleHBytes } from "@helix/samples";
import * as nock from "nock";
import {
  BroadcastTransactionsCommand,
  ProtocolCommand
} from "../../../../types";
import headers from "./headers";

export const broadcastTransactionsCommand: BroadcastTransactionsCommand = {
  command: ProtocolCommand.BROADCAST_TRANSACTIONS,
  hbytes: bundleHBytes
};

export const broadcastTransactionsNock = nock("http://localhost:14265", headers)
  .persist()
  .post("/", broadcastTransactionsCommand)
  .reply(200, {});
