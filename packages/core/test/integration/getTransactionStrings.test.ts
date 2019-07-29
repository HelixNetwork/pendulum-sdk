import { createHttpClient } from "@helixnetwork/http-client";
import test from "ava";
import { INVALID_TRANSACTION_HASH } from "../../../errors";
import { createGetTransactionStrings } from "../../src";
import {
  getTransactionStringsCommand,
  getTransactionStringsResponse
} from "./nocks/getTransactionStrings";

const getTransactionStrings = createGetTransactionStrings(createHttpClient());

test("getTransactionStrings() resolves to correct response", async t => {
  t.deepEqual(
    await getTransactionStrings(getTransactionStringsCommand.hashes),
    getTransactionStringsResponse.txs,
    "getTransactionStrings() should resolve to correct tryte array"
  );
});

test("getTransactionStrings() rejects with correct error for invalid hashes", t => {
  const invalidHashes = ["asdasDSFDAFD"];

  t.is(
    t.throws(() => getTransactionStrings(invalidHashes), Error).message,
    `${INVALID_TRANSACTION_HASH}: ${invalidHashes[0]}`,
    "getTransactionStrings() should throw error for invalid hashes"
  );
});

test.cb("getTransactionStrings() invokes callback", t => {
  getTransactionStrings(getTransactionStringsCommand.hashes, t.end);
});

test.cb("getTransactionStrings() passes correct arguments to callback", t => {
  getTransactionStrings(getTransactionStringsCommand.hashes, (err, res) => {
    t.is(
      err,
      null,
      "getTransactionStrings() should pass null as first argument in callback for successuful requests"
    );

    t.deepEqual(
      res,
      getTransactionStringsResponse.txs,
      "getTransactionStrings() should pass the correct response as second argument in callback"
    );

    t.end();
  });
});
