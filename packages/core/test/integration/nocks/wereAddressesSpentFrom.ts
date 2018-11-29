import * as nock from "nock";
import {
  WereAddressesSpentFromCommand,
  WereAddressesSpentFromResponse
} from "../../../src/createWereAddressesSpentFrom";
import { ProtocolCommand } from "../../../../types";
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
      "03dbff15092f382870dfdb21b5e3e9077ce5e43be8bff82dbd575c6eb5237f664c"
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
      "03dbff15092f382870dfdb21b5e3e9077ce5e43be8bff82dbd575c6eb5237f664c"
    ]
  })
  .reply(200, {
    states: [false, false]
  });
