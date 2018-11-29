import { bundleHBytes } from "@helix/samples";
import * as nock from "nock";
import { ProtocolCommand, StoreTransactionsCommand } from "../../../../types";
import headers from "./headers";

export const storeTransactionsCommand: StoreTransactionsCommand = {
  command: ProtocolCommand.STORE_TRANSACTIONS,
  hbytes: bundleHBytes
};

export const storeTransactionsNock = nock("http://localhost:14265", headers)
  .persist()
  .post("/", storeTransactionsCommand)
  .reply(200, {});
