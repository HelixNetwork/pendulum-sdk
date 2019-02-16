import * as nock from "nock";
import {
  Balances,
  GetBalancesCommand,
  ProtocolCommand
} from "../../../../types";
import headers from "./headers";
import { addresses as addr } from "@helixnetwork/samples";

export const getBalancesCommand: GetBalancesCommand = {
  command: ProtocolCommand.GET_BALANCES,
  addresses: [addr[0], addr[1], addr[2]],
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
    addresses: [addr[1], addr[2]]
  })
  .reply(200, {
    ...balancesResponse,
    balances: ["0", "1"]
  });
