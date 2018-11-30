import test from "ava";
import { isHBytesOfExactLength } from "../src";

test("isHBytes() returns true for valid bytes of exact length.", t => {
  const validHBytes =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee";

  t.is(
    isHBytesOfExactLength(validHBytes, 64),
    true,
    "isHBytes() should return true for valid bytes of exact length."
  );
});

test("isHBytes() returns false for bytes of invalid length.", t => {
  const bytes = "abcde123123";

  t.is(
    isHBytesOfExactLength(bytes, 12),
    false,
    "isHBytes() should return false for bytes of invalid length."
  );
});

test("isHBytes() returns false for invalid bytes.", t => {
  const invalidHBytes = "aBcd111111";

  t.is(
    isHBytesOfExactLength(invalidHBytes, 10),
    false,
    "isHBytes() should return false for invalid bytes."
  );
});
