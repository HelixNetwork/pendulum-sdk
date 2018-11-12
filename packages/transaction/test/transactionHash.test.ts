import test from "ava";
import { hbits } from "@helix/converter";
import { bundle, bundleHBytes } from "@helix/samples";
import { transactionHash } from "../src";

test("transactionHash() returns the correct transaction hash.", t => {
  t.is(
    transactionHash(hbits(bundleHBytes[0])),
    bundle[0].hash,
    "transactionHash() should return the correct transaction hash."
  );
});
