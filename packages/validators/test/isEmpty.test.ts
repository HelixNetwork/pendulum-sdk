import test from "ava";
import { isEmpty, isNinesHBytes } from "../src";

test("isEmpty() returns true for all-9s.", t => {
  t.is(isEmpty("99999"), true, "isEmpty() should return true for all-9s.");

  t.is(
    isNinesHBytes("99999"), // isEmtpy() alias
    true,
    "isNinesHBytes() should return true for all-9s."
  );
});

test("isEmpty() returns false for non-9s.", t => {
  t.is(isEmpty("ASDF999"), false, "isEmpty() should return false for non-9s.");

  t.is(
    isNinesHBytes("ASDF999"),
    false,
    "isNinesHBytes() should return false for non-9s."
  );
});
