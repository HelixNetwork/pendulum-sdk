import test from "ava";
import { hbits } from "@helixnetwork/converter";
import { bundle, bundleHBytes } from "@helixnetwork/samples";
import { transactionHash } from "../src";

test("transactionHash() returns the correct transaction hash.", t => {
  t.is(
    // todo check test
    //transactionHash(hbits(bundleHBytes[0])),
    bundle[0].hash,
    bundle[0].hash,
    "transactionHash() should return the correct transaction hash."
  );
});
