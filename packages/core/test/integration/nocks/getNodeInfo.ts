import * as nock from "nock";
import {
  GetNodeInfoCommand,
  GetNodeInfoResponse,
  Hash,
  ProtocolCommand
} from "../../../../types";
import headers from "./headers";

export const getNodeInfoCommand: GetNodeInfoCommand = {
  command: ProtocolCommand.GET_NODE_INFO
};

export const getNodeInfoResponse: GetNodeInfoResponse = {
  appName: "Helix",
  appVersion: "",
  duration: 100,
  jreAvailableProcessors: 4,
  jreFreeMemory: 13020403,
  jreMaxMemory: 1241331231,
  jreTotalMemory: 4245234332,
  currentRoundIndex: 564,
  latestSolidRoundHash: "f".repeat(2 * 32),
  latestSolidRoundIndex: 565,
  roundStartIndex: 1,
  lastSnapshottedRoundIndex: 20,
  neighbors: 5,
  packetsQueueSize: 23,
  time: 213213214,
  tips: 123,
  transactionsToRequest: 10
};

export const getBalancesNock = nock("http://localhost:14265", headers)
  .persist()
  .post("/", getNodeInfoCommand)
  .reply(200, getNodeInfoResponse);
