import { createHttpClient } from "@helixnetwork/http-client";
import { bundle } from "@helixnetwork/samples";
import test from "ava";
import { INVALID_TRANSACTION_HBYTES } from "../../../errors";
import { createSendHBytes } from "../../src";
import { attachToTangleCommand } from "./nocks/attachToTangle";
import "./nocks/broadcastTransactions";
import { getTransactionsToApproveCommand } from "./nocks/getTransactionsToApprove";
import "./nocks/storeTransactions";

const { minWeightMagnitude, tx } = attachToTangleCommand;
const { depth } = getTransactionsToApproveCommand;

const sendHBytes = createSendHBytes(createHttpClient());

test("sendHBytes() attaches to tangle, broadcasts, stores and resolves to transaction objects.", async t => {
  t.deepEqual(
    await sendHBytes(tx, depth, minWeightMagnitude),
    bundle,
    "sendHBytes() should attach to tangle, broadcast, store and resolve to transaction objects."
  );
});

test("sendHBytes() does not mutate original tx.", async t => {
  const hbytesCopy = [...tx];

  await sendHBytes(hbytesCopy, depth, minWeightMagnitude);
  t.deepEqual(hbytesCopy, tx, "sendHBytes() should not mutate original tx.");
});

test("sendHBytes() rejects with correct errors for invalid input.", t => {
  const invalidHBytes = ["asdasDSFDAFD"];

  t.is(
    t.throws(() => sendHBytes(invalidHBytes, depth, minWeightMagnitude), Error)
      .message,
    `${INVALID_TRANSACTION_HBYTES}: ${invalidHBytes[0]}`,
    "sendHBytes() should throw correct error for invalid tx."
  );
});

test.cb("sendHBytes() invokes callback", t => {
  sendHBytes(tx, depth, minWeightMagnitude, undefined, t.end);
});

test.cb("sendHBytes() passes correct arguments to callback", t => {
  sendHBytes(tx, depth, minWeightMagnitude, undefined, (err, res) => {
    t.is(
      err,
      null,
      "sendHBytes() should pass null as first argument in callback for successuful requests"
    );

    t.deepEqual(
      res,
      bundle,
      "sendHBytes() should pass the correct response as second argument in callback"
    );

    t.end();
  });
});
