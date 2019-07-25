import { toTxBytes } from "@helixnetwork/converter";
import { bundle, bundleHBytes } from "@helixnetwork/samples";
import test from "ava";
import { transactionHash } from "../src";

test("transactionHash() returns the correct transaction hash.", t => {
  t.is(
    transactionHash(toTxBytes(bundleHBytes[0])),
    bundle[0].hash,
    "transactionHash() should return the correct transaction hash."
  );
});
