import test from "ava";
import { isHBytesOfMaxLength } from "../src";

test("isHBytesOfMaxLength() returns true for valid bytes and length.", t => {
  const validHBytes =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523e";

  t.is(
    isHBytesOfMaxLength(validHBytes, 2 * 32), // replaced 81 bytes with 2 * 32 bytes
    true,
    "isHBytesOfMaxLength() should return true for valid bytes and length."
  );

  t.is(
    isHBytesOfMaxLength("abcdabcd", 2 * 32), // replaced 81 bytes with 2 * 32 bytes
    true,
    "isHBytesOfMaxLength() should return true for valid bytes and length."
  );
});

test("isHBytesOfMaxLength() returns false for bytes of invalid length.", t => {
  const bytes = "abcdef";

  t.is(
    isHBytesOfMaxLength(bytes, 4),
    false,
    "isHBytesOfMaxLength() should return false for bytes of invalid length."
  );
});

test("isHBytesOfMaxLength() returns false for invalid bytes.", t => {
  const invalidHBytes =
    "1234accc505a524546494757484d4d3959475342535a425542544b56554d4e474f573953535439595648574b4a4d57535639455a465356504849564e5a51504c5a45";

  t.is(
    isHBytesOfMaxLength(invalidHBytes, 2 * 32 + 4),
    false,
    "isHBytesOfMaxLength() should return false for invalid bytes."
  );
});
