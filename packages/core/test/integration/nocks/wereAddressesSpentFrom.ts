import * as nock from "nock";
import { ProtocolCommand } from "../../../../types";
import {
  WereAddressesSpentFromCommand,
  WereAddressesSpentFromResponse
} from "../../../src/createWereAddressesSpentFrom";
import headers from "./headers";

import { addresses } from "@helix/samples";

export const wereAddressesSpentFromCommand: WereAddressesSpentFromCommand = {
  command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
  addresses
};

export const wereAddressesSpentFromResponse: WereAddressesSpentFromResponse = {
  states: [true, false, false]
};

export const wereAddressesSpentFromNock = nock(
  "http://localhost:14265",
  headers
)
  .persist()
  .post("/", wereAddressesSpentFromCommand)
  .reply(200, wereAddressesSpentFromResponse);

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [
      "0219c68a8de8a82504832a8d17d64466453689dae9bbc21affe5f25efa3202c90e"
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
      "025dac12f2de9f9ea7848a0ede74657b24ecdf966505dae2a6bbe410c08a69bd14"
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
      "03fb82bde446c6de39a5a7c4dc5d2f28318c8e0fa79a2ede420f6cacfe305458b2"
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
      "025dac12f2de9f9ea7848a0ede74657b24ecdf966505dae2a6bbe410c08a69bd14",
      "03fb82bde446c6de39a5a7c4dc5d2f28318c8e0fa79a2ede420f6cacfe305458b2"
    ]
  })
  .reply(200, {
    states: [false, false]
  });
