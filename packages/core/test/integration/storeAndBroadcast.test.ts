import { createHttpClient } from "@helixnetwork/http-client";
import { attachedTxHexOfInvalidLength } from "@helixnetwork/samples";
import test from "ava";
import { INVALID_ATTACHED_TX_HEX } from "../../../errors";
import { createStoreAndBroadcast } from "../../src";
import "./nocks/broadcastTransactions";
import { storeTransactionsCommand } from "./nocks/storeTransactions";

const storeAndBroadcast = createStoreAndBroadcast(createHttpClient());

test("storeAndBroadcast() stores and broadcasts transactions.", async t => {
  const { txs } = storeTransactionsCommand;
  t.deepEqual(
    await storeAndBroadcast([...txs]),
    txs,
    "storeAndBroadcast() should store and bradcast transactions."
  );
});

test("storeAndBroadcast() does not mutate original txs.", async t => {
  const { txs } = storeTransactionsCommand;

  await storeAndBroadcast(txs);
  t.deepEqual(
    txs,
    storeTransactionsCommand.txs,
    "storeAndBroadcast() should not mutate original txs."
  );
});

test("storeAndBroadcast() rejects with correct error for invalid attached txs.", t => {
  const invalidTxHex = ["asdasDSFDAFD"];

  t.is(
    t.throws(() => storeAndBroadcast(invalidTxHex), Error).message,
    `${INVALID_ATTACHED_TX_HEX}: ${invalidTxHex[0]}`,
    "storeAndBroadcast() should throw error for invalid attached txs."
  );
});

test("storeAndBroadcast() rejects with correct errors for attached txs of invalid length.", t => {
  const invalidTxHex = ["asdasDSFDAFD"];

  t.is(
    t.throws(() => storeAndBroadcast(attachedTxHexOfInvalidLength), Error)
      .message,
    `${INVALID_ATTACHED_TX_HEX}: ${attachedTxHexOfInvalidLength[0]}`,
    "storeAndBroadcast() should throw error for attached txs of invalid length."
  );
});

test.cb("storeAndBroadcast() invokes callback", t => {
  storeAndBroadcast([...storeTransactionsCommand.txs], t.end);
});

test.cb("storeAndBroadcast() passes correct arguments to callback", t => {
  const { txs } = storeTransactionsCommand;
  storeAndBroadcast([...txs], (err, res) => {
    t.is(
      err,
      null,
      "storeAndBroadcast() should pass null as first argument in callback for successuful requests"
    );

    t.deepEqual(
      res,
      txs,
      "storeAndBroadcast() should pass the correct response as second argument in callback"
    );

    t.end();
  });
});
