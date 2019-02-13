import { createHttpClient } from "@helixnetwork/http-client";
import { bundle, bundleWithZeroValue } from "@helixnetwork/samples";
import test from "ava";
import { INVALID_TRANSACTION_HASH } from "../../../errors";
import { createGetBundle } from "../../src";
import "./nocks/getHBytes";

const getBundle = createGetBundle(createHttpClient());
const tail = bundle[0].hash;

test("getBundle() resolves to correct bundle.", async t => {
  t.deepEqual(
    await getBundle(tail),
    bundle,
    "getBundle() should resolve to correct bundle."
  );
});

test("getBundle() resolves to correct single transaction bundle.", async t => {
  t.deepEqual(
    await getBundle(bundleWithZeroValue[0].hash),
    bundleWithZeroValue,
    "getBundle() should resolve to correct single transaction bundle."
  );
});

test("getBundle() rejects with correct error for invalid hash.", t => {
  const invalidHash = "asdasDSFDAFD";

  t.is(
    t.throws(() => getBundle(invalidHash), Error).message,
    `${INVALID_TRANSACTION_HASH}: ${invalidHash}`,
    "getBundle() should throw correct error for invalid hash."
  );
});

test.cb("getBundle() invokes callback", t => {
  getBundle(tail, t.end);
});

test.cb("getBundle() passes correct arguments to callback", t => {
  getBundle(tail, (err, res) => {
    t.is(
      err,
      null,
      "getBundle() should pass null as first argument in callback for successfully requests"
    );

    t.deepEqual(
      res,
      bundle,
      "getBundle() should pass the correct response as second argument in callback"
    );

    t.end();
  });
});
