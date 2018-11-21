import * as nock from "nock";
import {
  ProtocolCommand,
  GetHBytesCommand,
  GetHBytesResponse
} from "../../../../types";
import {
  bundle,
  bundleHBytes,
  bundleWithZeroValue,
  bundleWithZeroValueHBytes
} from "@helix/samples";
import headers from "./headers";

export const getHBytesCommand: GetHBytesCommand = {
  command: ProtocolCommand.GET_HBYTES,
  hashes: ["a".repeat(2 * 32), "b".repeat(2 * 32)]
};

export const getHBytesResponse: GetHBytesResponse = {
  hbytes: ["0".repeat(2646), "0".repeat(2646)]
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
