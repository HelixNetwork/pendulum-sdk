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
  .post("/", {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses: [
      "343448535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356",
      "abcd48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
    ]
  })
  .reply(200, {
    states: [false, false]
  });
