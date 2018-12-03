import * as nock from "nock";
import {
  Balances,
  GetBalancesCommand,
  ProtocolCommand
} from "../../../../types";
import headers from "./headers";

export const getBalancesCommand: GetBalancesCommand = {
  command: ProtocolCommand.GET_BALANCES,
  addresses: [
    "0219c68a8de8a82504832a8d17d64466453689dae9bbc21affe5f25efa3202c90e",
    "025dac12f2de9f9ea7848a0ede74657b24ecdf966505dae2a6bbe410c08a69bd14",
    "03fb82bde446c6de39a5a7c4dc5d2f28318c8e0fa79a2ede420f6cacfe305458b2"
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
      "025dac12f2de9f9ea7848a0ede74657b24ecdf966505dae2a6bbe410c08a69bd14",
      "03fb82bde446c6de39a5a7c4dc5d2f28318c8e0fa79a2ede420f6cacfe305458b2"
    ]
  })
  .reply(200, {
    ...balancesResponse,
    balances: ["0", "1"]
  });
