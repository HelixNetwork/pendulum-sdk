import { createHttpClient } from "@helixnetwork/http-client";
import test from "ava";
import { INVALID_TRANSACTION_HASH } from "../../../errors";
import { createGetHBytes } from "../../src";
import { getHBytesCommand, getHBytesResponse } from "./nocks/getHBytes";

const getHBytes = createGetHBytes(createHttpClient());

test("getBytes() resolves to correct response", async t => {
  t.deepEqual(
    await getHBytes(getHBytesCommand.hashes),
    getHBytesResponse.hbytes,
    "getBytes() should resolve to correct tryte array"
  );
});

test("getBytes() rejects with correct error for invalid hashes", t => {
  const invalidHashes = ["asdasDSFDAFD"];

  t.is(
    t.throws(() => getHBytes(invalidHashes), Error).message,
    `${INVALID_TRANSACTION_HASH}: ${invalidHashes[0]}`,
    "getBytes() should throw error for invalid hashes"
  );
});

test.cb("getBytes() invokes callback", t => {
  getHBytes(getHBytesCommand.hashes, t.end);
});

test.cb("getBytes() passes correct arguments to callback", t => {
  getHBytes(getHBytesCommand.hashes, (err, res) => {
    t.is(
      err,
      null,
      "getBytes() should pass null as first argument in callback for successuful requests"
    );

    t.deepEqual(
      res,
      getHBytesResponse.hbytes,
      "getBytes() should pass the correct response as second argument in callback"
    );

    t.end();
  });
});
