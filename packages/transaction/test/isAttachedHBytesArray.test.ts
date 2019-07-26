import {
  attachedTxHex,
  attachedTxHexOfInvalidChars,
  attachedTxHexOfInvalidLength,
  attachedTransactionObjects,
  transactionObject
} from "@helixnetwork/samples";
import test from "ava";
import { isAttachedHBytesArray } from "../src";

test("isAttachedHBytesArray()", t => {
  t.is(
    isAttachedHBytesArray(attachedTxHex),
    true,
    "isAttachedHBytesArray() returns true for valid attached txHex"
  );

  t.is(
    isAttachedHBytesArray(attachedTxHexOfInvalidChars),
    false,
    "isAttachedHBytesArray() returns false for invalid txHex"
  );

  t.is(
    isAttachedHBytesArray(attachedTxHexOfInvalidLength),
    false,
    "isAttachedHBytesArray() return false for txHex of invalid length"
  );
});
