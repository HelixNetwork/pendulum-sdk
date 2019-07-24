import { createHttpClient } from "@helixnetwork/http-client";
import { attachedHBytesOfInvalidLength } from "@helixnetwork/samples";
import test from "ava";
import { INVALID_ATTACHED_HBYTES } from "../../../errors";
import { createStoreAndBroadcast } from "../../src";
import "./nocks/broadcastTransactions";
import { storeTransactionsCommand } from "./nocks/storeTransactions";

const storeAndBroadcast = createStoreAndBroadcast(createHttpClient());

test("storeAndBroadcast() stores and broadcasts transactions.", async t => {
  const { tx } = storeTransactionsCommand;
  t.deepEqual(
    await storeAndBroadcast([...tx]),
    tx,
    "storeAndBroadcast() should store and bradcast transactions."
  );
});

test("storeAndBroadcast() does not mutate original tx.", async t => {
  const { tx } = storeTransactionsCommand;

  await storeAndBroadcast(tx);
  t.deepEqual(
    tx,
    storeTransactionsCommand.tx,
    "storeAndBroadcast() should not mutate original tx."
  );
});

test("storeAndBroadcast() rejects with correct error for invalid attached tx.", t => {
  const invalidHBytes = ["asdasDSFDAFD"];

  t.is(
    t.throws(() => storeAndBroadcast(invalidHBytes), Error).message,
    `${INVALID_ATTACHED_HBYTES}: ${invalidHBytes[0]}`,
    "storeAndBroadcast() should throw error for invalid attached tx."
  );
});

test("storeAndBroadcast() rejects with correct errors for attached tx of invalid length.", t => {
  const invalidHBytes = ["asdasDSFDAFD"];

  t.is(
    t.throws(() => storeAndBroadcast(attachedHBytesOfInvalidLength), Error)
      .message,
    `${INVALID_ATTACHED_HBYTES}: ${attachedHBytesOfInvalidLength[0]}`,
    "storeAndBroadcast() should throw error for attached tx of invalid length."
  );
});

test.cb("storeAndBroadcast() invokes callback", t => {
  storeAndBroadcast([...storeTransactionsCommand.tx], t.end);
});

test.cb("storeAndBroadcast() passes correct arguments to callback", t => {
  const { tx } = storeTransactionsCommand;
  storeAndBroadcast([...tx], (err, res) => {
    t.is(
      err,
      null,
      "storeAndBroadcast() should pass null as first argument in callback for successuful requests"
    );

    t.deepEqual(
      res,
      tx,
      "storeAndBroadcast() should pass the correct response as second argument in callback"
    );

    t.end();
  });
});
