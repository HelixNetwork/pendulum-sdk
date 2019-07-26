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
    "isAttachedHBytesArray() returns true for valid attached hbytes"
  );

  t.is(
    isAttachedHBytesArray(attachedTxHexOfInvalidChars),
    false,
    "isAttachedHBytesArray() returns false for invalid hbytes"
  );

  t.is(
    isAttachedHBytesArray(attachedTxHexOfInvalidLength),
    false,
    "isAttachedHBytesArray() return false for hbytes of invalid length"
  );
});
