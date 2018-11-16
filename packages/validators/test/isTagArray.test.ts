import test from "ava";
import { isTagArray } from "../src";

test("isTagArray() returns true for valid tag.", t => {
  t.is(
    isTagArray(["aaaa"]),
    true,
    "isTagArray() should return true for valid tag."
  );

  t.is(
    isTagArray(["aaaa".repeat(4)]),
    true,
    "isTagArray() should return true for valid tag."
  );
});

test("isTagArray() returns false for tag tag.", t => {
  t.is(
    isTagArray(["aaaaER"]),
    false,
    "isTagArray() should return false for tag of invalid bytes."
  );

  t.is(
    isTagArray(["aaaa".repeat(4) + "a"]),
    false,
    "isTagArray() should return false for tag of invalid length."
  );
});
