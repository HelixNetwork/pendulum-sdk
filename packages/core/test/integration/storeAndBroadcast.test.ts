import { createHttpClient } from "@helixnetwork/http-client";
import { attachedHBytesOfInvalidLength } from "@helixnetwork/samples";
import test from "ava";
import { INVALID_ATTACHED_HBYTES } from "../../../errors";
import { createStoreAndBroadcast } from "../../src";
import "./nocks/broadcastTransactions";
import { storeTransactionsCommand } from "./nocks/storeTransactions";

const storeAndBroadcast = createStoreAndBroadcast(createHttpClient());

test("storeAndBroadcast() stores and broadcasts transactions.", async t => {
  const { hbytes } = storeTransactionsCommand;
  t.deepEqual(
    await storeAndBroadcast([...hbytes]),
    hbytes,
    "storeAndBroadcast() should store and bradcast transactions."
  );
});

test("storeAndBroadcast() does not mutate original hbytes.", async t => {
  const { hbytes } = storeTransactionsCommand;

  await storeAndBroadcast(hbytes);
  t.deepEqual(
    hbytes,
    storeTransactionsCommand.hbytes,
    "storeAndBroadcast() should not mutate original hbytes."
  );
});

test("storeAndBroadcast() rejects with correct error for invalid attached hbytes.", t => {
  const invalidHBytes = ["asdasDSFDAFD"];

  t.is(
    t.throws(() => storeAndBroadcast(invalidHBytes), Error).message,
    `${INVALID_ATTACHED_HBYTES}: ${invalidHBytes[0]}`,
    "storeAndBroadcast() should throw error for invalid attached hbytes."
  );
});

test("storeAndBroadcast() rejects with correct errors for attached hbytes of invalid length.", t => {
  const invalidHBytes = ["asdasDSFDAFD"];

  t.is(
    t.throws(() => storeAndBroadcast(attachedHBytesOfInvalidLength), Error)
      .message,
    `${INVALID_ATTACHED_HBYTES}: ${attachedHBytesOfInvalidLength[0]}`,
    "storeAndBroadcast() should throw error for attached hbytes of invalid length."
  );
});

test.cb("storeAndBroadcast() invokes callback", t => {
  storeAndBroadcast([...storeTransactionsCommand.hbytes], t.end);
});

test.cb("storeAndBroadcast() passes correct arguments to callback", t => {
  const { hbytes } = storeTransactionsCommand;
  storeAndBroadcast([...hbytes], (err, res) => {
    t.is(
      err,
      null,
      "storeAndBroadcast() should pass null as first argument in callback for successuful requests"
    );

    t.deepEqual(
      res,
      hbytes,
      "storeAndBroadcast() should pass the correct response as second argument in callback"
    );

    t.end();
  });
});
