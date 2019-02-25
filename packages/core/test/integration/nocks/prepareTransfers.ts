import { addresses as addr } from "@helixnetwork/samples";
import * as nock from "nock";
import {
  GetBalancesCommand,
  GetBalancesResponse,
  ProtocolCommand
} from "../../../../types";
import headers from "./headers";

export const getBalancesCommand: GetBalancesCommand = {
  command: ProtocolCommand.GET_BALANCES,
  addresses: [addr[0], addr[1], addr[2]],
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
    addresses: [addr[0]]
  })
  .reply(200, {
    states: [true]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [addr[1]]
  })
  .reply(200, {
    states: [false]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [addr[2]]
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
    addresses: [addr[1]]
  })
  .reply(200, {
    hashes: ["a".repeat(2 * 32)]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.FIND_TRANSACTIONS,
    addresses: [addr[2]]
  })
  .reply(200, {
    hashes: []
  });
