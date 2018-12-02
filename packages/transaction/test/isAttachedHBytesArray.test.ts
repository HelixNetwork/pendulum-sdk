import test from "ava";
import {
  attachedHBytes,
  attachedHBytesOfInvalidChars,
  attachedHBytesOfInvalidLength
} from "@helixnetwork/samples";
import { isAttachedHBytesArray } from "../src";

test("isAttachedHBytesArray()", t => {
  t.is(
    isAttachedHBytesArray(attachedHBytes),
    true,
    "isAttachedHBytesArray() returns true for valid attached hbytes"
  );

  t.is(
    isAttachedHBytesArray(attachedHBytesOfInvalidChars),
    false,
    "isAttachedHBytesArray() returns false for invalid hbytes"
  );

  t.is(
    isAttachedHBytesArray(attachedHBytesOfInvalidLength),
    false,
    "isAttachedHBytesArray() return false for hbytes of invalid length"
  );
});
