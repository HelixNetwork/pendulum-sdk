import test from "ava";
import { isEmpty, isNinesHBytes } from "../src";

test("isEmpty() returns true for all-0s.", t => {
  t.is(isEmpty("0000"), true, "isEmpty() should return true for all-0s.");

  t.is(
    isNinesHBytes("0000"), // isEmpty() alias
    true,
    "isNinesHBytes() should return true for all-0s."
  );
});

test("isEmpty() returns false for non-0s.", t => {
  t.is(isEmpty("abc000"), false, "isEmpty() should return false for non-0s.");

  t.is(
    isNinesHBytes("abc000"),
    false,
    "isNinesHBytes() should return false for non-0s."
  );
});
