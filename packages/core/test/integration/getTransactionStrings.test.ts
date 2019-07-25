import { createHttpClient } from "@helixnetwork/http-client";
import test from "ava";
import { INVALID_TRANSACTION_HASH } from "../../../errors";
import { createGetTransactionStrings } from "../../src";
import {
  getTransactionStringsCommand,
  getTransactionStringsResponse
} from "./nocks/getTransactionStrings";

const getTransactionStrings = createGetTransactionStrings(createHttpClient());

test("getBytes() resolves to correct response", async t => {
  t.deepEqual(
    await getTransactionStrings(getTransactionStringsCommand.hashes),
    getTransactionStringsResponse.hbytes,
    "getBytes() should resolve to correct tryte array"
  );
});

test("getBytes() rejects with correct error for invalid hashes", t => {
  const invalidHashes = ["asdasDSFDAFD"];

  t.is(
    t.throws(() => getTransactionStrings(invalidHashes), Error).message,
    `${INVALID_TRANSACTION_HASH}: ${invalidHashes[0]}`,
    "getBytes() should throw error for invalid hashes"
  );
});

test.cb("getBytes() invokes callback", t => {
  getTransactionStrings(getTransactionStringsCommand.hashes, t.end);
});

test.cb("getBytes() passes correct arguments to callback", t => {
  getTransactionStrings(getTransactionStringsCommand.hashes, (err, res) => {
    t.is(
      err,
      null,
      "getBytes() should pass null as first argument in callback for successuful requests"
    );

    t.deepEqual(
      res,
      getTransactionStringsResponse.hbytes,
      "getBytes() should pass the correct response as second argument in callback"
    );

    t.end();
  });
});
