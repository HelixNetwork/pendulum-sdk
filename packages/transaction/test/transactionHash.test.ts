import { toTxBytes } from "@helixnetwork/converter";
import { bundle, bundleTxHex } from "@helixnetwork/samples";
import test from "ava";
import { transactionHash } from "../src";

test("transactionHash() returns the correct transaction hash.", t => {
  t.is(
    transactionHash(toTxBytes(bundleTxHex[0])),
    bundle[0].hash,
    "transactionHash() should return the correct transaction hash."
  );
});
