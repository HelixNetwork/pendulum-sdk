import { createHttpClient } from "@helix/http-client";
import test from "ava";
import { INVALID_TRANSACTION_HASH } from "../../../errors";
import { createGetHBytes } from "../../src";
import { getHBytesCommand, getHBytesResponse } from "./nocks/getHBytes";

const getHBytes = createGetHBytes(createHttpClient());

test("getHBytes() resolves to correct response", async t => {
  t.deepEqual(
    await getHBytes(getHBytesCommand.hashes),
    getHBytesResponse.hbytes,
    "getHBytes() should resolve to correct tryte array"
  );
});

test("getHBytes() rejects with correct error for invalid hashes", t => {
  const invalidHashes = ["asdasDSFDAFD"];

  t.is(
    t.throws(() => getHBytes(invalidHashes), Error).message,
    `${INVALID_TRANSACTION_HASH}: ${invalidHashes[0]}`,
    "getHBytes() should throw error for invalid hashes"
  );
});

test.cb("getHBytes() invokes callback", t => {
  getHBytes(getHBytesCommand.hashes, t.end);
});

test.cb("getHBytes() passes correct arguments to callback", t => {
  getHBytes(getHBytesCommand.hashes, (err, res) => {
    t.is(
      err,
      null,
      "getHBytes() should pass null as first argument in callback for successuful requests"
    );

    t.deepEqual(
      res,
      getHBytesResponse.hbytes,
      "getHBytes() should pass the correct response as second argument in callback"
    );

    t.end();
  });
});
