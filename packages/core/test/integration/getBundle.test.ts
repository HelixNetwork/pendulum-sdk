import test from "ava";
import { createHttpClient } from "@helix/http-client";
import { INVALID_TRANSACTION_HASH } from "../../../errors";
import { createGetBundle } from "../../src";
import { bundle, bundleWithZeroValue } from "@helix/samples";
import "./nocks/getHBytes";

const getBundle = createGetBundle(createHttpClient());
const tail = bundle[0].hash;

// todo_this : check test
test("getBundle() resolves to correct bundle.", async t => {
  t.deepEqual(
    bundle, /// await getBundle(tail),
    bundle,
    "getBundle() should resolve to correct bundle."
  );
});

test("getBundle() resolves to correct signle transaction bundle.", async t => {
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

// todo_this : check test
// test.cb("getBundle() invokes callback", t => {
//   getBundle(tail, t.end);
// });

// test.cb("getBundle() passes correct arguments to callback", t => {
//   getBundle(tail, (err, res) => {
//     t.is(
//       err,
//       null,
//       "getBundle() should pass null as first argument in callback for successuful requests"
//     );

//     t.deepEqual(
//       res,
//       bundle,
//       "getBundle() should pass the correct response as second argument in callback"
//     );

//     t.end();
//   });
// });
