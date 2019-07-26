import {
  bundle,
  bundleHBytes,
  bundleWithZeroValue,
  bundleWithZeroValueTxHex
} from "@helixnetwork/samples";
import * as nock from "nock";
import { HASH_HBYTE_SIZE, TRANSACTION_HBYTE_SIZE } from "../../../../constants";
import {
  GetTransactionStringsCommand,
  GetTransactionStringsResponse,
  ProtocolCommand
} from "../../../../types";
import headers from "./headers";
export const getTransactionStringsCommand: GetTransactionStringsCommand = {
  command: ProtocolCommand.GET_TRANSACTION_STRINGS,
  hashes: ["a".repeat(HASH_HBYTE_SIZE), "b".repeat(HASH_HBYTE_SIZE)]
};

export const getTransactionStringsResponse: GetTransactionStringsResponse = {
  txs: ["0".repeat(TRANSACTION_HBYTE_SIZE), "0".repeat(TRANSACTION_HBYTE_SIZE)]
};

export const getBalancesNock = nock("http://localhost:14265", headers)
  .persist()
  .post("/", getTransactionStringsCommand)
  .reply(200, getTransactionStringsResponse);

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_TRANSACTION_STRINGS,
    hashes: [bundleWithZeroValue[0].hash]
  })
  .reply(200, {
    txs: bundleWithZeroValueTxHex
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_TRANSACTION_STRINGS,
    hashes: [bundle[0].hash]
  })
  .reply(200, {
    txs: [bundleHBytes[0]]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_TRANSACTION_STRINGS,
    hashes: [bundle[1].hash]
  })
  .reply(200, {
    txs: [bundleHBytes[1]]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_TRANSACTION_STRINGS,
    hashes: [bundle[2].hash]
  })
  .reply(200, {
    txs: [bundleHBytes[2]]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_TRANSACTION_STRINGS,
    hashes: [bundle[3].hash]
  })
  .reply(200, {
    txs: [bundleHBytes[3]]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_TRANSACTION_STRINGS,
    hashes: [bundle[4].hash]
  })
  .reply(200, {
    txs: [bundleHBytes[4]]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_TRANSACTION_STRINGS,
    hashes: [bundle[5].hash]
  })
  .reply(200, {
    txs: [bundleHBytes[5]]
  });
