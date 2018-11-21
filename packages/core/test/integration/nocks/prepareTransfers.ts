import * as nock from "nock";
import {
  ProtocolCommand,
  GetBalancesCommand,
  GetBalancesResponse
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

const getBalancesResponse: GetBalancesResponse = {
  balances: ["3", "4", "10"],
  milestone: "f".repeat(2 * 32),
  milestoneIndex: 1,
  duration: 10
};

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [
      "464a48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
    ]
  })
  .reply(200, {
    states: [true]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [
      "343448535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
    ]
  })
  .reply(200, {
    states: [false]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [
      "abcd48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
    ]
  })
  .reply(200, {
    states: [false]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", getBalancesCommand)
  .reply(200, getBalancesResponse);

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.FIND_TRANSACTIONS,
    addresses: [
      "343448535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
    ]
  })
  .reply(200, {
    hashes: ["a".repeat(2 * 32)]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.FIND_TRANSACTIONS,
    addresses: [
      "abcd48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
    ]
  })
  .reply(200, {
    hashes: []
  });
