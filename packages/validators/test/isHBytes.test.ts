import test from "ava";
import { isHBytes } from "../src";

test("isHByte() returns true for valid bytes string in hex.", t => {
  const validHBytes =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee";

  t.is(
    isHBytes(validHBytes),
    true,
    "isHBytes() should return true for valid bytes."
  );
});

test("isHByte() returns true for valid bytes and length.", t => {
  const bytes = "abcdef12";

  t.is(
    isHBytes(bytes, 8),
    true,
    "isHBytes() should return true for valid bytes and valid length."
  );
});

test("isHBytes() returns false for bytes of invalid length.", t => {
  const bytes = "abcdef123";
  t.is(
    isHBytes(bytes, 10),
    false,
    "isHBytes() should return false for bytes of invalid length."
  );
});

test("isHBytes() returns false for invalid bytes.", t => {
  const invalidHBytes =
    "ghbnabc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee";

  t.is(
    isHBytes(invalidHBytes),
    false,
    "isHBytes() should return false for invalid bytes."
  );
});
