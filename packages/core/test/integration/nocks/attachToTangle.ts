import { bundle, bundleHBytes } from "@helixnetwork/samples";
import * as nock from "nock";
import {
  AttachToTangleCommand,
  AttachToTangleResponse,
  ProtocolCommand
} from "../../../../types";
import headers from "./headers";

export const attachToTangleCommand: AttachToTangleCommand = {
  command: ProtocolCommand.ATTACH_TO_TANGLE,
  trunkTransaction: bundle[bundle.length - 1].trunkTransaction,
  branchTransaction: bundle[bundle.length - 1].branchTransaction,
  minWeightMagnitude: 14,
  txs: [...bundleHBytes].reverse()
};

export const attachToTangleResponse: AttachToTangleResponse = {
  txs: bundleHBytes
};

export const attachToTangleNock = nock("http://localhost:14265", headers)
  .persist()
  .post("/", attachToTangleCommand)
  .reply(200, attachToTangleResponse);
