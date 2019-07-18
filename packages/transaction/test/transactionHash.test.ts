import { toHBytes } from "@helixnetwork/converter";
import { bundle, bundleHBytes } from "@helixnetwork/samples";
import test from "ava";
import { transactionHash } from "../src";

test("transactionHash() returns the correct transaction hash.", t => {
  t.is(
    transactionHash(toHBytes(bundleHBytes[0])),
    "000089218c937428e4e58507c8e36d853f4b20fd11508d32281aeafed842e4da", //bundle[0].hash,
    "transactionHash() should return the correct transaction hash."
  );
});
