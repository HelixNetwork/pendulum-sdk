import {
  bundle,
  bundleHBytes,
  bundleWithZeroValue,
  bundleWithZeroValueHBytes
} from "@helix/samples";
import * as nock from "nock";
import {
  GetHBytesCommand,
  GetHBytesResponse,
  ProtocolCommand
} from "../../../../types";
import headers from "./headers";

export const getHBytesCommand: GetHBytesCommand = {
  command: ProtocolCommand.GET_HBYTES,
  hashes: ["a".repeat(2 * 32), "b".repeat(2 * 32)]
};

export const getHBytesResponse: GetHBytesResponse = {
  hbytes: ["0".repeat(2 * 273), "0".repeat(2 * 273)]
};

export const getBalancesNock = nock("http://localhost:14265", headers)
  .persist()
  .post("/", getHBytesCommand)
  .reply(200, getHBytesResponse);

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_HBYTES,
    hashes: [bundleWithZeroValue[0].hash]
  })
  .reply(200, {
    hbytes: bundleWithZeroValueHBytes
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_HBYTES,
    hashes: [bundle[0].hash]
  })
  .reply(200, {
    hbytes: [bundleHBytes[0]]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_HBYTES,
    hashes: [bundle[1].hash]
  })
  .reply(200, {
    hbytes: [bundleHBytes[1]]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_HBYTES,
    hashes: [bundle[2].hash]
  })
  .reply(200, {
    hbytes: [bundleHBytes[2]]
  });

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.GET_HBYTES,
    hashes: [bundle[3].hash]
  })
  .reply(200, {
    hbytes: [bundleHBytes[3]]
  });
