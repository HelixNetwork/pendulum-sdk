import { createHttpClient } from "@helixnetwork/http-client";
import { bundle } from "@helixnetwork/samples";
import test from "ava";
import { INVALID_TRANSACTION_TX_HEX } from "../../../errors";
import { createSendTransactionStrings } from "../../src";
import { attachToTangleCommand } from "./nocks/attachToTangle";
import "./nocks/broadcastTransactions";
import { getTransactionsToApproveCommand } from "./nocks/getTransactionsToApprove";
import "./nocks/storeTransactions";

const { minWeightMagnitude, txs } = attachToTangleCommand;
const { depth } = getTransactionsToApproveCommand;

const sendTxHex = createSendTransactionStrings(createHttpClient());

test("sendTransactionStrings() attaches to tangle, broadcasts, stores and resolves to transaction objects.", async t => {
  t.deepEqual(
    await sendTxHex(txs, depth, minWeightMagnitude),
    bundle,
    "sendTransactionStrings() should attach to tangle, broadcast, store and resolve to transaction objects."
  );
});

test("sendTransactionStrings() does not mutate original txs.", async t => {
  const txHexCopy = [...txs];

  await sendTxHex(txHexCopy, depth, minWeightMagnitude);
  t.deepEqual(
    txHexCopy,
    txs,
    "sendTransactionStrings() should not mutate original txs."
  );
});

test("sendTransactionStrings() rejects with correct errors for invalid input.", t => {
  const invalidTxHex = ["asdasDSFDAFD"];

  t.is(
    t.throws(() => sendTxHex(invalidTxHex, depth, minWeightMagnitude), Error)
      .message,
    `${INVALID_TRANSACTION_TX_HEX}: ${invalidTxHex[0]}`,
    "sendTransactionStrings() should throw correct error for invalid txs."
  );
});

test.cb("sendTransactionStrings() invokes callback", t => {
  sendTxHex(txs, depth, minWeightMagnitude, undefined, t.end);
});

test.cb("sendTransactionStrings() passes correct arguments to callback", t => {
  sendTxHex(txs, depth, minWeightMagnitude, undefined, (err, res) => {
    t.is(
      err,
      null,
      "sendTransactionStrings() should pass null as first argument in callback for successuful requests"
    );

    t.deepEqual(
      res,
      bundle,
      "sendTransactionStrings() should pass the correct response as second argument in callback"
    );

    t.end();
  });
});
