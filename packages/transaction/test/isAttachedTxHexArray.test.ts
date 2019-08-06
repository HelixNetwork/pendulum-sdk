import {
  attachedTxHex,
  attachedTxHexOfInvalidChars,
  attachedTxHexOfInvalidLength
} from "@helixnetwork/samples";
import test from "ava";
import { isAttachedTxHexArray } from "../src";

test("isAttachedTxHexArray()", t => {
  t.is(
    isAttachedTxHexArray(attachedTxHex),
    true,
    "isAttachedTxHexArray() returns true for valid attached txs"
  );

  t.is(
    isAttachedTxHexArray(attachedTxHexOfInvalidChars),
    false,
    "isAttachedTxHexArray() returns false for invalid txs"
  );

  t.is(
    isAttachedTxHexArray(attachedTxHexOfInvalidLength),
    false,
    "isAttachedTxHexArray() return false for txs of invalid length"
  );
});
