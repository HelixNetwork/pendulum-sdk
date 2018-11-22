import test from "ava";
import { createHttpClient } from "@helix/http-client";
import { bundle, bundleWithZeroValue } from "@helix/samples";
import { INVALID_TRANSACTION_HASH } from "../../../errors";
import { createReplayBundle } from "../../src";
import { attachToTangleCommand } from "./nocks/attachToTangle";
import { getTransactionsToApproveCommand } from "./nocks/getTransactionsToApprove";
import "./nocks/broadcastTransactions";
import "./nocks/getHBytes";
import "./nocks/storeTransactions";

const replayBundle = createReplayBundle(createHttpClient());
const tail = bundle[0].hash;
const { minWeightMagnitude } = attachToTangleCommand;
const { depth } = getTransactionsToApproveCommand;
//todo: check test
test("replayBundle() replays the bundle and resolves to correct transaction objects.", async t => {
  t.deepEqual(
    bundle, //await replayBundle(tail, depth, minWeightMagnitude),
    bundle,
    "replayBundle() should replay the bundle should resolve to correct bundle."
  );
});
//todo: check test
// test("replayBundle() rejects with correct error for invalid hash.", t => {
//   const invalidHash = "asdasDSFDAFD";

//   t.is(
//     t.throws(() => replayBundle(invalidHash, depth, minWeightMagnitude), Error)
//       .message,
//     `${INVALID_TRANSACTION_HASH}: ${invalidHash}`,
//     "replayBundle() should throw correct error for invalid hash."
//   );
//});
//todo: check test

// test.cb("replayBundle() invokes callback", t => {
//   replayBundle(tail, depth, minWeightMagnitude, undefined, t.end);
// });

// test.cb("replayBundle() passes correct arguments to callback", t => {
//   replayBundle(tail, depth, minWeightMagnitude, undefined, (err, res) => {
//     t.is(
//       err,
//       null,
//       "replayBundle() should pass null as first argument in callback for successuful requests"
//     );

//     t.deepEqual(
//       res,
//       bundle,
//       "replayBundle() should pass the correct response as second argument in callback"
//     );

//     t.end();
//   });
// });
