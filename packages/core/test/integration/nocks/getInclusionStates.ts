import * as nock from "nock";
import {
  ProtocolCommand,
  GetInclusionStatesCommand,
  GetInclusionStatesResponse
} from "../../../../types";
import headers from "./headers";

export const getInclusionStatesCommand: GetInclusionStatesCommand = {
  command: ProtocolCommand.GET_INCLUSION_STATES,
  transactions: ["a".repeat(2 * 32), "b".repeat(2 * 32)],
  tips: ["f".repeat(2 * 32)]
};

export const getInclusionStatesResponse: GetInclusionStatesResponse = {
  states: [true, false],
  duration: 10
};

export const getBalancesNock = nock("http://localhost:14265", headers)
  .persist()
  .post("/", getInclusionStatesCommand)
  .reply(200, getInclusionStatesResponse);

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_INCLUSION_STATES,
    transactions: ["0".repeat(2 * 32), "0".repeat(2 * 32)],
    tips: ["f".repeat(2 * 32)]
  })
  .reply(200, getInclusionStatesResponse);
