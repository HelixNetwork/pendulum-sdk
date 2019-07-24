import * as nock from "nock";
import { ProtocolCommand } from "../../../../types";
import {
  WereAddressesSpentFromCommand,
  WereAddressesSpentFromResponse
} from "../../../src/createWereAddressesSpentFrom";
import headers from "./headers";

import { addresses, addresseDefaultSecLevel } from "@helixnetwork/samples";

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
    addresses: [addresses[0]]
  })
  .reply(200, {
    states: [true]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [addresses[1]]
  })
  .reply(200, {
    states: [false]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [addresses[2]]
  })
  .reply(200, {
    states: [false]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [addresses[1], addresses[2]]
  })
  .reply(200, {
    states: [false, false]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [addresseDefaultSecLevel[1], addresseDefaultSecLevel[2]]
  })
  .reply(200, {
    states: [false, false]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [addresseDefaultSecLevel[2]]
  })
  .reply(200, {
    states: [false]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [addresseDefaultSecLevel[1]]
  })
  .reply(200, {
    states: [false]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [addresseDefaultSecLevel[0]]
  })
  .reply(200, {
    states: [false]
  });
