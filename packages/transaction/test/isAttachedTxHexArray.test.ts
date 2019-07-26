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
    "isAttachedTxHexArray() returns true for valid attached txHex"
  );

  t.is(
    isAttachedTxHexArray(attachedTxHexOfInvalidChars),
    false,
    "isAttachedTxHexArray() returns false for invalid txHex"
  );

  t.is(
    isAttachedTxHexArray(attachedTxHexOfInvalidLength),
    false,
    "isAttachedTxHexArray() return false for txHex of invalid length"
  );
});
