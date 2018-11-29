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
      "0258f8e961479d7867155450a5720e3c982ace5d0ce7c4feb3bd606afaa79d6e92"
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
      "03d044566789d180990214ffd70afc60453aee9bf844d4d779974bea4bfa55ade4"
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
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [
      "03d044566789d180990214ffd70afc60453aee9bf844d4d779974bea4bfa55ade4",
      "abcd48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
    ]
  })
  .reply(200, {
    states: [false, false]
  });
