import * as nock from "nock";
import {
  ProtocolCommand,
  GetBalancesCommand,
  Balances
} from "../../../../types";
import headers from "./headers";

export const getBalancesCommand: GetBalancesCommand = {
  command: ProtocolCommand.GET_BALANCES,
  addresses: [
    "464a48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356",
    "343448535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356",
    "abcd48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
  ],
  threshold: 100
};

export const balancesResponse = {
  balances: [99, 0, 1],
  milestone: "f".repeat(2 * 32),
  milestoneIndex: 1
};

export const getBalancesNock = nock("http://localhost:14265", headers)
  .persist()
  .post("/", getBalancesCommand)
  .reply(200, balancesResponse);

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    ...getBalancesCommand,
    addresses: [
      "343448535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356",
      "abcd48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
    ]
  })
  .reply(200, {
    ...balancesResponse,
    balances: ["0", "1"]
  });
