import * as nock from "nock";
import {
  ProtocolCommand,
  GetTipsCommand,
  GetTipsResponse
} from "../../../../types";
import headers from "./headers";

export const getTipsCommand: GetTipsCommand = {
  command: ProtocolCommand.GET_TIPS
};

export const getTipsResponse: GetTipsResponse = {
  hashes: ["T".repeat(2 * 32), "U".repeat(2 * 32)],
  duration: 10
};

export const getBalancesNock = nock("http://localhost:14265", headers)
  .persist()
  .post("/", getTipsCommand)
  .reply(200, getTipsResponse);
