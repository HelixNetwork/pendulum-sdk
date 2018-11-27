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
    "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db",
    "0270af6513000abc87fbb1cb413d27bb06826461b1968f644ab9224b28f89b044f",
    "0170af6513000abc87fbb1cb413d27bb06826461b1968f644ab9224b28f89b044f"
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
      "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db",
      "0270af6513000abc87fbb1cb413d27bb06826461b1968f644ab9224b28f89b044f"
    ]
  })
  .reply(200, {
    ...balancesResponse,
    balances: ["0", "1"]
  });
