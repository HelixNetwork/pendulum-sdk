import * as nock from "nock";
import {
  CheckConsistencyCommand,
  CheckConsistencyResponse,
  ProtocolCommand
} from "../../../../types";
import headers from "./headers";

export const checkConsistencyCommand: CheckConsistencyCommand = {
  command: ProtocolCommand.CHECK_CONSISTENCY,
  tails: ["a".repeat(2 * 32), "b".repeat(2 * 32)]
};

export const checkConsistencyResponse: CheckConsistencyResponse = {
  state: true,
  info: ""
};

export const checkConsistencyNock = nock("http://localhost:14265", headers)
  .persist()
  .post("/", checkConsistencyCommand)
  .reply(200, checkConsistencyResponse);

export const checkConsistencyWithInfoCommand: CheckConsistencyCommand = {
  command: ProtocolCommand.CHECK_CONSISTENCY,
  tails: ["a".repeat(2 * 32), "b".repeat(2 * 32), "c".repeat(2 * 32)]
};

export const checkConsistencyWithInfoResponse: CheckConsistencyResponse = {
  state: false,
  info: "test response"
};

export const checkConsistencyWithInfoNock = nock(
  "http://localhost:14265",
  headers
)
  .persist()
  .post("/", checkConsistencyWithInfoCommand)
  .reply(200, checkConsistencyWithInfoResponse);
